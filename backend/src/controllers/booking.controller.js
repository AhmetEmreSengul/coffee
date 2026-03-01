import {
  addMinutes,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  setHours,
  setMinutes,
} from "date-fns";
import { sendBookingEmail } from "../emails/emailHandler.js";
import Booking from "../models/Booking.js";
import Table from "../models/Table.js";
import crypto from "crypto";
import qrcode from "qrcode";

const OPENING_HOUR = 9;
const CLOSING_HOUR = 24;
const SLOT_DURATION = 120;

export const getTable = async (_, res) => {
  try {
    const tables = await Table.find();

    if (tables.length === 0) {
      return res.status(404).json({ message: "No available tables" });
    }

    res.status(200).json(tables);
  } catch (error) {
    console.error("Error getting tables", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tableNumber, bookingTime } = req.body;

    if (!tableNumber || !bookingTime.start || !bookingTime.end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(bookingTime.end) <= new Date(bookingTime.start)) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    if (new Date(bookingTime.start) < new Date()) {
      return res
        .status(400)
        .json({ message: "Start time must be in the future" });
    }

    const table = await Table.findById(tableNumber);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    if (table.status !== "active") {
      return res
        .status(400)
        .json({ message: "Table not available for booking at the moment" });
    }

    const overlappingBooking = await Booking.findOne({
      tableNumber,
      $or: [
        {
          "bookingTime.start": { $lt: new Date(bookingTime.end) },
          "bookingTime.end": { $gt: new Date(bookingTime.start) },
        },
      ],
    });

    if (overlappingBooking) {
      return res
        .status(409)
        .json({ message: "Table is already booked for this time" });
    }

    const qrToken = crypto.randomBytes(32).toString("hex");

    const booking = new Booking({
      user: userId,
      tableNumber,
      bookingTime,
      qrToken,
    });

    await booking.save();

    await booking.populate("user", "name email");
    await booking.populate("tableNumber", "number capacity");

    sendBookingEmail(
      booking.user.email,
      booking.bookingTime.start,
      booking.bookingTime.end,
      booking.tableNumber.number,
    );

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error booking table", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingQrCode = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const qrData = JSON.stringify({
      bookingId: booking._id,
      token: booking.qrToken,
    });

    const qrCodeImage = await qrcode.toDataURL(qrData);

    res.status(200).json({
      qrCode: qrCodeImage,
      booking,
    });
  } catch (error) {
    console.error("Error getting QR code", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Error deleting booking", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();

    const bookings = await Booking.find({
      user: userId,
      "bookingTime.end": { $gte: now },
    })
      .populate("tableNumber", "number capacity")
      .sort({ "bookingTime.start": -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTableBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const now = new Date();

    const tableBookings = await Booking.find(
      {
        tableNumber: id,
        "bookingTime.end": { $gte: now },
      },
      { "bookingTime.start": 1, "bookingTime.end": 1, _id: 0 },
    ).sort({ "bookingTime.start": 1 });

    res.status(200).json(tableBookings);
  } catch (error) {
    console.error("Error fetching bookings for this table", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingTime } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
    }

    if (bookingTime) {
      if (new Date(bookingTime.end) <= new Date(bookingTime.start)) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }
    }

    const overlappingBooking = await Booking.findOne({
      _id: { $ne: id },
      tableNumber: booking.tableNumber,
      "bookingTime.start": { $lt: new Date(bookingTime.end) },
      "bookingTime.end": { $gt: new Date(bookingTime.start) },
    });

    if (overlappingBooking) {
      return res
        .status(409)
        .json({ message: "Table is already booked for this time slot" });
    }

    booking.bookingTime = bookingTime;

    await booking.save();
    await booking.populate("user", "name email");
    await booking.populate("tableNumber", "number capacity");

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const table = await Table.findById(id);
    if (!table || table.status !== "active") {
      return res.status(404).json({ message: "Table not available" });
    }

    let dayStart = parseISO(date);
    dayStart = setHours(setMinutes(dayStart, 0), OPENING_HOUR);

    let dayEnd = parseISO(date);
    dayEnd = setHours(setMinutes(dayEnd, 0), CLOSING_HOUR);

    const bookings = await Booking.find({
      tableNumber: id,
      "bookingTime.end": { $gte: dayStart },
      "bookingTime.start": { $lt: dayEnd },
    }).select("bookingTime");

    const slots = [];
    let current = new Date(dayStart);

    while (
      isBefore(addMinutes(current, SLOT_DURATION), dayEnd) ||
      isEqual(addMinutes(current, SLOT_DURATION), dayEnd)
    ) {
      const slotStart = new Date(current);
      const slotEnd = addMinutes(slotStart, SLOT_DURATION);

      const overlaps = bookings.some((b) => {
        const bookingStart = new Date(b.bookingTime.start);
        const bookingEnd = new Date(b.bookingTime.end);

        return (
          isBefore(slotStart, bookingEnd) && isAfter(slotEnd, bookingStart)
        );
      });

      if (!overlaps) {
        slots.push({
          start: slotStart,
          end: slotEnd,
        });
      }

      current = addMinutes(current, SLOT_DURATION);
    }

    res.status(200).json(slots);
  } catch (error) {
    console.error("Error generating slots:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

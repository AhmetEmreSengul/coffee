import { sendBookingEmail } from "../emails/emailHandler.js";
import Booking from "../models/Booking.js";
import Table from "../models/Table.js";

import crypto from "crypto";
import qrcode from "qrcode";

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
      booking.tableNumber.number
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
      tokeen: booking.qrToken,
      tableNumber: booking.tableNumber,
      start: booking.bookingTime.start,
      end: booking.bookingTime.end,
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

    const bookings = await Booking.find({ user: userId })
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

    const tableBookings = await Booking.find(
      { tableNumber: id },
      { "bookingTime.start": 1, "bookingTime.end": 1, _id: 0 }
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

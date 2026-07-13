import { isValidObjectId } from "mongoose";
import { sendBookingEmail } from "../emails/emailHandler.js";
import Booking from "../models/Booking.js";
import Table from "../models/Table.js";
import crypto from "crypto";
import qrcode from "qrcode";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tableNumber, bookingTime } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !bookingTime ||
      !tableNumber ||
      !bookingTime.start ||
      !bookingTime.end
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidObjectId(tableNumber)) {
      return res.status(400).json({ message: "Invalid table number" });
    }

    const start = new Date(bookingTime.start);
    const end = new Date(bookingTime.end);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    if (start < now) {
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
      "bookingTime.start": { $lt: end },
      "bookingTime.end": { $gt: start },
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
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.user.equals(userId)) {
      return res.status(403).json({ message: "Forbidden" });
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
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.user.equals(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Error deleting booking", error.message);
    return res.status(500).json({ message: "Internal server error" });
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

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingTime } = req.body;

    if (!bookingTime || !bookingTime.start || !bookingTime.end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const start = new Date(bookingTime.start);
    const end = new Date(bookingTime.end);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    if (start < now) {
      return res
        .status(400)
        .json({ message: "Start time must be in the future" });
    }

    const overlappingBooking = await Booking.findOne({
      _id: { $ne: id },
      tableNumber: booking.tableNumber,
      "bookingTime.start": { $lt: start },
      "bookingTime.end": { $gt: end },
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

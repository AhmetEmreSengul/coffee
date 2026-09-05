import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Booking from "../models/Booking.js";
import Coffee from "../models/Coffee.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import {
  CoffeeRequestBody,
  VerifyBookingBody,
} from "../schemas/admin.schema.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const users = await User.find({
      _id: { $ne: userId },
      role: "user",
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookingsById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bookings = await Booking.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrdersById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const banUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = !user.isBanned;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyBookingQr = async (
  req: Request<{}, {}, VerifyBookingBody>,
  res: Response,
) => {
  try {
    const { bookingId, token } = req.body;

    if (!isValidObjectId(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("tableNumber")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.qrToken !== token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (booking.checkedIn) {
      return res.status(400).json({ message: "Booking already checked in" });
    }

    const now = new Date();

    const start = new Date(booking.bookingTime.start);
    const end = new Date(booking.bookingTime.end);

    const earlyGraceMinutes = 30;
    const lateGraceMinutes = 60;

    const allowedStart = new Date(start.getTime() - earlyGraceMinutes * 60000);
    const allowedEnd = new Date(end.getTime() + lateGraceMinutes * 60000);

    if (now < allowedStart || now > allowedEnd) {
      return res.status(403).json({
        message: "Booking is not valid at this time",
      });
    }

    booking.checkedIn = true;
    await booking.save();

    res.status(200).json({
      authorized: true,
      message: "Booking checked in successfully",
      user: booking.user,
      table: booking.tableNumber,
    });
  } catch (error) {
    console.error("Error verifying QR code", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addCoffee = async (
  req: Request<{}, {}, CoffeeRequestBody>,
  res: Response,
) => {
  try {
    const { title, type, price, image, description } = req.body;

    const coffee = await Coffee.create({
      title,
      type,
      price,
      image,
      description,
    });

    res.status(201).json(coffee);
  } catch (error) {
    console.error("Error adding coffee", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoffeeById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid coffee ID" });
    }

    const coffee = await Coffee.findById(id);

    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    res.status(200).json(coffee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editCoffee = async (
  req: Request<{ id: string }, {}, CoffeeRequestBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { title, type, price, image, description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid coffee ID" });
    }

    const coffee = await Coffee.findById(id);

    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    coffee.title = title;
    coffee.type = type;
    coffee.price = price;
    coffee.image = image;
    coffee.description = description;

    await coffee.save();

    res.status(200).json(coffee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCoffee = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid coffee ID" });
    }

    const coffee = await Coffee.findByIdAndDelete(id);

    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    res.status(200).json({ message: "Coffee deleted" });
  } catch (error) {
    console.error("Error deleting coffee", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

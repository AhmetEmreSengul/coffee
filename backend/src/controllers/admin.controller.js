import Booking from "../models/Booking.js";
import Coffee from "../models/Coffee.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      role: "user",
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookingsById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    user.isBanned = !user.isBanned;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyBookingQr = async (req, res) => {
  try {
    const { bookingId, token } = req.body;

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
    console.error("Error verifying QR code", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addCoffee = async (req, res) => {
  try {
    const { title, type, price, image, description } = req.body;

    if (!title || !type || !price || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const coffee = Coffee.create({
      title,
      type,
      price,
      image,
      description,
    });

    res.status(201).json(coffee);
  } catch (error) {
    console.error("Error adding coffee", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoffeeById = async (req, res) => {
  try {
    const { id } = req.params;
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

export const editCoffee = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, price, image, description } = req.body;

    if (!title || !type || !price || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
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

export const deleteCoffee = async (req, res) => {
  try {
    const { id } = req.params;
    const coffee = await Coffee.findByIdAndDelete(id);

    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    res.status(200).json({ message: "Coffee deleted" });
  } catch (error) {
    console.error("Error deleting coffee", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

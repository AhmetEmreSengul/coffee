import Booking from "../models/Booking.js";
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

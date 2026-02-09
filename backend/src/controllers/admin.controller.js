import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookingsById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ user: id });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ user: id });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import { sendCreateOrderEmail } from "../emails/emailHandler.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderItems, totalPrice, orderNote } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0 || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = await Order.create({
      user: userId,
      orderItems,
      totalPrice,
      orderNote,
    });

    const orderNumber = "ORD-" + order._id.toString().slice(-6).toUpperCase();

    order.orderNumber = orderNumber;
    await order.save();

    sendCreateOrderEmail(
      req.user.email,
      orderNumber,
      order.createdAt,
      totalPrice,
      orderItems,
      orderNote,
    );

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserLatestOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const order = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching latest order by user ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

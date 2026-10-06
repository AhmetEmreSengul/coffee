import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { sendCreateOrderEmail } from "../emails/emailHandler.js";
import Coffee from "../models/Coffee.js";
import Order from "../models/Order.js";
import { CreateOrderBody } from "../schemas/order.schema.js";
import stripe from "../lib/stripe.js";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { orderItems, orderNote, paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment intent ID is required" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(402).json({ message: "Payment failed" });
    }

    if (paymentIntent.metadata.userId !== userId.toString()) {
      return res.status(403).json({ message: "Payment mismatch" });
    }

    const coffees = await Coffee.find({
      _id: { $in: orderItems.map((i) => i._id) },
    });

    let totalPrice = 0;

    for (const item of orderItems) {
      const coffee = coffees.find((c) => c._id.toString() === item._id);
      if (!coffee) continue;

      totalPrice += coffee.price * item.quantity;
    }

    const totalAmount = Math.round(totalPrice * 100);

    if (totalAmount !== paymentIntent.amount) {
      return res.status(402).json({ message: "Payment amount mismatch" });
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
export const getOrderByUserId = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Error fetching orders by user ID:",
      (error as Error).message,
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserLatestOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const order = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(
      "Error fetching latest order by user ID:",
      (error as Error).message,
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.user.equals(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

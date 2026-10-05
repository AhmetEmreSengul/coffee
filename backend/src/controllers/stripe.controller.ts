import Coffee from "../models/Coffee.js";
import type { Request, Response } from "express";
import { CreatePaymentBody } from "../schemas/stripe.schema.js";
import stripe from "../lib/stripe.js";

export const createPayment = async (
  req: Request<{}, {}, CreatePaymentBody>,
  res: Response,
) => {
  try {
    const { items } = req.body;

    const coffees = await Coffee.find({
      _id: { $in: items.map((i) => i.id) },
    });

    let totalAmount = 0;

    for (const item of items) {
      const coffee = coffees.find((c) => c._id.toString() === item.id);
      if (!coffee) continue;

      totalAmount += coffee.price * item.quantity;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "try",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user!._id.toString() },
    });

    res.status(200).json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

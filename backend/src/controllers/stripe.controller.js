import Stripe from "stripe";
import { ENV } from "../lib/env.js";
import Coffee from "../models/Coffee.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

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
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import Stripe from "stripe";
import { ENV } from "../lib/env.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "try",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

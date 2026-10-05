import Stripe from "stripe";
import { ENV } from "./env.js";

if (!ENV.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY must be set");
}

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);


export default stripe;
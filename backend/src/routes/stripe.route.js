import express from "express";
import { createPayment } from "../controllers/stripe.controller.js";

const router = express.Router();

router.post("/create-payment-intent", createPayment)

export default router;

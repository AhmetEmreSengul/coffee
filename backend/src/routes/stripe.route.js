import express from "express";
import { createPayment } from "../controllers/stripe.controller.js";
import { isBanned } from "../middleware/banned.middleware.js";

const router = express.Router();
router.use(isBanned);

router.post("/create-payment-intent", createPayment);

export default router;

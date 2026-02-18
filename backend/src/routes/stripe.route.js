import express from "express";
import { createPayment } from "../controllers/stripe.controller.js";
import { isBanned } from "../middleware/banned.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection);
router.use(protectRoute);
router.use(isBanned);

router.post("/create-payment-intent", createPayment);

export default router;

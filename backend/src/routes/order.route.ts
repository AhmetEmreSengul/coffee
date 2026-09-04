import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderByUserId,
  getUserLatestOrder,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isBanned } from "../middleware/banned.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { createOrderBody } from "../schemas/order.schema.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(arcjetProtection);
router.use(protectRoute);
router.use(isBanned);

router.post("/create-order", validate(createOrderBody), createOrder);
router.get("/last-order", getUserLatestOrder);
router.get("/past-orders", getOrderByUserId);
router.delete("/delete-order/:id", deleteOrder);

export default router;

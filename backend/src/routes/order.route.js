import express from "express";
import {
  createOrder,
  getOrderByUserId,
  getUserLatestOrder,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.post("/create-order", createOrder);
router.get("/last-order", getUserLatestOrder);
router.get("/past-orders", getOrderByUserId);

export default router;

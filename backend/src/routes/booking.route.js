import express from "express";
import {
  getTable,
  createBooking,
  getBookingQrCode,
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/available-tables", getTable);
router.post("/createBooking", protectRoute, createBooking);
router.get("/bookingQR/:id", protectRoute, getBookingQrCode);

export default router;

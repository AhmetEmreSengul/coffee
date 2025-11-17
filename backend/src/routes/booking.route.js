import express from "express";
import {
  getTable,
  createBooking,
  getBookingQrCode,
  cancelBooking,
  getUserBookings,
  updateBooking,
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/available-tables", getTable);
router.post("/createBooking", protectRoute, createBooking);
router.put("/updateBooking/:id", protectRoute, updateBooking)
router.get("/bookingQR/:id", getBookingQrCode);
router.get("/my-bookings", protectRoute, getUserBookings);
router.delete("/cancelBooking/:id", protectRoute, cancelBooking);

export default router;

import express from "express";
import {
  getTable,
  createBooking,
  getBookingQrCode,
  cancelBooking,
  getUserBookings,
  updateBooking,
  getTableBookings,
  verifyBookingQr,
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.get("/available-tables", getTable);
router.post("/createBooking", protectRoute, createBooking);
router.post("/verifyBooking", protectRoute, verifyBookingQr);
router.put("/updateBooking/:id", protectRoute, updateBooking);
router.get("/bookingQR/:id", getBookingQrCode);
router.get("/my-bookings", protectRoute, getUserBookings);
router.get("/table-bookings/:id", protectRoute, getTableBookings);
router.delete("/cancelBooking/:id", protectRoute, cancelBooking);

export default router;

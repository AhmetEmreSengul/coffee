import express from "express";
import {
  getTable,
  createBooking,
  getBookingQrCode,
  cancelBooking,
  getUserBookings,
  updateBooking,
  getTableBookings,
  getAvailableSlots,
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { isBanned } from "../middleware/banned.middleware.js";

const router = express.Router();
router.use(arcjetProtection);
router.use(protectRoute);
router.use(isBanned);

router.get("/available-tables", getTable);
router.get("/available-slots/:id", getAvailableSlots);
router.post("/createBooking", createBooking);
router.put("/updateBooking/:id", updateBooking);
router.get("/bookingQR/:id", getBookingQrCode);
router.get("/my-bookings", getUserBookings);
router.get("/table-bookings/:id", getTableBookings);
router.delete("/cancelBooking/:id", cancelBooking);

export default router;

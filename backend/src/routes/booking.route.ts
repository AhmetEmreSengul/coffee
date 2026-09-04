import express from "express";
import {
  cancelBooking,
  createBooking,
  getBookingQrCode,
  getUserBookings,
  updateBooking,
} from "../controllers/booking.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isBanned } from "../middleware/banned.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  bookingSchema,
  updateBookingSchema,
} from "../schemas/bookings.schema.js";

const router = express.Router();
router.use(arcjetProtection);
router.use(protectRoute);
router.use(isBanned);

router.post("/createBooking", validate(bookingSchema), createBooking);
router.put("/updateBooking/:id", validate(updateBookingSchema), updateBooking);
router.get("/bookingQR/:id", getBookingQrCode);
router.get("/my-bookings", getUserBookings);
router.delete("/cancelBooking/:id", cancelBooking);

export default router;

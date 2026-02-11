import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
  banUser,
  getAllUsers,
  getUserBookingsById,
  getUserOrdersById,
  verifyBookingQr,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.use(protectRoute);
router.use(isAdmin);

router.get("/allUsers", getAllUsers);
router.get("/userBookings/:id", getUserBookingsById);
router.get("/userOrders/:id", getUserOrdersById);
router.post("/banUser/:id", banUser);
router.post("/verifyBooking", verifyBookingQr);

export default router;

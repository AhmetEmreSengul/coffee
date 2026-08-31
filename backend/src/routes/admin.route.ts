import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
  addCoffee,
  banUser,
  deleteCoffee,
  editCoffee,
  getAllUsers,
  getCoffeeById,
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
router.get("/coffee/:id", getCoffeeById);
router.post("/addCoffee", addCoffee);
router.put("/editCoffee/:id", editCoffee);
router.delete("/deleteCoffee/:id", deleteCoffee)

export default router;

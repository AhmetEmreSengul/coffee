import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
  getAllUsers,
  getUserBookingsById,
  getUserOrdersById,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.use(protectRoute);
router.use(isAdmin);

router.get("/allUsers", getAllUsers);
router.get("/userBookings/:id", getUserBookingsById);
router.get("/userOrders/:id", getUserOrdersById);

export default router;

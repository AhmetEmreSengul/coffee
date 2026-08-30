import express from "express";
import {
  getAvailableSlots,
  getTable,
  getTableBookings,
} from "../controllers/table.controller.js";

const router = express.Router();

router.get("/available-tables", getTable);
router.get("/available-slots/:id", getAvailableSlots);
router.get("/table-bookings/:id", getTableBookings);

export default router;

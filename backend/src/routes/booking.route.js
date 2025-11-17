import express from "express";
import { getTable } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/available-tables", getTable);
/* router.post("/book", bookTable) */

export default router;

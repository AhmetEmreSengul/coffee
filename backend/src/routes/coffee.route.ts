import express from "express";
import { getAllCoffees } from "../controllers/coffee.controller.js";

const router = express.Router();

router.get("/", getAllCoffees)

export default router;

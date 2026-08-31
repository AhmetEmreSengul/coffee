import Coffee from "../models/Coffee.js";
import type { Request, Response } from "express";

export const getAllCoffees = async (req: Request, res: Response) => {
  try {
    const coffees = await Coffee.find({}).sort({ title: 1 });

    if (coffees.length === 0) {
      return res.status(404).json({ message: "No coffee found" });
    }

    res.status(200).json(coffees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

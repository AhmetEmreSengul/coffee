import mongoose from "mongoose";
import Coffee from "../models/Coffee.js";
import fs from "fs";
import { ENV } from "../lib/env.js";

const coffees = JSON.parse(fs.readFileSync("./src/data/coffee.json", "utf-8"));

const seedCoffees = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);

    await Coffee.deleteMany({});
    await Coffee.insertMany(coffees);
    console.log("Coffees seeded successfully!");
  } catch (error) {
    console.error("Error seeding coffees:", error);
  }
};

seedCoffees();

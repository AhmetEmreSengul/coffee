import mongoose from "mongoose";
import Table from "../models/Table.js";
import { ENV } from "../lib/env.js";

const tables = [
  { number: 1, capacity: 2, status: "active" },
  { number: 2, capacity: 2, status: "active" },
  { number: 3, capacity: 4, status: "active" },
  { number: 4, capacity: 4, status: "active" },
  { number: 5, capacity: 6, status: "active" },
  { number: 6, capacity: 2, status: "active" },
  { number: 7, capacity: 4, status: "active" },
  { number: 8, capacity: 6, status: "disabled" },
  { number: 9, capacity: 2, status: "active" },
  { number: 10, capacity: 2, status: "disabled" },
];

const populateTables = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);

    await Table.deleteMany({});

    const insertedTables = await Table.insertMany(tables);
    console.log(`Inserted ${insertedTables.length} tables`);
  } catch (error) {
    console.error("Error inserting tables", error.message);
  }
};

populateTables();

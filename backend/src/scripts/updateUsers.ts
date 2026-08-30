import mongoose from "mongoose";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

const updateUserFields = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI must be set");
    }

    await mongoose.connect(ENV.MONGO_URI);
    await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "user" } },
    );
    console.log("Users updated successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

updateUserFields();

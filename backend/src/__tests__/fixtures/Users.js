import mongoose from "mongoose";

export const userId = new mongoose.Types.ObjectId().toString();
export const userId2 = new mongoose.Types.ObjectId().toString();

export const testUser = {
  _id: userId,
  fullName: "Fake User",
  email: "fake.user@example.com",
  password: "hashed-test-password",
};
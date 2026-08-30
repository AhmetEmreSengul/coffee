import mongoose from "mongoose";

export const userId = new mongoose.Types.ObjectId().toString();
export const userId2 = new mongoose.Types.ObjectId().toString();
export const userId3 = new mongoose.Types.ObjectId().toString();

export const testUser = {
  _id: userId,
  fullName: "Fake User",
  email: "fake.user@example.com",
  password: "hashed-test-password",
};

export const testUser2 = {
  _id: userId2,
  fullName: "Fake User 2",
  email: "fake.user2@example.com",
  password: "hashed-test-password",
};

export const adminUser = {
  _id: userId3,
  fullName: "Admin User",
  email: "admin.user@example.com",
  password: "hashed-test-password",
  role: "admin",
};

export const createUserPayload = {
  fullName: "Fake User",
  email: "fake.user@example.com",
  password: "hashed-test-password",
};

export const loginUserPayload = {
  email: "fake.user@example.com",
  password: "hashed-test-password",
};

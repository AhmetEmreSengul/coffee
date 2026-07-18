import mongoose from "mongoose";
import User from "../../models/User.js";


let emailCounter = 0;


export const createAndSaveTestUser = async (overrides = {}) => {
  emailCounter += 1;
  const user = new User({
    email: `test.user.${emailCounter}@example.com`,
    fullName: "Test User",
    password: "hashed-test-password", // gerçek hashleme burada gerekmez, schema zorunluluğu için
    ...overrides,
  });
  return user.save();
};

export const buildFakeReqUser = (overrides = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  email: "fake.user@example.com",
  fullName: "Fake User",
  ...overrides,
});
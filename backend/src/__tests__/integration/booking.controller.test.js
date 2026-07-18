import { jest } from "@jest/globals";
import request from "supertest";
import { futureSlot } from "../fixtures/Bookings.js";
import { createTestTable } from "../fixtures/Tables.js";
import { createAndSaveTestUser } from "../fixtures/Users.js";
import { clearDatabase, closeDatabase, connect } from "../setup/dbHandler.js";

jest.unstable_mockModule("../../middleware/auth.middleware.js", () => ({
  protectRoute: (req, res, next) => {
    req.user = globalThis.__TEST_USER__;
    next();
  },
}));

const actualEmailHandler = await import("../../emails/emailHandler.js");
jest.unstable_mockModule("../../emails/emailHandler.js", () => ({
  ...actualEmailHandler,
  sendBookingEmail: jest.fn().mockResolvedValue(undefined),
}));

const { default: app } = await import("../../app.js");

describe("Booking routes — createBooking", () => {
  let testUser;
  let testTable;

  beforeAll(connect);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    testUser = await createAndSaveTestUser();
    testTable = await createTestTable();
    globalThis.__TEST_USER__ = testUser;
  });

  it("crete a booking with valid data and return 201", async () => {
    const { start, end } = futureSlot();

    const res = await request(app).post("/book/createBooking").send({
      tableNumber: testTable._id.toString(),
      bookingTime: { start, end },
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.tableNumber).toBeTruthy();
  });

  it("if bookingTime is not provided return 400", async () => {
    const res = await request(app).post("/book/createBooking").send({
      tableNumber: testTable._id.toString(),
      // bookingTime: { start, end },
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });
});

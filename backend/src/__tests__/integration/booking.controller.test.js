import { afterAll, afterEach, beforeAll, describe } from "@jest/globals";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import { ENV } from "../../lib/env";
import Booking from "../../models/Booking";
import Table from "../../models/Table";
import User from "../../models/User";
import {
  bookingPayload,
  overlappingBooking,
  overlappingBookingPayload,
  overlappingUpdateBooking,
  unauthorizedBooking,
} from "../fixtures/Bookings";
import { testUser, userId } from "../fixtures/Users";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler";
import { testTable, testTableDisabled } from "../fixtures/Tables";

const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
  expiresIn: "7d",
});

describe("booking", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    await User.create(testUser);
    await Table.create([testTable, testTableDisabled]);
    await Booking.create([
      overlappingBooking,
      overlappingUpdateBooking,
      unauthorizedBooking,
    ]);
  });

  describe("get booking route", () => {
    describe("given the user is logged in", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/book/my-bookings")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(200);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/book/my-bookings")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user is trying to get someone else's booking QR", () => {
      it("should return 403 with a message of 'Forbidden'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/book/bookingQR/656f8a3b2e7c1a4d8f9b1009")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Forbidden" });
      });
    });

    describe("given the user provided a invalid booking ID when trying to get booking QR", () => {
      it("should return 400 with a message of 'Invalid booking ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/book/bookingQR/invalid-booking-id")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid booking ID" });
      });
    });

    describe("given the provided bookingID is not found", () => {
      it("should return 404 with a message of 'Booking not found'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/book/bookingQR/656f8a3b2e7c1a4d8f9b1003")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Booking not found" });
      });
    });

    describe("given the user is not logged in and trying to get booking QR", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/book/bookingQR/656f8a3b2e7c1a4d8f9b1003")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });
  });

  describe("create booking route", () => {
    describe("given the booking data is valid", () => {
      it("should return 201", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(bookingPayload);

        console.log(statusCode, body);

        expect(statusCode).toBe(201);
      });
    });

    describe("given the bookingTime is not provided", () => {
      it("should return 400 with a message of 'All fields required", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({ ...bookingPayload, bookingTime: null });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "All fields are required" });
      });
    });

    describe("given the end time is before the start time", () => {
      it("should return 400 with a message of 'End time must be after start time'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...bookingPayload,
            bookingTime: {
              start: "2027-01-15T16:00:00.000Z",
              end: "2027-01-15T14:00:00.000Z",
            },
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "End time must be after start time" });
      });
    });

    describe("given the start time is in the past", () => {
      it("should return 400 with a message of 'Start time must be in the future'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...bookingPayload,
            bookingTime: {
              start: "2020-01-15T14:00:00.000Z",
              end: "2020-01-15T16:00:00.000Z",
            },
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Start time must be in the future" });
      });
    });

    describe("given the table is not found", () => {
      it("should return 404 with a message of 'Table not found'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({ ...bookingPayload, tableNumber: "656f8a3b2e7c1a4d8f9b9999" });

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Table not found" });
      });

      describe("given the given table ID is invalid", () => {
        it("should return 400 with a message of 'Invalid table number'", async () => {
          const { statusCode, body } = await supertest(app)
            .post("/book/createBooking")
            .set("User-Agent", "jest")
            .set("Cookie", [`jwt=${token}`])
            .send({ ...bookingPayload, tableNumber: "invalid-table-id" });

          expect(statusCode).toBe(400);
          expect(body).toEqual({ message: "Invalid table number" });
        });
      });
    });

    describe("given the the table user is trying to book is not active", () => {
      it("should return 400 with a message of 'Table not available for booking at the moment'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({ ...bookingPayload, tableNumber: "656f8a3b2e7c1a4d8f9b1004" });

        expect(statusCode).toBe(400);
        expect(body).toEqual({
          message: "Table not available for booking at the moment",
        });
      });
    });

    describe("given the the table user is trying to book is already booked", () => {
      it("should return 400 with a message of 'Table is already booked'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(overlappingBookingPayload);

        expect(statusCode).toBe(409);
        expect(body).toEqual({
          message: "Table is already booked for this time",
        });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .send(bookingPayload);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the format is invalid", () => {
      it("should return 400 with a message of 'Invalid date format'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/book/createBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...bookingPayload,
            bookingTime: {
              start: "date",
              end: "date",
            },
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid date format" });
      });
    });
  });

  describe("update booking route", () => {
    describe("given the booking is not found", () => {
      it("should return 404 with a message of 'Booking not found'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/656f8a3b2e7c1a4d8f9b9999")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(bookingPayload);

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Booking not found" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/656f8a3b2e7c1a4d8f9b1007")
          .set("User-Agent", "jest")
          .send(bookingPayload);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the end time is before the start time", () => {
      it("should return 400 with a message of 'End time must be after start time'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/656f8a3b2e7c1a4d8f9b1007")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...bookingPayload,
            bookingTime: {
              start: "2022-01-01T00:00:00.000Z",
              end: "2022-01-01T00:00:00.000Z",
            },
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "End time must be after start time" });
      });
    });

    describe("given the date user is trying to update is in the past", () => {
      it("should return 400 with a message of 'Start time must be in the future'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/656f8a3b2e7c1a4d8f9b1007")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...bookingPayload,
            bookingTime: {
              start: "2024-01-01T00:00:00.000Z",
              end: "2024-02-01T00:00:00.000Z",
            },
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Start time must be in the future" });
      });
    });

    describe("given the time user chose is booked", () => {
      it("should return 409 with a message of 'Table is already booked for this time'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/656f8a3b2e7c1a4d8f9b1007")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(overlappingBookingPayload);

        expect(statusCode).toBe(409);
        expect(body).toEqual({
          message: "Table is already booked for this time slot",
        });
      });
    });

    describe("given the user is trying to update someone else's booking", () => {
      it("should return 403 with a message of 'Forbidden'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/656f8a3b2e7c1a4d8f9b1009")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(bookingPayload);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Forbidden" });
      });
    });

    describe("given the user provided a invalid booking ID", () => {
      it("should return 400 with a message of 'Invalid booking ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/book/updateBooking/invalid-booking-id")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(bookingPayload);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid booking ID" });
      });
    });
  });

  describe("delete booking route", () => {
    describe("given the booking ID is invalid", () => {
      it("should return 400 with a message of 'Invalid booking ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete("/book/cancelBooking/invalid-booking-id")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid booking ID" });
      });
    });

    describe("given the user is trying to delete someone else's booking", () => {
      it("should return 403 with a message of 'Forbidden'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete("/book/cancelBooking/656f8a3b2e7c1a4d8f9b1009")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Forbidden" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete("/book/cancelBooking/656f8a3b2e7c1a4d8f9b1007")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });
  });
});

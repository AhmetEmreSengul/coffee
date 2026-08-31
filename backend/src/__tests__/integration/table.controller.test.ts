import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import supertest from "supertest";
import app from "../../app.js";
import Booking from "../../models/Booking.js";
import Table from "../../models/Table.js";
import { overlappingBooking } from "../fixtures/Bookings.js";
import { testTable, testTableDisabled } from "../fixtures/Tables.js";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler.js";


describe("table", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    await Table.create([testTable, testTableDisabled]);
    await Booking.create(overlappingBooking);
  });

  describe("get table route", () => {
    describe("given the user either logged in or not", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/table/available-tables")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(200);
      });
    });

    describe("given the table has a booking", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/table/table-bookings/${testTable._id}`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(200);
        expect(body).toEqual([
          {
            bookingTime: {
              end: "2027-01-15T16:00:00.000Z",
              start: "2027-01-15T14:00:00.000Z",
            },
          },
        ]);
      });
    });

    describe("given the user provided a invalid table ID", () => {
      it("should return 400 with a message of 'Invalid table ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/table/table-bookings/invalid-table-id")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid table ID" });
      });
    });
  });

  describe("given the table is not found", () => {
    it("should return 404 with a message of 'Table not available'", async () => {
      const { statusCode, body } = await supertest(app)
        .get("/table/table-bookings/656f8a3b2e7c1a4d8f9b9999")
        .set("User-Agent", "jest");

      expect(statusCode).toBe(404);
      expect(body).toEqual({ message: "Table not available" });
    });
  });

  describe("given the table is not active", () => {
    it("should return 404 with a message of 'Table not available'", async () => {
      const { statusCode, body } = await supertest(app)
        .get(`/table/table-bookings/${testTableDisabled._id}`)
        .set("User-Agent", "jest");

      expect(statusCode).toBe(404);
      expect(body).toEqual({ message: "Table not available" });
    });
  });

  describe("generate time-slots route", () => {
    describe("given the table is active and has slots available", () => {
      it("should return available time slots", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/table/available-slots/${testTable._id}/?date=2027-01-15`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(200);
        expect(body).toEqual([
          {
            end: "2027-01-15T08:00:00.000Z",
            start: "2027-01-15T06:00:00.000Z",
          },
          {
            end: "2027-01-15T10:00:00.000Z",
            start: "2027-01-15T08:00:00.000Z",
          },
          {
            end: "2027-01-15T12:00:00.000Z",
            start: "2027-01-15T10:00:00.000Z",
          },
          {
            end: "2027-01-15T14:00:00.000Z",
            start: "2027-01-15T12:00:00.000Z",
          },
          {
            end: "2027-01-15T18:00:00.000Z",
            start: "2027-01-15T16:00:00.000Z",
          },
          {
            end: "2027-01-15T20:00:00.000Z",
            start: "2027-01-15T18:00:00.000Z",
          },
        ]);
      });
    });

    describe("given the user provided a invalid table ID", () => {
      it("should return 400 with a message of 'Invalid table ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/table/available-slots/invalid-table-id/?date=2027-01-15")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid table ID" });
      });
    });

    describe("given the user did not provide a date", () => {
      it("should return 400 with a message of 'Date is required'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/table/available-slots/656f8a3b2e7c1a4d8f9b9999/")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Date is required" });
      });
    });

    describe("given the table is not found", () => {
      it("should return 404 with a message of 'Table not available'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(
            "/table/available-slots/656f8a3b2e7c1a4d8f9b9999/?date=2027-01-15",
          )
          .set("User-Agent", "jest");

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Table not available" });
      });
    });

    describe("given the table is not active", () => {
      it("should return 404 with a message of 'Table not available'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(
            `/table/available-slots/${testTableDisabled._id}/?date=2027-01-15`,
          )
          .set("User-Agent", "jest");

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Table not available" });
      });
    });
  });
});

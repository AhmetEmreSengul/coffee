import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import supertest from "supertest";
import app from "../../app";
import Booking from "../../models/Booking";
import Table from "../../models/Table";
import { overlappingBooking } from "../fixtures/Bookings";
import { testTable } from "../fixtures/Tables";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler";

describe("table", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    await Table.create(testTable);
    await Booking.create(overlappingBooking);
  });

  describe("get table route", () => {
    describe("given the user either logged in or not", () => {
      it("should return 200", async () => {
        const { statusCode } = await supertest(app)
          .get("/table/available-tables")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(200);
      });
    });

    describe("given the table has a booking", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/table/table-bookings/656f8a3b2e7c1a4d8f9b1003")
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

    describe("given the table is active and has slots available", () => {
      it("should return available time slots", async () => {
        const { statusCode, body } = await supertest(app)
          .get(
            "/table/available-slots/656f8a3b2e7c1a4d8f9b1003/?date=2027-01-15",
          )
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
  });
});

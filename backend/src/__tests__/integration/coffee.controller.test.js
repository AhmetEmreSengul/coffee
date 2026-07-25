import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
  expect,
} from "@jest/globals";
import supertest from "supertest";
import app from "../../app";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler";
import Coffee from "../../models/Coffee";
import { testCoffee } from "../fixtures/Coffees";

describe("coffee", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  describe("get coffee route", () => {
    describe("given the user either logged in or not", () => {
      it("should return 200", async () => {
        await Coffee.create(testCoffee);

        const { statusCode } = await supertest(app)
          .get("/coffee")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(200);
      });
    });

    describe("given no coffee is found", () => {
      it("should return 404 with a message of 'No coffee found'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/coffee")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "No coffee found" });
      });
    });
  });
});

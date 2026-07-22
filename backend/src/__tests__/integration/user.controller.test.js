import { afterAll, afterEach, beforeAll, describe, it } from "@jest/globals";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler";
import { createUserPayload } from "../fixtures/Users";

describe("user", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  describe("user registration route", () => {
    describe("given the input is valid", () => {
      it("should return 201 and the user date", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/auth/signup")
          .set("User-Agent", "jest")
          .send(createUserPayload);

        expect(statusCode).toBe(201);
        expect(body).toEqual({
          _id: expect.any(String),
          fullName: expect.any(String),
          email: expect.any(String),
        });
      });
    });
  });
});

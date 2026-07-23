import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
  expect,
} from "@jest/globals";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler";
import { createUserPayload } from "../fixtures/Users";
import { response } from "express";

describe("user", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  describe("user registration route", () => {
    describe("given the input is valid", () => {
      it("should return 201 and the user date and set a jwt cookie", async () => {
        const { statusCode, body, headers } = await supertest(app)
          .post("/auth/signup")
          .set("User-Agent", "jest")
          .send(createUserPayload);

        expect(statusCode).toBe(201);
        expect(body).toEqual({
          _id: expect.any(String),
          fullName: expect.any(String),
          email: expect.any(String),
        });

        expect(headers["set-cookie"]).toBeDefined();

        const jwtCookie = headers["set-cookie"].find((cookie) =>
          cookie.startsWith("jwt="),
        );

        expect(jwtCookie).toBeDefined();
      });
    });
  });
});

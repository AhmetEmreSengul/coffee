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
import {
  testUser,
  createUserPayload,
  loginUserPayload,
} from "../fixtures/Users";
import { response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../lib/env";

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

    describe("given the user left one or more fields empty", () => {
      it("should return 400 with a message of 'All fields are required'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/auth/signup")
          .set("User-Agent", "jest")
          .send({ ...createUserPayload, fullName: "" });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "All fields are required" });
      });
    });
  });

  describe("user login route", () => {
    describe("given the input is valid", () => {
      it("should return 200 and the user date and set a jwt cookie", async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await User.create({ ...testUser, password: hashedPassword });

        const { statusCode, body, headers } = await supertest(app)
          .post("/auth/login")
          .set("User-Agent", "jest")
          .send(loginUserPayload);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          _id: expect.any(String),
          email: expect.any(String),
        });

        expect(headers["set-cookie"]).toBeDefined();

        const jwtCookie = headers["set-cookie"].find((cookie) =>
          cookie.startsWith("jwt="),
        );

        expect(jwtCookie).toBeDefined();
      });
    });

    describe("given the user left one or more fields empty", () => {
      it("should return 400 with a message of 'All fields are required'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/auth/login")
          .set("User-Agent", "jest")
          .send({ ...loginUserPayload, email: "" });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "All fields are required" });
      });
    });

    describe("given the password is wrong", () => {
      it("should return 401 with a message of 'Invalid credentials'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/auth/login")
          .set("User-Agent", "jest")
          .send({ ...loginUserPayload, password: "wrong-password" });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid credentials" });
      });
    });
  });

  describe("user logout route", () => {
    describe("given the user is logged in trying to logout", () => {
      it("should return 200", async () => {
        const token = jwt.sign({ userId: testUser._id }, ENV.JWT_SECRET, {
          expiresIn: "7d",
        });

        const { statusCode, body, headers } = await supertest(app)
          .post("/auth/logout")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual({ message: "Logged out" });

        expect(headers["set-cookie"]).toBeDefined();
        expect(headers["set-cookie"][0]).toContain("jwt=");
      });
    });
  });
});

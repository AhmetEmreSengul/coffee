import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import supertest from "supertest";
import { ENV } from "../../lib/env.js";
import Coffee from "../../models/Coffee.js";
import User from "../../models/User.js";
import { testCoffee } from "../fixtures/Coffees.js";
import { stripePayload } from "../fixtures/Orders.js";
import { testUser } from "../fixtures/Users.js";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler.js";

const mockCreate =
  jest.fn<
    (
      params: Stripe.PaymentIntentCreateParams,
    ) => Promise<Pick<Stripe.PaymentIntent, "id" | "client_secret">>
  >();

jest.unstable_mockModule("stripe", () => ({
  default: jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockCreate,
    },
  })),
}));

const { default: app } = await import("../../app.js");

if (!ENV.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const token = jwt.sign({ userId: testUser._id }, ENV.JWT_SECRET, {
  expiresIn: "7d",
});

describe("stripe", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    await User.create(testUser);
    await Coffee.create(testCoffee);
    mockCreate.mockReset();

    mockCreate.mockResolvedValue({
      id: "pi_test",
      client_secret: "test-client-secret",
    });
  });

  describe("create payment route", () => {
    describe("given the user is logged in and the input is valid", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/stripe/create-payment-intent")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(stripePayload);

        expect(statusCode).toBe(200);
        expect(body).toEqual({ clientSecret: "test-client-secret" });
        expect(mockCreate).toHaveBeenCalledWith({
          amount: 1198,
          currency: "try",
          automatic_payment_methods: {
            enabled: true,
          },
        });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/stripe/create-payment-intent")
          .set("User-Agent", "jest")
          .send(stripePayload);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
        expect(mockCreate).not.toHaveBeenCalled();
      });
    });

    describe("given the user provided a empty cart", () => {
      it("should return 400 with a message of 'Cart is empty'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/stripe/create-payment-intent")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({});

        expect(statusCode).toBe(400);
        expect(body).toEqual({
          errors: ["Invalid input: expected array, received undefined"],
          message: "Validation failed",
        });
        expect(mockCreate).not.toHaveBeenCalled();
      });
    });
  });
});

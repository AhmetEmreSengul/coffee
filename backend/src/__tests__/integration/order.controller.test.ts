import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import { ENV } from "../../lib/env.js";
import Coffee from "../../models/Coffee.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { testCoffee } from "../fixtures/Coffees.js";
import { orderPayload, testOrder } from "../fixtures/Orders.js";
import { testUser, testUser2, userId, userId2 } from "../fixtures/Users.js";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler.js";
import { beforeEach } from "node:test";
const actualEmailHandler = await import("../../emails/emailHandler.js");
jest.unstable_mockModule("../../emails/emailHandler", () => ({
  ...actualEmailHandler,
  sendCreateOrderEmail: jest
    .fn<() => Promise<void>>()
    .mockResolvedValue(undefined),
}));
const { default: app } = await import("../../app.js");

const token = jwt.sign({ userId: testUser._id }, ENV.JWT_SECRET!, {
  expiresIn: "7d",
});

const token2 = jwt.sign({ userId: testUser2._id }, ENV.JWT_SECRET!, {
  expiresIn: "7d",
});

describe("order", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    await User.create([testUser, testUser2]);
    await Coffee.create(testCoffee);
    await Order.create(testOrder);
  });

  describe("create order route", () => {
    describe("given the user is logged in and the input is valid", () => {
      it("should return 201", async () => {
        const { statusCode } = await supertest(app)
          .post("/orders/create-order")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send(orderPayload);

        expect(statusCode).toBe(201);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/orders/create-order")
          .set("User-Agent", "jest")
          .send(orderPayload);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("if an item exceeds the quantity limit of 10", () => {
      it("should return 400 with the message of 'Quantity limit exceeded'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/orders/create-order")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...orderPayload,
            orderItems: [
              {
                ...orderPayload.orderItems[0],
                quantity: 11,
              },
            ],
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Quantity limit exceeded" });
      });
    });

    describe("if an item has a quantity less than 1", () => {
      it("should return 400 with the message of 'Quantity must be at least 1'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/orders/create-order")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`])
          .send({
            ...orderPayload,
            orderItems: [
              {
                ...orderPayload.orderItems[0],
                quantity: 0,
              },
            ],
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Quantity must be at least 1" });
      });
    });
  });

  describe("get user past orders route", () => {
    describe("given the user is logged in", () => {
      it("should return the user's past orders", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/orders/past-orders")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual([
          {
            __v: 0,
            _id: testOrder._id,
            orderItems: [
              {
                _id: "656f8a3b2e7c1a4d8f9b1001",
                image: "latte.jpg",
                price: 120,
                quantity: 2,
                title: "Latte",
                type: "Hot Coffee",
              },
            ],
            orderNote: "Less sugar",
            totalPrice: 240,
            updatedAt: expect.any(String),
            createdAt: expect.any(String),
            user: userId,
          },
        ]);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/orders/past-orders")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });
  });
  describe("get users last order route", () => {
    describe("given the user is logged in", () => {
      it("should return the user's last order", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/orders/last-order")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: testOrder._id,
          orderItems: [
            {
              _id: "656f8a3b2e7c1a4d8f9b1001",
              image: "latte.jpg",
              price: 120,
              quantity: 2,
              title: "Latte",
              type: "Hot Coffee",
            },
          ],
          orderNote: "Less sugar",
          totalPrice: 240,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          user: userId,
        });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/orders/last-order")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user has no past orders", () => {
      it("should return 404 with a message of 'No orders found'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/orders/last-order")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token2}`]);

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "No orders found" });
      });
    });
  });
  describe("delete orders route", () => {
    describe("given the user is logged in", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/orders/delete-order/${testOrder._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual({ message: "Order deleted" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/orders/delete-order/${testOrder._id}`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user is trying to delete someone else's order", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/orders/delete-order/${testOrder._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token2}`]);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the order ID is invalid", () => {
      it("should return 400 with a message of 'Invalid order ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/orders/delete-order/invalid-order-id`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${token}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid order ID" });
      });
    });
  });
});

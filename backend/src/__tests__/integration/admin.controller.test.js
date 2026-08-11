import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../../app";
import { ENV } from "../../lib/env";
import User from "../../models/User";
import { adminUser, testUser, testUser2 } from "../fixtures/Users";
import {
  clearDatabase,
  closeDatabase,
  connectTestDB,
} from "../setup/dbHandler";
import Booking from "../../models/Booking";
import {
  checkedInBooking,
  inTimeBooking,
  overlappingBooking,
} from "../fixtures/Bookings";
import Order from "../../models/Order";
import { testOrder } from "../fixtures/Orders";
import { coffeePayload, testCoffee } from "../fixtures/Coffees";
import Coffee from "../../models/Coffee";

const adminToken = jwt.sign({ userId: adminUser._id }, ENV.JWT_SECRET, {
  expiresIn: "7d",
});

const nonAdminToken = jwt.sign({ userId: testUser._id }, ENV.JWT_SECRET, {
  expiresIn: "7d",
});

describe("admin", () => {
  beforeAll(connectTestDB);
  afterEach(clearDatabase);
  afterAll(closeDatabase);

  beforeEach(async () => {
    await User.create([adminUser, testUser, testUser2]);
    await Booking.create([overlappingBooking, inTimeBooking, checkedInBooking]);
    await Order.create(testOrder);
    await Coffee.create(testCoffee);
  });

  describe("get user route", () => {
    describe("given the user is logged in as an admin", () => {
      it("should return all users that are not admins", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/admin/allUsers")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(body).toEqual([
          {
            __v: 0,
            _id: testUser._id.toString(),
            authProvider: "local",
            avatar: "",
            createdAt: expect.any(String),
            email: "fake.user@example.com",
            fullName: "Fake User",
            isBanned: false,
            role: "user",
            updatedAt: expect.any(String),
          },
          {
            __v: 0,
            _id: testUser2._id.toString(),
            authProvider: "local",
            avatar: "",
            createdAt: expect.any(String),
            email: "fake.user2@example.com",
            fullName: "Fake User 2",
            isBanned: false,
            role: "user",
            updatedAt: expect.any(String),
          },
        ]);
        expect(statusCode).toBe(200);
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 401 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/admin/allUsers")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get("/admin/allUsers")
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });
  });

  describe("get user bookings route", () => {
    describe("given the user is logged in as an admin and provides a valid user ID", () => {
      it("should return 200 with the user's bookings", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userBookings/${testUser._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual(
          expect.arrayContaining([
            {
              __v: 0,
              _id: "656f8a3b2e7c1a4d8f9b1007",
              bookingTime: {
                end: "2027-01-15T16:00:00.000Z",
                start: "2027-01-15T14:00:00.000Z",
              },
              checkedIn: false,
              createdAt: expect.any(String),
              qrToken: "test-qr-token",
              tableNumber: "656f8a3b2e7c1a4d8f9b1003",
              updatedAt: expect.any(String),
              user: testUser._id,
            },
            {
              __v: 0,
              _id: "656f8a3b2e7c1a4d8f9b1008",
              bookingTime: {
                end: expect.any(String),
                start: expect.any(String),
              },
              checkedIn: false,
              createdAt: expect.any(String),
              qrToken: "test-qr-token2",
              tableNumber: "656f8a3b2e7c1a4d8f9b1003",
              updatedAt: expect.any(String),
              user: testUser._id,
            },
          ]),
        );
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userBookings/${testUser._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userBookings/${testUser._id}`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user provided a invalid user ID", () => {
      it("should return 400 with a message of 'Invalid user ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userBookings/invalid-user-id`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid user ID" });
      });
    });
  });

  describe("get user order route", () => {
    describe("given the user is logged in as an admin and provides a valid user ID", () => {
      it("should return 200 with the user's order", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userOrders/${testUser._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual([
          {
            __v: 0,
            _id: "6a66987b6ae3d09310fd50c6",
            createdAt: expect.any(String),
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
            user: testUser._id,
          },
        ]);
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userOrders/${testUser._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userOrders/${testUser._id}`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user provided a invalid user ID", () => {
      it("should return 400 with a message of 'Invalid user ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/admin/userOrders/invalid-user-id`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid user ID" });
      });
    });
  });

  describe("ban user route", () => {
    describe("given the user is logged in as an admin and provides a valid user ID", () => {
      it("should return 200 with a message of 'User banned'", async () => {
        const { statusCode, body } = await supertest(app)
          .post(`/admin/banUser/${testUser._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: testUser._id,
          authProvider: "local",
          avatar: "",
          createdAt: expect.any(String),
          email: "fake.user@example.com",
          fullName: "Fake User",
          isBanned: true,
          password: "hashed-test-password",
          role: "user",
          updatedAt: expect.any(String),
        });
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .post(`/admin/banUser/${testUser._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .post(`/admin/banUser/${testUser._id}`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user provided a invalid user ID", () => {
      it("should return 400 with a message of 'Invalid user ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .post(`/admin/banUser/invalid-user-id`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid user ID" });
      });
    });
  });

  describe("verify QR route", () => {
    describe("given the user is logged in as an admin and provides a valid user ID", () => {
      it("should return 200 with a message of 'QR code verified'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({
            bookingId: inTimeBooking._id,
            token: inTimeBooking.qrToken,
          });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          authorized: true,
          message: "Booking checked in successfully",
          table: null,
          user: {
            __v: 0,
            _id: testUser._id,
            authProvider: "local",
            avatar: "",
            createdAt: expect.any(String),
            email: "fake.user@example.com",
            fullName: "Fake User",
            isBanned: false,
            password: "hashed-test-password",
            role: "user",
            updatedAt: expect.any(String),
          },
        });
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`])
          .send({
            bookingId: inTimeBooking._id,
            token: inTimeBooking.qrToken,
          });

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .send({
            bookingId: inTimeBooking._id,
            token: inTimeBooking.qrToken,
          });

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the booking is not found", () => {
      it("should return 404 with a message of 'Booking not found'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({
            bookingId: "656f8a3b2e7c1a4d8f9b1003",
            token: inTimeBooking.qrToken,
          });

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Booking not found" });
      });
    });

    describe("given the user provided a invalid / expired token", () => {
      it("should return 400 with a message of 'Invalid token'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({
            bookingId: inTimeBooking._id,
            token: "invalid-token",
          });

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Invalid token" });
      });
    });

    describe("given the booking is already checked in", () => {
      it("should return 400 with a message of 'Booking already checked in'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({
            bookingId: checkedInBooking._id,
            token: checkedInBooking.qrToken,
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Booking already checked in" });
      });
    });

    describe("given the user tried to verify booking too early or too late", () => {
      it("should return 400 with a message of 'Booking is not valid at this time'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/verifyBooking")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({
            bookingId: overlappingBooking._id,
            token: overlappingBooking.qrToken,
          });

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Booking is not valid at this time" });
      });
    });
  });

  describe("add coffee route", () => {
    describe("given the user is logged in as an admin and provides a valid payload", () => {
      it("should return 201", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/addCoffee")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send(coffeePayload);

        expect(statusCode).toBe(201);
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/addCoffee")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`])
          .send(coffeePayload);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/addCoffee")
          .set("User-Agent", "jest")
          .send(coffeePayload);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user leaves a field empty", () => {
      it("should return 400 with a message of 'All fields are required'", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/admin/addCoffee")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({ ...coffeePayload, title: "" });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "All fields are required" });
      });
    });
  });

  describe("edit coffee route", () => {
    describe("given the user is logged in as an admin and provides a valid payload", () => {
      it("should return 200", async () => {
        const { statusCode, body } = await supertest(app)
          .put(`/admin/editCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send(coffeePayload);

        expect(statusCode).toBe(200);
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .put(`/admin/editCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`])
          .send(coffeePayload);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .put(`/admin/editCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest")
          .send(coffeePayload);

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the user leaves a field empty", () => {
      it("should return 400 with a message of 'All fields are required'", async () => {
        const { statusCode, body } = await supertest(app)
          .put(`/admin/editCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send({ ...coffeePayload, title: "" });

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "All fields are required" });
      });
    });

    describe("given the coffee with the given ID is not found", () => {
      it("should return 404 with a message of 'Coffee not found'", async () => {
        const { statusCode, body } = await supertest(app)
          .put(`/admin/editCoffee/656f8a3b2e7c1a4d8f9b1003`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send(coffeePayload);

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Coffee not found" });
      });
    });

    describe("given the user provided a invalid coffee ID", () => {
      it("should return 400 with a message of 'Invalid coffee ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .put("/admin/editCoffee/invalid-coffee-id")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`])
          .send(coffeePayload);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid coffee ID" });
      });
    });
  });

  describe("delete coffee route", () => {
    describe("given the user is logged in as an admin and provides a valid coffee ID", () => {
      it("should return 200 with a message of 'Coffee deleted'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/admin/deleteCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(200);
        expect(body).toEqual({ message: "Coffee deleted" });
      });
    });

    describe("given the user is not logged in as an admin", () => {
      it("should return 403 with a message of 'Access denied (Admin only)'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/admin/deleteCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${nonAdminToken}`]);

        expect(statusCode).toBe(403);
        expect(body).toEqual({ message: "Access denied (Admin only)" });
      });
    });

    describe("given the user is not logged in", () => {
      it("should return 401 with a message of 'Unauthorized'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/admin/deleteCoffee/${testCoffee._id}`)
          .set("User-Agent", "jest");

        expect(statusCode).toBe(401);
        expect(body).toEqual({ message: "Unauthorized" });
      });
    });

    describe("given the coffee with the given ID is not found", () => {
      it("should return 404 with a message of 'Coffee not found'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete(`/admin/deleteCoffee/656f8a3b2e7c1a4d8f9b1003`)
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: "Coffee not found" });
      });
    });

    describe("given the user provided a invalid coffee ID", () => {
      it("should return 400 with a message of 'Invalid coffee ID'", async () => {
        const { statusCode, body } = await supertest(app)
          .delete("/admin/deleteCoffee/invalid-coffee-id")
          .set("User-Agent", "jest")
          .set("Cookie", [`jwt=${adminToken}`]);

        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: "Invalid coffee ID" });
      });
    });
  });
});

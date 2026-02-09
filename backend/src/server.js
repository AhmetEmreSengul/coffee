import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import bookingRoutes from "./routes/booking.route.js";
import stripeRoutes from "./routes/stripe.route.js";
import orderRoutes from "./routes/order.route.js";
import coffeeRoutes from "./routes/coffee.route.js";
import adminRoutes from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./lib/google.js";

const PORT = ENV.PORT || 3000;

const __dirname = path.resolve();

const app = express();

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/book", bookingRoutes);
app.use("/stripe", stripeRoutes);
app.use("/orders", orderRoutes);
app.use("/coffee", coffeeRoutes);
app.use("/admin", adminRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();

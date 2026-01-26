import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import bookingRoutes from "./routes/booking.route.js";
import stripeRoutes from "./routes/stripe.route.js";
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
app.use("/stripe", stripeRoutes)

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  connectDB();
});

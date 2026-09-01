import express from "express";
import {
  forgotPassword,
  googleAuthCallback,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import passport from "passport";
import { ENV } from "../lib/env.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${ENV.CLIENT_URL}/login?error=auth_failed`,
  }),
  googleAuthCallback,
);

export default router;

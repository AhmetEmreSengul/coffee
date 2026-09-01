import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import type { Request, Response } from "express";
import {
  ForgotPasswordBody,
  LoginBody,
  ResetPasswordBody,
  SignupBody,
} from "../schemas/auth.schema.js";

export const signup = async (
  req: Request<{}, {}, SignupBody>,
  res: Response,
) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();

      generateToken(savedUser._id.toString(), res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invaild user data" });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcryptjs.compare(password, user.password!);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("error in login controller", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out" });
};

export const updateProfile = async (
  req: Request<{}, {}, { fullName: string }>,
  res: Response,
) => {
  try {
    const { fullName } = req.body;
    if (!fullName) return res.status(400).json({ message: "Name is required" });

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response,
) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 3600000);

    user.passwordResetToken = resetToken;
    user.passwordResetExpiresAt = resetTokenExpiresAt;
    await user.save();

    sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (
  req: Request<{ token: string }, {}, ResetPasswordBody>,
  res: Response,
) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    generateToken(req.user._id.toString(), res);

    res.redirect(`${ENV.CLIENT_URL}/auth/google/success`);
  } catch (error) {
    console.error("Error in Google auth callback:", (error as Error).message);
    res.redirect(`${ENV.CLIENT_URL}/login?error=server_error`);
  }
};

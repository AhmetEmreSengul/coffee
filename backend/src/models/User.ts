import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  fullName: string;
  password?: string;
  googleId?: string;
  avatar: string;
  authProvider: "local" | "google";
  role: "user" | "admin";
  isBanned: boolean;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function (this: IUser): boolean {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

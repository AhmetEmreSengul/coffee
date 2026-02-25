import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  isBanned: boolean;
  passwordResetToken: string;
  passwordResetExpiresAt: Date;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  fullName: string;
}

type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get<AuthUser>("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in authcheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created");
    } catch (error) {
      const err = error as AxiosErrorResponse;
      toast.error(err.response?.data?.message ?? "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Redirecting...");
    } catch (error) {
      const err = error as AxiosErrorResponse;
      toast.error(err.response?.data?.message ?? "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logging out...");
    } catch {
      toast.error("Error logging out.");
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put<AuthUser>(
        "/auth/update-profile",
        data,
      );
      set({ authUser: res.data });
      toast.success("Profile Updated");
    } catch (error) {
      toast.error("Error updating profile");
    }
  },

  forgotPassword: async (email) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error("Error sending password reset link");
    }
  },

  resetPassword: async (token, password) => {
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successfully, Redirecting...");
    } catch (error) {
      console.error(error);
      toast.error("Error resetting password");
      throw error;
    }
  },
}));

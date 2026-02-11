import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import type { AuthUser } from "./useAuthStore";
import type { UserBooking } from "./useBookingStore";
import type { Order } from "./useOrderStore";

interface AdminStore {
  users: AuthUser[];
  allUserBookings: UserBooking[];
  allUserOrders: Order[];
  bookingsLoading: boolean;
  ordersLoading: boolean;
  usersLoading: boolean;
  getAllUsers: () => Promise<void>;
  getAllUserBookings: (id: string) => Promise<void>;
  getAllUserOrders: (id: string) => Promise<void>;
  banUser: (id: string) => Promise<void>;
  verifyBookingQr: (data: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  users: [],
  allUserBookings: [],
  allUserOrders: [],
  bookingsLoading: false,
  ordersLoading: false,
  usersLoading: false,

  getAllUsers: async () => {
    try {
      set({ usersLoading: true });
      const res = await axiosInstance.get("/admin/allUsers");
      set({ users: res.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ usersLoading: false });
    }
  },

  getAllUserBookings: async (id: string) => {
    try {
      set({ bookingsLoading: true });
      const res = await axiosInstance.get(`/admin/userBookings/${id}`);
      set({ allUserBookings: res.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ bookingsLoading: false });
    }
  },

  getAllUserOrders: async (id: string) => {
    try {
      set({ ordersLoading: true });
      const res = await axiosInstance.get(`/admin/userOrders/${id}`);
      set({ allUserOrders: res.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ ordersLoading: false });
    }
  },

  banUser: async (id: string) => {
    try {
      await axiosInstance.post(`/admin/banUser/${id}`);
      toast.success("User updated.");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  },

  verifyBookingQr: async (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      await axiosInstance.post("/admin/verifyBooking", {
        bookingId: parsedData.bookingId,
        token: parsedData.token,
      });
      toast.success("Booking verified.");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  },
}));

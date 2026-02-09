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
  getAllUsers: () => Promise<void>;
  getAllUserBookings: (id: string) => Promise<void>;
  getAllUserOrders: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  users: [],
  allUserBookings: [],
  allUserOrders: [],

  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/admin/allUsers");
      set({ users: res.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  },

  getAllUserBookings: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/admin/userBookings/${id}`);
      set({ allUserBookings: res.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  },

  getAllUserOrders: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/admin/userOrders/${id}`);
      set({ allUserOrders: res.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  },
}));

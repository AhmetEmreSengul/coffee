import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useBookingStore = create((set) => ({
  tables: [],
  bookings: [],
  myBookings: [],
  bookingQR: [],

  getTables: async () => {
    try {
      const res = await axiosInstance.get("/book/available-tables");
      set({ tables: res.data });
    } catch (error) {
      console.error("Error getting tables", error?.response?.data?.message);
      set({ tables: [] });
    }
  },

  createBooking: async (data) => {
    try {
      const res = await axiosInstance.post("/book/createBooking", data);
      set({ tables: res.data });
      toast.success("Booking created");
    } catch (error) {
      console.error("Error creating booking", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
      set({ tables: [] });
    } finally {
      set({ tables: [] });
    }
  },

  getUserBookings: async () => {
    try {
      const res = await axiosInstance.get("/book/my-bookings");
      set({ myBookings: res.data });
    } catch (error) {
      console.error("Error fetching bookings");
      toast.error(error?.response?.data?.message);
      set({ myBookings: [] });
    }
  },

  getQRCode: async (id) => {
    try {
      const res = await axiosInstance.get(`/book/bookingQR/${id}`);

      set((state) => {
        const exists = state.bookingQR.some(
          (qr) => qr.booking._id === res.data.booking._id
        );
        if (exists) return state;

        return {
          bookingQR: [...state.bookingQR, res.data],
        };
      });
    } catch (error) {
      console.error("Error fetching QR", error);
      toast.error(error?.response?.data?.message);
    }
  },
}));

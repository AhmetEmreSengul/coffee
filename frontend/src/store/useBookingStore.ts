import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";


export interface UserBooking {
  _id: string;
  bookingTime: {
    start: string;
    end: string;
  };
  tableNumber: {
    _id: string;
    number: number;
    capacity: number;
  };
  checkedIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingQR {
  qrCode: string;
  booking: UserBooking;
}

interface CreateBookingData {
  tableNumber: string;
  bookingTime: {
    start: string;
    end: string;
  };
}

interface BookingStore {
  myBookings: UserBooking[];
  bookingQR: BookingQR[];
  isLoading: boolean;
  isCreating: boolean;
  createBooking: (data: CreateBookingData) => Promise<void>;
  getUserBookings: () => Promise<void>;
  getQRCode: (id: string) => Promise<void>;
  updateUserBooking: (
    id: string,
    startTime: string,
    endTime: string,
  ) => Promise<void>;
  deleteUserBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  myBookings: [],
  bookingQR: [],
  isLoading: false,
  isCreating: false,

  createBooking: async (data) => {
    set({ isCreating: true });
    try {
      await axiosInstance.post("/book/createBooking", data);
      toast.success("Booking created");
    } catch (error: any) {
      console.error("Error creating booking", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isCreating: false });
    }
  },

  getUserBookings: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<UserBooking[]>("/book/my-bookings");
      set({ myBookings: res.data });
    } catch (error: any) {
      console.error("Error fetching bookings");
      toast.error(error?.response?.data?.message);
      set({ myBookings: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getQRCode: async (id: string) => {
    try {
      const res = await axiosInstance.get<BookingQR>(`/book/bookingQR/${id}`);

      set((state) => {
        const exists = state.bookingQR.some(
          (qr) => qr.booking._id === res.data.booking._id,
        );
        if (exists) return state;

        return { bookingQR: [...state.bookingQR, res.data] };
      });
    } catch (error: any) {
      console.error("Error fetching QR", error);
      toast.error(error?.response?.data?.message);
    }
  },

  updateUserBooking: async (id, startTime, endTime) => {
    try {
      await axiosInstance.put(`/book/updateBooking/${id}`, {
        bookingTime: { start: startTime, end: endTime },
      });
      toast.success("Booking updated successfully");
      await get().getUserBookings();
    } catch (error: any) {
      console.error("Error updating booking", error);
      toast.error(error?.response?.data?.message || "Failed to update booking");
    }
  },

  deleteUserBooking: async (id) => {
    try {
      await axiosInstance.delete(`/book/cancelBooking/${id}`);
      toast.success("Cancelled booking");
      await get().getUserBookings();
    } catch (error: any) {
      console.error("Error deleting booking");
      toast.error(error?.response?.data?.message || "Failed to delete booking");
    }
  },
}));

import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import BookingCard from "../components/BookingCard";
import { motion } from "framer-motion";
import CoffeDisplaySkeleton from "../components/CoffeDisplaySkeleton";

const UserBookings = () => {
  const {
    getUserBookings,
    myBookings,
    bookingQR,
    getQRCode,
    updateUserBooking,
    deleteUserBooking,
    isLoading,
  } = useBookingStore();
  const { authUser } = useAuthStore();

  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>("");
  const [formData, setFormData] = useState({
    bookingId: "",
    date: null as Date | null,
    startTime: "",
    endTime: "",
    tableNumber: "",
  });

  useEffect(() => {
    getUserBookings();
  }, []);

  useEffect(() => {
    if (myBookings.length > 0) {
      myBookings.forEach((b) => getQRCode(b._id));
    }
  }, [myBookings]);

  const toDateTime = (date: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.bookingId ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const startISO = toDateTime(formData.date, formData.startTime);
    const endISO = toDateTime(formData.date, formData.endTime);

    updateUserBooking(formData.bookingId, startISO, endISO);
    setUpdateOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <CoffeDisplaySkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (myBookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-bg-primary">
        <Navbar />
        <div className="text-text-primary">
          No bookings found. Reserve a table{" "}
          <Link
            to="/book-table"
            className="underline ml-1 text-caramel-500 hover:text-caramel-400 transition"
          >
            here
          </Link>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-5 bg-bg-primary">
      <Navbar />
      <div className="text-text-primary rounded-3xl overflow-x-scroll relative mt-40 scrollable">
        <div className="flex flex-col md:flex-row gap-10">
          {myBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <BookingCard
                booking={booking}
                authUser={authUser}
                bookingQR={bookingQR}
                formData={formData}
                setFormData={setFormData}
                updateOpen={updateOpen}
                setUpdateOpen={setUpdateOpen}
                deleteBookingId={deleteBookingId}
                setDeleteBookingId={setDeleteBookingId}
                deleteUserBooking={deleteUserBooking}
                onSubmit={handleSubmit}
                getUserBookings={getUserBookings}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;

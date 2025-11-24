import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import BookingCard from "../components/BookingCard";
import { motion } from "framer-motion";

const UserBookings = () => {
  const {
    getUserBookings,
    myBookings,
    bookingQR,
    getQRCode,
    updateUserBooking,
    deleteUserBooking,
  } = useBookingStore();
  const { authUser } = useAuthStore();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: "",
    bookingTime: {
      start: "",
      end: "",
    },
  });

  useEffect(() => {
    getUserBookings();
  }, []);

  useEffect(() => {
    if (myBookings.length > 0) {
      myBookings.forEach((b) => getQRCode(b._id));
    }
  }, [myBookings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.bookingId ||
      !formData.bookingTime.start ||
      !formData.bookingTime.end
    ) {
      toast.error("Please fill in both start and end times");
      return;
    }

    updateUserBooking(
      formData.bookingId,
      formData.bookingTime.start,
      formData.bookingTime.end
    );

    setUpdateOpen(false);
  };

  if (myBookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Navbar />
        <div>
          No bookings found, You can reserve a table{" "}
          <Link to={"/book-table"} className="underline ml-1 text-amber-200 ">
            here.
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify p-5 justify-center">
      <Navbar />
      <div className="text-amber-950 rounded-3xl overflow-hidden relative mt-40">
        <div className="flex flex-col md:flex-row gap-5">
          {myBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <BookingCard
                key={booking._id}
                booking={booking}
                authUser={authUser}
                bookingQR={bookingQR}
                formData={formData}
                setFormData={setFormData}
                updateOpen={updateOpen}
                setUpdateOpen={setUpdateOpen}
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
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

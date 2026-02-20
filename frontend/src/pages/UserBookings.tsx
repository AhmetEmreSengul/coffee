import { useEffect, useRef, useState } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import BookingCard from "../components/BookingCard";
import { motion } from "framer-motion";
import CoffeDisplaySkeleton from "../components/CoffeDisplaySkeleton";

const UserBookings = () => {
  const { getUserBookings, myBookings, bookingQR, getQRCode, isLoading } =
    useBookingStore();
  const { authUser } = useAuthStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(true);
  const [dragLimit, setDragLimit] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const scrollWidth = container.scrollWidth;
      const offsetWidth = container.offsetWidth;
      const maxDrag = offsetWidth - scrollWidth;
      setDragLimit(maxDrag < 0 ? maxDrag : 0);
    }
  }, [myBookings]);

  useEffect(() => {
    getUserBookings();
  }, []);

  useEffect(() => {
    if (myBookings.length > 0) {
      myBookings.forEach((b) => getQRCode(b._id));
    }
  }, [myBookings]);

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

  if (authUser?.isBanned) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-bg-primary">
        <div className="text-text-primary">
          You have been banned. If you think this is a mistake, Please contact
          us at
        </div>
        <a
          className="text-caramel-400 underline ml-1"
          href="mailto:timeslot@support.com"
        >
          timeslot@support.com
        </a>
      </div>
    );
  }

  if (myBookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-bg-primary">
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
      <div className="text-text-primary rounded-3xl overflow-x-scroll relative mt-40 scrollable">
        <motion.div
          ref={scrollRef}
          className="flex flex-row gap-10 cursor-grab"
          drag={dragActive ? "x" : false}
          dragConstraints={{ left: dragLimit, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
        >
          {myBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <BookingCard
                booking={booking}
                qrCode={
                  bookingQR.find((qr) => qr.booking._id === booking._id)
                    ?.qrCode ?? null
                }
                setDragActive={setDragActive}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UserBookings;

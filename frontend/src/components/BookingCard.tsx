import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import DateTimeInput from "./DateInput";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BookingCardProps {
  booking: any;
  authUser: any;
  bookingQR: any[];
  formData: any;
  setFormData: (data: any) => void;
  updateOpen: boolean;
  setUpdateOpen: (v: boolean) => void;
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  deleteUserBooking: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  getUserBookings: () => void; // Add this prop
}

const BookingCard = ({
  booking,
  authUser,
  bookingQR,
  formData,
  setFormData,
  updateOpen,
  setUpdateOpen,
  deleteOpen,
  setDeleteOpen,
  deleteUserBooking,
  onSubmit,
  getUserBookings, // Add this
}: BookingCardProps) => {
  const [isRipping, setIsRipping] = useState(false);

  const handleDelete = async () => {
    setIsRipping(true);
    setTimeout(async () => {
      await deleteUserBooking(booking._id);
      setDeleteOpen(false);
      setIsRipping(false);
      getUserBookings();
    }, 800);
  };

  return (
    <div className="relative z-5">
      <div className="absolute left-0 right-0 top-5/9 z-10 border-t-2 border-dashed border-border-medium"></div>
      <AnimatePresence>
        {!isRipping && (
          <>
            <motion.div
              key="booking-info"
              initial={{ y: 0, rotate: 0 }}
              exit={{
                y: -300,
                x: -100,
                rotate: -25,
                opacity: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.6, 0.05, 0.01, 0.9],
                },
              }}
              className="bg-beige-100 rounded-t-lg relative z-10 border border-border-light"
              style={{
                clipPath: isRipping
                  ? "polygon(0 0, 100% 0, 100% 100%, 95% 95%, 90% 100%, 85% 95%, 80% 100%, 75% 95%, 70% 100%, 65% 95%, 60% 100%, 55% 95%, 50% 100%, 45% 95%, 40% 100%, 35% 95%, 30% 100%, 25% 95%, 20% 100%, 15% 95%, 10% 100%, 5% 95%, 0 100%)"
                  : "none",
              }}
            >
              <div className="flex justify-between mb-10">
                <div className="p-5">
                  <p className="text-text-tertiary">Guest</p>
                  <p className="font-bold text-text-primary">{authUser?.fullName}</p>
                </div>

                <div className="p-5">
                  <p className="text-end text-text-tertiary">BOOKING ID</p>
                  <p className="font-bold text-text-primary">{booking._id}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="pl-5">
                  <p className="inline-flex gap-1 items-center text-text-secondary">
                    <CiCalendar /> Date
                  </p>
                  <p className="font-bold text-text-primary">
                    {
                      new Date(booking.bookingTime.start)
                        .toISOString()
                        .split("T")[0]
                    }
                  </p>
                </div>

                <div className="pr-5">
                  <p className="inline-flex gap-1 items-center text-text-secondary">
                    <CiClock1 /> Time
                  </p>
                  <p className="text-end font-bold text-text-primary">
                    {new Date(booking.bookingTime.start).toLocaleTimeString(
                      "en-GB",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-1 text-text-secondary">
                  <CiLocationOn /> Table
                </p>
                <p className="font-bold text-text-primary">T{booking.tableNumber.number}</p>
              </div>

              <div className="flex justify-between px-5 pb-5">
                <button
                  className="p-2 bg-sage-300 text-sage-400 font-bold rounded-lg hover:bg-sage-400 hover:text-cream-50 transition"
                  onClick={() => {
                    setUpdateOpen(true);
                    setFormData({
                      ...formData,
                      bookingId: booking._id,
                    });
                  }}
                >
                  Update
                </button>

                <button
                  className="p-2 bg-caramel-400 text-cream-50 font-bold rounded-lg hover:bg-caramel-500 transition"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </button>
              </div>
            </motion.div>

            <motion.div
              key="qr-code"
              initial={{ y: 0, rotate: 0 }}
              exit={{
                y: 300,
                x: 100,
                rotate: 25,
                opacity: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.6, 0.05, 0.01, 0.9],
                },
              }}
              className="bg-beige-100 rounded-b-lg -mt-1 border border-border-light border-t-0"
              style={{
                clipPath: isRipping
                  ? "polygon(5% 5%, 10% 0, 15% 5%, 20% 0, 25% 5%, 30% 0, 35% 5%, 40% 0, 45% 5%, 50% 0, 55% 5%, 60% 0, 65% 5%, 70% 0, 75% 5%, 80% 0, 85% 5%, 90% 0, 95% 5%, 100% 0, 100% 100%, 0 100%, 0 0)"
                  : "none",
              }}
            >
              {bookingQR
                .filter((qrObj) => qrObj.booking._id === booking._id)
                .map((qrObj, i) => (
                  <div
                    className="p-8 flex flex-col items-center justify-center space-y-4"
                    key={i}
                  >
                    <div className="p-3 bg-cream-50 rounded-xl shadow-sm border border-border-light">
                      <img
                        src={qrObj.qrCode}
                        alt="Entry QR Code"
                        className="w-40 h-40 mix-blend-multiply opacity-90"
                      />
                    </div>
                    <p className="text-xs text-center text-text-tertiary max-w-[200px]">
                      Scan this code at the entrance to access your reserved
                      table.
                    </p>
                  </div>
                ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {updateOpen && (
          <div className="fixed inset-0 bg-black/30 h-screen w-screen flex items-center justify-center z-10">
            <motion.div
              className="rounded-xl relative p-5 max-h-[90vh] overflow-y-auto border-border-light"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <p
                onClick={() => setUpdateOpen(false)}
                className="absolute right-8 cursor-pointer size-5 text-2xl z-10 text-text-primary hover:text-caramel-500 transition"
              >
                <IoMdClose size={30} />
              </p>

              <form onSubmit={onSubmit}>
                <div className="flex items-center justify-center flex-col md:flex-row gap-3 md:gap-20">
                  <DateTimeInput
                    label="Start Time"
                    value={formData.bookingTime.start}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        bookingTime: { ...prev.bookingTime, start: value },
                      }))
                    }
                  />

                  <DateTimeInput
                    label="End Time"
                    value={formData.bookingTime.end}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        bookingTime: { ...prev.bookingTime, end: value },
                      }))
                    }
                    minDate={
                      formData.bookingTime.start
                        ? new Date(formData.bookingTime.start)
                        : undefined
                    }
                    maxDate={
                      formData.bookingTime.start
                        ? new Date(formData.bookingTime.start)
                        : undefined
                    }
                    minTime={
                      formData.bookingTime.start
                        ? format(new Date(formData.bookingTime.start), "HH:mm")
                        : undefined
                    }
                    maxTime={
                      formData.bookingTime.start
                        ? format(
                            new Date(
                              new Date(formData.bookingTime.start).getTime() +
                                4 * 60 * 60 * 1000
                            ),
                            "HH:mm"
                          )
                        : undefined
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    className="p-2 bg-sage-300 text-sage-400 font-bold rounded-lg hover:bg-sage-400 hover:text-cream-50 transition"
                    type="submit"
                  >
                    Update
                  </button>

                  <button
                    className="p-2 bg-beige-300 text-text-secondary font-bold rounded-lg hover:bg-beige-400 transition"
                    onClick={() => setUpdateOpen(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {deleteOpen && (
          <div
            className="inset-0 fixed bg-black/40 h-screen w-screen flex items-center justify-center z-10"
            onClick={() => setDeleteOpen(false)}
          >
            <motion.div
              className="bg-cream-50/50 backdrop-blur-sm border border-border-light p-6 rounded-xl shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold w-90 h-20 text-text-primary">
                Are you sure you want to cancel your booking? This action cannot
                be undone.
              </h3>
              <div className="flex justify-between mt-5">
                <button
                  className="p-2 bg-caramel-400 text-cream-50 rounded-lg hover:bg-caramel-500 transition font-medium"
                  onClick={() => {
                    setDeleteOpen(false);
                    handleDelete();
                  }}
                >
                  Yes I'm sure.
                </button>
                <button
                  className="p-2 bg-beige-300 text-text-secondary rounded-lg hover:bg-beige-400 transition font-medium"
                  onClick={() => setDeleteOpen(false)}
                >
                  Nevermind.
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCard;

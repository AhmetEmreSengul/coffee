import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";

interface BookingCardProps {
  booking: any;
  authUser: any;
  bookingQR: any[];
  formData: {
    bookingId: string;
    date: Date | null;
    startTime: string;
    endTime: string;
    tableNumber: string;
  };
  setFormData: (data: any) => void;
  updateOpen: boolean;
  setUpdateOpen: (v: boolean) => void;
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  deleteUserBooking: (id: string) => void;
  onSubmit: (e: FormEvent) => void;
  getUserBookings: () => void;
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
  getUserBookings,
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

  const maxEndTime = (() => {
    if (!formData.startTime) return "";
    const [h, m] = formData.startTime.split(":").map(Number);
    const d = new Date();
    d.setHours(h + 4, m);
    return d.toTimeString().slice(0, 5);
  })();

  const handleUpdateClick = () => {
    setFormData({
      bookingId: booking._id,
      date: new Date(booking.bookingTime.start),
      startTime: new Date(booking.bookingTime.start).toTimeString().slice(0, 5),
      endTime: new Date(booking.bookingTime.end).toTimeString().slice(0, 5),
      tableNumber: booking.tableNumber.number,
    });
    setUpdateOpen(true);
  };

  return (
    <div className="relative z-5">
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
                transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
              }}
              className="bg-beige-100 rounded-t-lg relative z-10 border-border-light"
            >
              <div className="flex justify-between mb-10">
                <div className="p-5">
                  <p className="text-text-tertiary">Guest</p>
                  <p className="font-bold text-text-primary">
                    {authUser?.fullName}
                  </p>
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
                    {new Date(booking.bookingTime.start).toLocaleDateString()}
                  </p>
                </div>

                <div className="pr-5">
                  <p className="inline-flex gap-1 items-center text-text-secondary">
                    <CiClock1 /> Time
                  </p>
                  <p className="text-end font-bold text-text-primary">
                    {new Date(booking.bookingTime.start)
                      .toTimeString()
                      .slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-1 text-text-secondary">
                  <CiLocationOn /> Table
                </p>
                <p className="font-bold text-text-primary">
                  T{booking.tableNumber.number}
                </p>
              </div>

              <div className="flex justify-between px-5 pb-5">
                <button
                  className="p-2 bg-caramel-500 text-cream-50 font-bold rounded-lg hover:bg-caramel-400 transition"
                  onClick={handleUpdateClick}
                >
                  Update
                </button>

                <button
                  className="p-2 bg-amber-800 text-cream-50 font-bold rounded-lg hover:bg-amber-700 transition"
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
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-10">
            <motion.div
              className="rounded-xl relative p-5 max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <p
                onClick={() => setUpdateOpen(false)}
                className="absolute right-8 cursor-pointer size-5 z-11 text-2xl hover:text-caramel-500"
              >
                <IoMdClose size={30} />
              </p>

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <DateInput
                  value={formData.date}
                  onChange={(date) =>
                    setFormData((prev: any) => ({ ...prev, date }))
                  }
                />
                <div className="flex gap-3 justify-center ">
                  <TimeInput
                    label="Start Time"
                    value={formData.startTime}
                    onChange={(startTime) =>
                      setFormData((prev: any) => ({ ...prev, startTime }))
                    }
                  />

                  <TimeInput
                    label="End Time"
                    value={formData.endTime}
                    onChange={(endTime) =>
                      setFormData((prev: any) => ({ ...prev, endTime }))
                    }
                    min={formData.startTime || "09:00"}
                    max={maxEndTime}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="submit"
                    className="p-2 bg-sage-300 text-sage-400 font-bold rounded-lg hover:bg-sage-400 hover:text-cream-50 transition"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateOpen(false)}
                    className="p-2 bg-beige-300 text-text-secondary rounded-lg hover:bg-beige-400 transition"
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
              <h1 className="text-lg font-black">Cancel Booking</h1>
              <h3 className="font-light w-70 md:w-90 h-20 text-text-primary mt-3">
                Are you sure you want to cancel your booking? This action cannot
                be undone.
              </h3>
              <div className="flex justify-between">
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

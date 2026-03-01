import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";

import { useBookingStore, type UserBooking } from "../store/useBookingStore";
import { useAuthStore } from "../store/useAuthStore";
import { TbClockExclamation } from "react-icons/tb";
import { toast } from "react-toastify";
import Countdown from "./Countdown";
import DateInput from "./DateInput";
import { useTableStore } from "../store/useTableStore";
import { format } from "date-fns";

interface BookingCardProps {
  booking: UserBooking;
  qrCode: string | null;
  setDragActive: (active: boolean) => void;
}

const BookingCard = ({ booking, qrCode, setDragActive }: BookingCardProps) => {
  const { updateUserBooking, deleteUserBooking } = useBookingStore();
  const { getTableSlots, tableSlots } = useTableStore();
  const { authUser } = useAuthStore();
  const [isRipping, setIsRipping] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [slotIdx, setSlotIdx] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    tableId: "",
    date: null as Date | null,
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (formData.tableId && formData.date) {
      getTableSlots(formData.tableId, formData.date);
    }
  }, [formData.tableId, formData.date]);

  const toDateTime = (date: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    const start = toDateTime(formData.date, formData.startTime);
    const end = toDateTime(formData.date, formData.endTime);

    updateUserBooking(booking._id, start.toISOString(), end.toISOString());
    setFormData({
      tableId: "",
      date: null,
      startTime: "",
      endTime: "",
    });
    setUpdateOpen(false);

    useTableStore.setState({ tableSlots: [] });
  };

  const handleDelete = async () => {
    setIsRipping(true);
    setTimeout(async () => {
      deleteUserBooking(booking._id);
      setDeleteOpen(false);
      setIsRipping(false);
    }, 1000);
  };

  const handleUpdateClick = () => {
    setFormData({
      ...formData,
      tableId: booking.tableNumber._id,
      date: new Date(booking.bookingTime.start),
    });
    setUpdateOpen(true);
    setDragActive(false);
  };

  const handleSlotSelect = (start: Date, end: Date, idx: number) => {
    setFormData({
      ...formData,
      startTime: format(start, "HH:mm"),
      endTime: format(end, "HH:mm"),
    });
    setSlotIdx(idx);
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
    setDragActive(false);
  };

  return (
    <>
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
                className="bg-beige-100 rounded-t-lg relative z-9 border-border-light"
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

                <div className="p-5 flex justify-between">
                  <div>
                    <p className="inline-flex items-center gap-1 text-text-secondary">
                      <CiLocationOn /> Table
                    </p>
                    <p className="font-bold text-text-primary">
                      T{booking.tableNumber.number}
                    </p>
                  </div>
                  <div>
                    {booking.checkedIn ? (
                      <div>
                        <p className="inline-flex items-center gap-1">
                          <TbClockExclamation />
                          Checked In at
                        </p>
                        <p className="text-end font-bold">
                          {new Intl.DateTimeFormat("default", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(booking.updatedAt))}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="inline-flex items-center gap-1">
                          <TbClockExclamation />
                          Invalid In
                        </p>
                        <p className="text-end font-bold">
                          <Countdown endTime={booking.bookingTime.end} />
                        </p>
                      </div>
                    )}
                  </div>
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
                    onClick={handleDeleteClick}
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
                {qrCode && (
                  <div className="p-8 flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 bg-cream-50 rounded-xl shadow-sm border border-border-light">
                      <img
                        src={qrCode}
                        alt="Entry QR Code"
                        className="w-40 h-40 mix-blend-multiply opacity-90"
                      />
                    </div>
                    <p className="text-xs text-center text-text-tertiary max-w-[200px]">
                      Scan this code at the entrance to access your reserved
                      table.
                    </p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <DateInput
                  value={formData.date}
                  onChange={(date) =>
                    setFormData((prev: any) => ({ ...prev, date }))
                  }
                />

                <div className="grid grid-cols-3 gap-3">
                  {tableSlots.map((slot, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg transition cursor-pointer ${i === slotIdx ? "bg-caramel-300 scale-105 animate-bounce" : "bg-beige-300"}`}
                    >
                      <button
                        type="button"
                        className="flex flex-col md:flex-row items-center gap-2"
                        onClick={() =>
                          handleSlotSelect(slot.start, slot.end, i)
                        }
                      >
                        <p className="cursor-pointer ">
                          {format(new Date(slot.start), "HH:mm")} /
                        </p>
                        <p className="cursor-pointer ">
                          {format(new Date(slot.end), "HH:mm")}
                        </p>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="submit"
                    className="p-2 bg-sage-300 text-text-secondary rounded-lg hover:bg-sage-400  transition"
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
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-10"
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
              <h3 className="font-light mt-3">
                Are you sure you want to cancel your booking?
              </h3>

              <div className="flex justify-between mt-4">
                <button
                  className="p-2 bg-caramel-400 text-white rounded-lg"
                  onClick={handleDelete}
                >
                  Yes I'm sure.
                </button>

                <button
                  className="p-2 bg-beige-300 rounded-lg"
                  onClick={() => setDeleteOpen(false)}
                >
                  Nevermind.
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingCard;

import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import TableCard from "../components/TableCard";
import TableCardSkeleton from "../components/TableCardSkeleton";
import DateInput from "../components/DateInput";
import TimeInput from "../components/TimeInput";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const BookTable = () => {
  const {
    tables,
    getTables,
    createBooking,
    isLoading,
    isCreating,
    getTableBookings,
    tableBookings,
  } = useBookingStore();

  const [formData, setFormData] = useState({
    date: null as Date | null,
    startTime: "",
    endTime: "",
    tableNumber: "",
  });

  const isDisabled =
    !formData.date ||
    !formData.startTime ||
    !formData.endTime ||
    !formData.tableNumber ||
    isCreating;

  useEffect(() => {
    getTables();
  }, [getTables]);

  useEffect(() => {
    getTableBookings(formData.tableNumber);
  }, [formData]);

  const toDateTime = (date: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.startTime || !formData.endTime) return;

    const start = toDateTime(formData.date, formData.startTime);
    const end = toDateTime(formData.date, formData.endTime);

    createBooking({
      tableNumber: formData.tableNumber,
      bookingTime: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });

    setFormData({
      ...formData,
      date: null,
      endTime: "",
      startTime: "",
      tableNumber: "",
    });
  };

  const maxEndTime = (() => {
    if (!formData.startTime) return "";

    const [h, m] = formData.startTime.split(":").map(Number);

    let totalMinutes = h * 60 + m + 240; // +4 hours
    if (totalMinutes > 23 * 60 + 59) totalMinutes = 23 * 60 + 59; // clamp to 23:59

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;

    return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
  })();

  function useIsXL() {
    const [isXL, setIsXL] = useState(window.innerWidth >= 1280);

    useEffect(() => {
      const handler = () => setIsXL(window.innerWidth >= 1280);
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    }, []);

    return isXL;
  }

  const isXL = useIsXL();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary items-center">
      {isLoading ? (
        <TableCardSkeleton />
      ) : (
        <div className="mt-40">
          <form
            className="flex items-center flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div className="relative xl:shadow-2xl flex flex-col items-center gap-3">
              <div className="z-1">
                <TableCard
                  tableInfo={tables}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
              <AnimatePresence>
                {tableBookings.length !== 0 && (
                  <motion.div
                    className="bg-beige-100 size-65 text-center rounded-xl shadow-2xl z-0 xl:absolute xl:top-0 xl:-right-70 mx-auto mt-5 xl:mt-0 overflow-y-scroll scrollable"
                    initial={isXL ? { x: -300 } : { y: -300 }}
                    animate={isXL ? { x: 0 } : { y: 0 }}
                    exit={isXL ? { x: -300 } : { y: -300 }}
                  >
                    <h2 className="mt-2 text-black text-lg">Booked For</h2>

                    {tableBookings.map((table, i) => {
                      const startDate = new Date(table.bookingTime.start);
                      const endDate = new Date(table.bookingTime.end);

                      const date = startDate.toLocaleDateString("en-GB");
                      const start = startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const end = endDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div key={i} className="border-b py-3 text-black">
                          {date} — {start} - {end}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DateInput
              value={formData.date}
              onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
            />

            <div className="flex flex-row gap-6">
              <TimeInput
                label="Start Time"
                value={formData.startTime}
                onChange={(startTime) =>
                  setFormData((prev) => ({ ...prev, startTime }))
                }
              />

              <TimeInput
                label="End Time"
                value={formData.endTime}
                onChange={(endTime) =>
                  setFormData((prev) => ({ ...prev, endTime }))
                }
                min={formData.startTime || "09:00"}
                max={maxEndTime}
              />
            </div>

            <button
              className={`p-3 rounded-lg m-10 font-medium ${isDisabled ? "cursor-not-allowed bg-gray-300 text-gray-600 " : "cursor-pointer bg-caramel-200 border border-caramel-300 text-caramel-500 hover:bg-caramel-300 transition"}`}
              type="submit"
              disabled={isDisabled}
            >
              {isCreating ? (
                <span className="inline-flex items-center gap-2">
                  Booking Table{" "}
                  <AiOutlineLoading3Quarters className="size-4 animate-spin" />
                </span>
              ) : (
                "Create Booking"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookTable;

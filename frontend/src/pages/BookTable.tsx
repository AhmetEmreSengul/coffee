import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import TableCard from "../components/TableCard";
import Navbar from "../components/Navbar";
import TableCardSkeleton from "../components/TableCardSkeleton";

import DateInput from "../components/DateInput";
import TimeInput from "../components/TimeInput";

const BookTable = () => {
  const { tables, getTables, createBooking, isLoading } = useBookingStore();

  const [formData, setFormData] = useState({
    date: null as Date | null,
    startTime: "",
    endTime: "",
    tableNumber: "",
  });

  useEffect(() => {
    getTables();
  }, [getTables]);

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
  };

  const maxEndTime = (() => {
    if (!formData.startTime) return "";
    const [h, m] = formData.startTime.split(":").map(Number);
    const d = new Date();
    d.setHours(h + 4, m);
    return d.toTimeString().slice(0, 5);
  })();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary items-center">
      <Navbar />

      {isLoading ? (
        <TableCardSkeleton />
      ) : (
        <div className="mt-40">
          <form
            className="flex items-center flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <TableCard
              tableInfo={tables}
              formData={formData}
              setFormData={setFormData}
            />

            <DateInput
              value={formData.date}
              onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
            />

            <div className="flex flex-col md:flex-row gap-6">
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
              className="p-3 rounded-lg bg-caramel-200 border border-caramel-300 text-caramel-500 hover:bg-caramel-300 transition m-10 font-medium"
              type="submit"
            >
              Create Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookTable;

import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import TableCard from "../components/TableCard";
import DateTimeInput from "../components/DateInput";
import Navbar from "../components/Navbar";
import { format } from "date-fns";

const BookTable = () => {
  const { tables, getTables, createBooking } = useBookingStore();
  const [formData, setFormData] = useState({
    tableNumber: "",
    bookingTime: {
      start: "",
      end: "",
    },
  });

  useEffect(() => {
    getTables();
  }, [getTables]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createBooking(formData);
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar/>
      <div className="mt-45">
        <form
          className="flex items-center flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <div className="p-3 md:p-0">
            <TableCard
              tableInfo={tables}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <h3 className="text-sm text-center font-light mt-5">
            Keep in mind you can only book a table for two hours max
            (09.00-11.00, 13.00-15.00 etc.)
          </h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-5">
            <DateTimeInput
              label="Start Time"
              value={formData.bookingTime.start}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  bookingTime: { ...prev.bookingTime, start: value },
                }))
              }
            />

            <DateTimeInput
              label="End Time"
              value={formData.bookingTime.end}
              onChange={(value) =>
                setFormData((prev) => ({
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
                  : undefined // same day only
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
                          2 * 60 * 60 * 1000
                      ),
                      "HH:mm"
                    )
                  : undefined
              }
            />
          </div>
          <button
            className="p-3 rounded-lg bg-transparent border text-amber-200/80 hover:bg-amber-900/30 hover:border-none transition cursor-pointer m-10"
            type="submit"
          >
            Create Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTable;

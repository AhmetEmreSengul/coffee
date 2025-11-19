import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import TableCard from "../components/TableCard";
import DateTimeInput from "../components/DateInput";

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
    <div className="min-h-screen w-screen p-6">
      <h1 className="text-xl font-bold mb-4">Select a Table</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <TableCard
            tableInfo={tables}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <div>
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
          />
        </div>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookTable;

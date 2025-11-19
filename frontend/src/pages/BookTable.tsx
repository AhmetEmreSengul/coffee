import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";

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
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table) => (
            <div
              key={table._id}
              data-tableid={table._id}
              onClick={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                setFormData({
                  ...formData,
                  tableNumber: target.dataset.tableid || "",
                });
              }}
              className={`w-20 h-20 flex items-center justify-center rounded-lg ${
                table.status === "active" ? "bg-green-300" : "bg-gray-100"
              }`}
            >
              {table.number}
            </div>
          ))}
        </div>
        <div>
          <input
            type="datetime-local"
            value={formData.bookingTime.start}
            onChange={(e) =>
              setFormData({
                ...formData,
                bookingTime: {
                  ...formData.bookingTime,
                  start: e.target.value,
                },
              })
            }
          />
          <input
            type="datetime-local"
            value={formData.bookingTime.end}
            onChange={(e) =>
              setFormData({
                ...formData,
                bookingTime: {
                  ...formData.bookingTime,
                  end: e.target.value,
                },
              })
            }
          />
        </div>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookTable;

import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: string;
}

export interface BookingUIForm {
  date: Date | null;
  startTime: string;
  endTime: string;
  tableNumber: string;
}

interface TableCardProps {
  tableInfo: Table[];
  formData: BookingUIForm;
  setFormData: React.Dispatch<React.SetStateAction<BookingUIForm>>;
}

const TableCard = ({ tableInfo, setFormData }: TableCardProps) => {
  const [selected, setSelected] = useState<Table | null>(null);

  return (
    <div className="bg-beige-100 rounded-2xl p-2 md:p-20 w-fit mx-auto relative border border-border-light shadow-sm">
      <h1 className="text-xs font-light absolute top-3 left-3/9 md:left-2/5 text-text-tertiary tracking-[0.5em]">
        WINDOW VIEW
      </h1>
      <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b w-full from-sky-600/60 rounded-t-2xl to-transparent pointer-events-none z-0"></div>

      <div className="grid grid-cols-4 gap-8 max-w-4xl items-center mx-auto mt-10">
        {tableInfo.map((table) => (
          <div
            key={table._id}
            data-tableid={table._id}
            onClick={(e) => {
              const id =
                (e.currentTarget as HTMLDivElement).dataset.tableid || "";

              setFormData((prev) => ({
                ...prev,
                tableNumber: id,
              }));

              setSelected(table);
            }}
            className={`p-4 flex items-center justify-center rounded-3xl group transition cursor-pointer relative border-2 ${
              selected?._id === table._id
                ? "bg-caramel-300 border-caramel-400 text-caramel-500 shadow-[0_0_20px_rgba(196,157,111,0.3)] scale-105"
                : "bg-cream-50 border-border-medium text-text-secondary hover:bg-beige-100 hover:border-caramel-200"
            }`}
          >
            <div className="flex flex-col gap-1 items-center">
              <p className="font-bold text-lg">T{table.number}</p>
              <p className="flex items-center font-light text-sm">
                <AiOutlineUser /> {table.capacity}
              </p>
              <p className="text-sm font-light text-center">
                {table.status === "active" ? "Available" : "Booked"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableCard;

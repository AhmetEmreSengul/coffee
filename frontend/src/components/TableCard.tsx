import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: string;
}

interface BookingFormData {
  tableNumber: string;
  bookingTime: {
    start: string;
    end: string;
  };
}

interface TableCardProps {
  tableInfo: Table[];
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
}

const TableCard = ({ tableInfo, formData, setFormData }: TableCardProps) => {
  const [selected, setSelected] = useState<Table | null>(null);

  return (
    <div className="bg-black/30 rounded-2xl p-2 md:p-20 w-fit mx-auto relative">
      <h1 className=" text-xs font-light absolute top-3 left-3/9 md:left-2/5  text-neutral-400 tracking-[0.5em]">
        WINDOW VIEW
      </h1>
      <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b w-full from-blue-900/30 rounded-t-2xl to-transparent pointer-events-none z-0"></div>
      <div className="grid grid-cols-4 gap-8 max-w-4xl items-center mx-auto mt-10">
        {tableInfo.map((table) => (
          <div
            key={table._id}
            data-tableid={table._id}
            onClick={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              setFormData({
                ...formData,
                tableNumber: target.dataset.tableid || "",
              });
              setSelected(table);
            }}
            className={`p-4 flex items-center justify-center rounded-3xl group transition cursor-pointer relative  ${
              selected?._id === table._id
                ? "bg-amber-500/90 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105"
                : "bg-neutral-800/50 border-white/5 text-neutral-400 hover:bg-neutral-700/50 hover:border-white/20"
            }`}
          >
            <div className="flex flex-col gap-1 items-center">
              <p className="font-bold text-lg"> T{table.number} </p>
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

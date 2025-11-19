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
  return (
    <div className="grid grid-cols-5 gap-4">
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
          }}
          className={`w-20 h-20 flex items-center justify-center rounded-lg ${
            table.status === "active" ? "bg-green-300" : "bg-gray-100"
          }`}
        >
          {table.number}
        </div>
      ))}
    </div>
  );
};

export default TableCard;

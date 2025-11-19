import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface DateTimeInputProps {
  label: string;
  value: string; // ISO string "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
}

const DateTimeInput = ({ label, value, onChange }: DateTimeInputProps) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const applyDate = () => {
    if (tempDate) {
      // Get local YYYY-MM-DDTHH:mm string
      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, "0");
      const day = String(tempDate.getDate()).padStart(2, "0");
      const hours = String(tempDate.getHours()).padStart(2, "0");
      const minutes = String(tempDate.getMinutes()).padStart(2, "0");

      const localString = `${year}-${month}-${day}T${hours}:${minutes}`;
      onChange(localString);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full text-left border rounded-md p-2 bg-white shadow-sm hover:shadow-md transition"
          >
            {tempDate ? format(tempDate, "PPP p") : "Select Date & Time"}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="bg-white shadow-xl rounded-xl p-4 border w-fit"
          sideOffset={8}
        >
          <div className="flex flex-col gap-3">
            {/* Day Picker */}
            <DayPicker
              mode="single"
              selected={tempDate ?? undefined}
              onSelect={(date) => setTempDate(date ?? null)}
              className="rounded-lg"
            />

            {/* Time Input */}
            <input
              type="time"
              className="border rounded-md p-2"
              value={tempDate ? format(tempDate, "HH:mm") : ""}
              onChange={(e) => {
                if (!tempDate) return;
                const [hours, minutes] = e.target.value.split(":").map(Number);
                const updated = new Date(tempDate);
                updated.setHours(hours);
                updated.setMinutes(minutes);
                setTempDate(updated);
              }}
            />

            {/* Apply Button */}
            <button
              type="button"
              className="bg-black text-white rounded-md py-2 hover:bg-gray-800 transition"
              onClick={applyDate}
            >
              Apply
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimeInput;

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface DateTimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;

  minDate?: Date;
  maxDate?: Date;
  minTime?: string;
  maxTime?: string;
}

const DateTimeInput = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  minTime,
  maxTime,
}: DateTimeInputProps) => {
  const [tempDate, setTempDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const today = new Date();
  const defaultMaxDate = new Date(today);
  defaultMaxDate.setDate(today.getDate() + 7);

  const toIsoUTC = (d: Date) => {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}Z`; // note the Z
  };

  const clampDailyTime = (d: Date) => {
    if (d.getHours() < 9) d.setHours(9, 0);
    if (d.getHours() > 23) d.setHours(23, 59);
    return d;
  };

  const emit = (d: Date | null) => {
    if (!d) return;
    onChange(toIsoUTC(d));
  };

  useEffect(() => {
    if (value) setTempDate(new Date(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg text-text-primary bg-beige-100/60 backdrop-blur-sm border border-border-light shadow-sm">
      <label className="text-2xl  font-medium">{label}</label>

      <div className="font-medium text-text-secondary">
        {tempDate ? format(tempDate, "PPP p") : "Select date & time"}
      </div>

      <DayPicker
        animate
        weekStartsOn={1}
        mode="single"
        selected={tempDate ?? undefined}
        onSelect={(d) => {
          if (!d) return;
          let selected = new Date(d);

          if (minDate && selected < minDate) selected = minDate;
          if (maxDate && selected > maxDate) selected = maxDate;

          selected = clampDailyTime(selected);

          if (tempDate) {
            selected.setHours(tempDate.getHours());
            selected.setMinutes(tempDate.getMinutes());
          }

          setTempDate(selected);
          emit(selected);
        }}
        disabled={{
          before: minDate ?? today,
          after: maxDate ?? defaultMaxDate,
        }}
      />

      <input
        type="time"
        className="border border-border-medium rounded-md p-2 text-text-primary bg-caramel-500/60 focus:border-caramel-400 focus:outline-none transition"
        value={tempDate ? format(tempDate, "HH:mm") : ""}
        min={minTime ?? "09:00"}
        max={maxTime ?? "23:59"}
        onChange={(e) => {
          if (!tempDate) return;

          const [h, m] = e.target.value.split(":").map(Number);
          let updated = new Date(tempDate);
          updated.setHours(h);
          updated.setMinutes(m);

          updated = clampDailyTime(updated);

          if (minTime) {
            const [minH, minM] = minTime.split(":").map(Number);
            const minD = new Date(updated);
            minD.setHours(minH, minM);
            if (updated < minD) updated = minD;
          }

          if (maxTime) {
            const [maxH, maxM] = maxTime.split(":").map(Number);
            const maxD = new Date(updated);
            maxD.setHours(maxH, maxM);
            if (updated > maxD) updated = maxD;
          }

          setTempDate(updated);
          emit(updated);
        }}
      />
    </div>
  );
};

export default DateTimeInput;

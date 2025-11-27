import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays } from "date-fns";

interface DateInputProps {
  value: Date | null;
  onChange: (d: Date) => void;
}

const DateInput = ({ value, onChange }: DateInputProps) => {
  const today = new Date();
  const maxDate = addDays(today, 7);

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg text-text-primary bg-beige-100/60 backdrop-blur-sm border border-border-light shadow-sm">
      <label className="text-lg font-medium mb-2 block">Select Date</label>

      <DayPicker
        animate
        mode="single"
        weekStartsOn={1}
        selected={value ?? undefined}
        onSelect={(day) => day && onChange(day)}
        disabled={{ before: today, after: maxDate }}
      />
    </div>
  );
};

export default DateInput;

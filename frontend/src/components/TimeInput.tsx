interface TimeSlot {
  value: string;
  label: string;
}

interface TimeSlotSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}

const TimeSlotSelect = ({
  label,
  value,
  onChange,
  min = "09:00",
  max = "23:59",
}: TimeSlotSelectProps) => {
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [minHour, minMinute] = min.split(":").map(Number);
    const [maxHour, maxMinute] = max.split(":").map(Number);

    let currentHour = minHour;
    let currentMinute = minMinute;

    const interval = 30;

    while (
      currentHour < maxHour ||
      (currentHour === maxHour && currentMinute <= maxMinute)
    ) {
      const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;

      slots.push({
        value: timeString,
        label: timeString,
      });

      currentMinute += interval;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg bg-beige-100/60 backdrop-blur-sm">
      <label className="font-bold">{label}</label>
      <select
        className="rounded-md p-2 w-full text-text-primary bg-caramel-500/60 focus:border-caramel-400 focus:outline-none transition cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select time</option>
        {timeSlots.map((slot) => (
          <option key={slot.value} value={slot.value} className="font-bold">
            {slot.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelect;

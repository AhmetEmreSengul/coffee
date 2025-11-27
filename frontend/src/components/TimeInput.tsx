interface TimeInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;

  min?: string;
  max?: string;
}

const TimeInput = ({ label, value, onChange, min, max }: TimeInputProps) => {
  return (
    <div className="flex flex-col gap-1 p-4  rounded-lg bg-beige-100/60 backdrop-blur-sm">
      <label className="font-bold ">{label}</label>
      <input
        className="rounded-md p-2 w-30 text-text-primary bg-caramel-500 focus:border-caramel-400 focus:outline-none transition"
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min ?? "09:00"}
        max={max ?? "23:59"}
      />
    </div>
  );
};

export default TimeInput;

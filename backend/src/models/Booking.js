import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    bookingTime: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bookingSchema.index({
  tableNumber: 1,
  "bookingTime.start": 1,
  "bookingTime.end": 1,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

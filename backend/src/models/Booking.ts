import mongoose from "mongoose";

export interface IBooking {
  user: mongoose.Types.ObjectId;
  tableNumber: mongoose.Types.ObjectId;
  bookingTime: {
    start: Date;
    end: Date;
  };
  qrToken: string;
  checkedIn: boolean;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
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

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;

import mongoose from "mongoose";

interface ICoffee {
  title: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

const coffeeSchema = new mongoose.Schema<ICoffee>(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Coffee = mongoose.model<ICoffee>("Coffee", coffeeSchema);

export default Coffee;

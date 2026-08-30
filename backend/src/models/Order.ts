import mongoose from "mongoose";

interface IOrder {
  user: mongoose.Types.ObjectId;
  orderItems: {
    title: string;
    type: string;
    quantity: number;
    image: string;
    price: number;
  }[];
  totalPrice: number;
  orderNumber: string;
  orderNote: string;
  createdAt: string;
  updatedAt: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        title: { type: String, required: true },
        type: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    orderNumber: {
      type: String,
    },
    orderNote: {
      type: String,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;

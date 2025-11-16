import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 2,
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
  },
});

const Table = mongoose.model("Table", tableSchema);

export default Table;

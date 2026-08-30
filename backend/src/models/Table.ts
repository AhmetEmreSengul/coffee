import mongoose from "mongoose";

export interface ITable {
  number: number;
  capacity: number;
  status: string;
}

const tableSchema = new mongoose.Schema<ITable>({
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

const Table = mongoose.model<ITable>("Table", tableSchema);

export default Table;

import Table from "../models/Table.js";

export const getTable = async (_, res) => {
  try {
    const tables = await Table.find({ status: "active" });

    if (tables.length === 0) {
      return res.status(404).json({ message: "No available tables" });
    }

    res.status(200).json(tables);
  } catch (error) {
    console.error("Error getting tables", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

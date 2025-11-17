import Table from "../models/Table.js";

export const getTable = async (req, res) => {
  try {
    const availableTables = await Table.find({ status: "active" });
    const unavailableTables = await Table.find({ status: "disabled" });

    if (!availableTables || !unavailableTables) {
      return res.status(404).json({ message: "No tables found" });
    }

    res.status(200).json(availableTables, unavailableTables);
  } catch (error) {
    console.error("Error getting tables", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

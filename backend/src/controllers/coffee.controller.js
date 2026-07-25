import Coffee from "../models/Coffee.js";

export const getAllCoffees = async (req, res) => {
  try {
    const coffees = await Coffee.find({});

    if (coffees.length === 0) {
      return res.status(404).json({ message: "No coffee found" });
    }

    res.status(200).json(coffees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

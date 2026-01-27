import Coffee from "../models/Coffee.js";

export const getAllCoffees = async (req, res) => {
  try {
    const coffees = await Coffee.find({});
    res.status(200).json(coffees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

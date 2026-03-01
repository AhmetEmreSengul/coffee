import {
  addMinutes,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  setHours,
  setMinutes,
} from "date-fns";
import Table from "../models/Table.js";
import Booking from "../models/Booking.js";

const OPENING_HOUR = 9;
const CLOSING_HOUR = 24;
const SLOT_DURATION = 120;

export const getTable = async (_, res) => {
  try {
    const tables = await Table.find();

    if (tables.length === 0) {
      return res.status(404).json({ message: "No available tables" });
    }

    res.status(200).json(tables);
  } catch (error) {
    console.error("Error getting tables", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTableBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const now = new Date();

    const tableBookings = await Booking.find(
      {
        tableNumber: id,
        "bookingTime.end": { $gte: now },
      },
      { "bookingTime.start": 1, "bookingTime.end": 1, _id: 0 },
    ).sort({ "bookingTime.start": 1 });

    res.status(200).json(tableBookings);
  } catch (error) {
    console.error("Error fetching bookings for this table", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const table = await Table.findById(id);
    if (!table || table.status !== "active") {
      return res.status(404).json({ message: "Table not available" });
    }

    let dayStart = parseISO(date);
    dayStart = setHours(setMinutes(dayStart, 0), OPENING_HOUR);

    let dayEnd = parseISO(date);
    dayEnd = setHours(setMinutes(dayEnd, 0), CLOSING_HOUR);

    const bookings = await Booking.find({
      tableNumber: id,
      "bookingTime.end": { $gte: dayStart },
      "bookingTime.start": { $lt: dayEnd },
    }).select("bookingTime");

    const slots = [];
    let current = new Date(dayStart);

    while (
      isBefore(addMinutes(current, SLOT_DURATION), dayEnd) ||
      isEqual(addMinutes(current, SLOT_DURATION), dayEnd)
    ) {
      const slotStart = new Date(current);
      const slotEnd = addMinutes(slotStart, SLOT_DURATION);

      const overlaps = bookings.some((b) => {
        const bookingStart = new Date(b.bookingTime.start);
        const bookingEnd = new Date(b.bookingTime.end);

        return (
          isBefore(slotStart, bookingEnd) && isAfter(slotEnd, bookingStart)
        );
      });

      if (!overlaps) {
        slots.push({
          start: slotStart,
          end: slotEnd,
        });
      }

      current = addMinutes(current, SLOT_DURATION);
    }

    res.status(200).json(slots);
  } catch (error) {
    console.error("Error generating slots:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

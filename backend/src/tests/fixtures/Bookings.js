import Booking from "../../models/Booking.js";

let qrTokenCounter = 0;

export const createTestBooking = async ({
  userId,
  tableNumber,
  start,
  end,
  overrides = {},
}) => {
  qrTokenCounter += 1;
  const booking = new Booking({
    user: userId,
    tableNumber,
    bookingTime: { start, end },
    qrToken: `test-qr-token-${qrTokenCounter}`,
    ...overrides,
  });
  return booking.save();
};

export const futureSlot = (startHoursFromNow = 1, durationHours = 2) => {
  const start = new Date(Date.now() + startHoursFromNow * 60 * 60 * 1000);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return { start, end };
};

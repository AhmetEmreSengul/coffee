export const bookingPayload = {
  tableNumber: "656f8a3b2e7c1a4d8f9b1003",
  bookingTime: {
    start: "2028-01-15T14:00:00.000Z",
    end: "2028-01-15T16:00:00.000Z",
  },
};

export const overlappingBooking = {
  _id: "656f8a3b2e7c1a4d8f9b1007",
  user: userId,
  tableNumber: "656f8a3b2e7c1a4d8f9b1003",
  bookingTime: {
    start: "2027-01-15T14:00:00.000Z",
    end: "2027-01-15T16:00:00.000Z",
  },
  qrToken: "test-qr-token",
  checkedIn: false,
};

export const unauthorizedBooking = {
  _id: "656f8a3b2e7c1a4d8f9b1009",
  user: userId2,
  tableNumber: "656f8a3b2e7c1a4d8f9b1003",
  bookingTime: {
    start: "2027-01-15T14:00:00.000Z",
    end: "2027-01-15T16:00:00.000Z",
  },
  qrToken: "test-qr-token3",
  checkedIn: false,
};

export const overlappingUpdateBooking = {
  _id: "656f8a3b2e7c1a4d8f9b1008",
  user: userId,
  tableNumber: "656f8a3b2e7c1a4d8f9b1003",
  bookingTime: {
    start: "2027-01-15T14:00:00.000Z",
    end: "2027-01-15T16:00:00.000Z",
  },
  qrToken: "test-qr-token2",
  checkedIn: false,
};

export const overlappingBookingPayload = {
  tableNumber: "656f8a3b2e7c1a4d8f9b1003",
  bookingTime: {
    start: "2027-01-15T14:00:00.000Z",
    end: "2027-01-15T16:00:00.000Z",
  },
};
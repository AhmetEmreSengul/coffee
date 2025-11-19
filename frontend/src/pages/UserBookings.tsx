import { useEffect, useState } from "react";
import { useBookingStore } from "../store/useBookingStore";

const UserBookings = () => {
  const { getUserBookings, myBookings, bookingQR, getQRCode } =
    useBookingStore();

  useEffect(() => {
    getUserBookings();
  }, []);

  useEffect(() => {
    if (myBookings.length > 0) {
      myBookings.forEach((b) => getQRCode(b._id));
    }
  }, [myBookings]);

  return (
    <div>
      {myBookings.map((booking) => (
        <div key={booking._id}>
          <p>{booking.tableNumber.number}</p>
          <p>
            {booking.bookingTime.start} {booking.bookingTime.end}
          </p>
        </div>
      ))}

      {bookingQR.map((qrObj, i) => (
        <img key={i} src={qrObj.qrCode} alt="QR Code" />
      ))}
    </div>
  );
};

export default UserBookings;

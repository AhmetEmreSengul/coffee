import { useEffect, useState, type FormEvent } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const UserBookings = () => {
  const {
    getUserBookings,
    myBookings,
    bookingQR,
    getQRCode,
    updateUserBooking,
    deleteUserBooking,
  } = useBookingStore();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: "",
    bookingTime: {
      start: "",
      end: "",
    },
  });
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    getUserBookings();
  }, []);

  useEffect(() => {
    if (myBookings.length > 0) {
      myBookings.forEach((b) => getQRCode(b._id));
    }
  }, [myBookings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.bookingId ||
      !formData.bookingTime.start ||
      !formData.bookingTime.end
    ) {
      toast.error("Please fill in both start and end times");
      return;
    }

    updateUserBooking(
      formData.bookingId,
      formData.bookingTime.start,
      formData.bookingTime.end
    );

    setUpdateOpen(false);
  };

  if (myBookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        No bookings found, You can reserve a table{" "}
        <Link to={"/book-table"} className="underline ml-1 text-amber-200 ">
          here.
        </Link>
      </div>
    );
  }

  return (
    <div>
      {myBookings.map((booking) => (
        <div key={booking._id}>
          <p>{booking.tableNumber.number}</p>
          <p>
            {booking.bookingTime.start} {booking.bookingTime.end}
          </p>
          <button
            onClick={() => {
              setUpdateOpen(true),
                setFormData({ ...formData, bookingId: booking._id });
            }}
          >
            Update
          </button>
          <button
            onClick={() => {
              setDeleteId(booking._id), deleteUserBooking(deleteId);
            }}
          >
            Delete
          </button>
          {updateOpen && (
            <div className="fixed inset-0 h-screen w-screen flex items-center justify-center ">
              <div className="size-90 bg-white/5 rounded-xl relative backdrop-blur-sm">
                <p
                  onClick={() => setUpdateOpen(false)}
                  className="absolute right-0 size-5 text-2xl"
                >
                  X
                </p>
                <form>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <input
                      type="datetime-local"
                      value={formData.bookingTime.start}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingTime: {
                            ...formData.bookingTime,
                            start: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="datetime-local"
                      value={formData.bookingTime.end}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingTime: {
                            ...formData.bookingTime,
                            end: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <button onClick={handleSubmit}>Update</button>
                    <button onClick={() => setUpdateOpen(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}

      {bookingQR.map((qrObj, i) => (
        <img key={i} src={qrObj.qrCode} alt="QR Code" />
      ))}
    </div>
  );
};

export default UserBookings;

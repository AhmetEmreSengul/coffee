import { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const AdminManageUsers = () => {
  const { id } = useParams();

  const {
    getAllUserBookings,
    getAllUserOrders,
    allUserBookings,
    allUserOrders,
  } = useAdminStore();

  useEffect(() => {
    getAllUserBookings(id!);
    getAllUserOrders(id!);
  }, []);

  console.log(allUserBookings);
  console.log(allUserOrders);

  return (
    <div className="pt-40 h-screen w-screen bg-[#333] flex flex-col md:flex-row text-white overflow-x-hidden">
      <div className="container max-w-3xl mx-auto overflow-y-scroll">
        <h1 className="text-4xl font-bold mb-10">User Orders</h1>
        <div>
          {allUserOrders.map((order) => (
            <div className="border-b">
              {order.orderItems.map((item) => (
                <div>
                  <p>
                    {item.title}- x{item.quantity}
                  </p>
                </div>
              ))}
              <p> {order.totalPrice}₺ </p>
              <p>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container max-w-3xl mx-auto overflow-y-scroll">
        <h1 className="text-4xl font-bold mb-10">User Bookings</h1>
        <div>
          {allUserBookings.map((booking) => (
            <div className="border-b flex flex-col gap-1">
              <p className="font-bold">
                {booking.checkedIn ? "Checked In" : "Not Checked In"}
              </p>
              <div className="inline-flex gap-3">
                <h2 className="font-bold">Booked between</h2>
                <p>
                  {format(
                    new Date(booking.bookingTime.start),
                    "dd/MM/yyyy HH:mm",
                  )}
                  ---
                  {format(
                    new Date(booking.bookingTime.end),
                    "dd/MM/yyyy HH:mm",
                  )}
                </p>
              </div>
              <div className="inline-flex gap-3">
                <h2 className="font-bold">Booking created at</h2>
                <p>{format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;

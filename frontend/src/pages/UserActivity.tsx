import { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AdminManageUsers = () => {
  const { id } = useParams();

  const {
    getAllUserBookings,
    getAllUserOrders,
    allUserBookings,
    allUserOrders,
    bookingsLoading,
    ordersLoading,
  } = useAdminStore();

  useEffect(() => {
    getAllUserBookings(id!);
    getAllUserOrders(id!);
  }, []);

  return (
    <div className="pt-40 h-screen w-screen bg-[#333] flex flex-col md:flex-row gap-2 px-2 text-white overflow-x-hidden font-mono">
      <div className="container max-w-3xl mx-auto overflow-y-scroll">
        <h1 className="text-4xl font-bold mb-10">User Orders</h1>
        {ordersLoading ? (
          <div>
            <AiOutlineLoading3Quarters className="size-10 animate-spin" />
          </div>
        ) : (
          <div>
            {allUserOrders.map((order) => (
              <div className="border-b flex flex-col">
                {order.orderItems.map((item) => (
                  <div className="inline-flex gap-2">
                    <p>
                      {item.title}- x{item.quantity}
                    </p>
                    <p>{item.price * item.quantity}₺</p>
                  </div>
                ))}
                <div className="inline-flex gap-2">
                  <h2 className="font-bold">Total Price:</h2>
                  <p>₺{order.totalPrice}</p>
                </div>
                <div className="inline-flex gap-2">
                  <h2 className="font-bold">Ordered at: </h2>
                  <p>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</p>
                </div>
                {order.orderNote && (
                  <div className="inline-flex gap-2">
                    <h2 className="font-bold">Order Note: </h2>
                    <p> {order.orderNote} </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="container max-w-3xl mx-auto overflow-y-scroll">
        <h1 className="text-4xl font-bold mb-10">User Bookings</h1>
        {bookingsLoading ? (
          <div>
            <AiOutlineLoading3Quarters className="size-10 animate-spin" />{" "}
          </div>
        ) : (
          <div>
            {allUserBookings.map((booking) => (
              <div className="border-b flex flex-col gap-1">
                <p className="font-bold">
                  {booking.checkedIn ? (
                    <div className="inline-flex gap-2">
                      <span className="text-green-500">Checked In</span> ---
                      <p>
                        {format(
                          new Date(booking.updatedAt),
                          "dd/MM/yyyy HH:mm",
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500">Not Checked In</p>
                  )}
                </p>
                <div className="inline-flex gap-3">
                  <h2 className="font-bold">Booked between: </h2>
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
                  <h2 className="font-bold">Booking created at: </h2>
                  <p>
                    {format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;

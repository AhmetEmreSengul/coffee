import { useEffect, useState } from "react";
import { FaCalendarWeek, FaMugHot } from "react-icons/fa";
import { useOrderStore } from "../store/useOrderStore";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const OrderHistory = () => {
  const { isDeleting, pastOrders, isLoading, deleteOrder, getPastOrders } =
    useOrderStore();
  const { authUser } = useAuthStore();
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    getPastOrders();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setDeleteId("");
  };

  if (authUser?.isBanned) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-bg-primary">
        <div className="text-text-primary">
          You have been banned. If you think this is a mistake, Please contact
          us at
        </div>
        <a
          className="text-caramel-400 underline ml-1"
          href="mailto:timeslot@support.com"
        >
          timeslot@support.com
        </a>
      </div>
    );
  }

  if (pastOrders.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>
          No orders found. You can add coffees to your cart
          <Link
            className="text-caramel-400 hover:text-caramel-400/70 transition underline ml-1"
            to={"/menu"}
          >
            here.
          </Link>
        </p>
      </div>
    );
  }

  const handleOrderAgain = (order: OrderItem[]) => {
    useCartStore.setState({ cart: order });
    toast.success("Cart Updated");
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleString("en-US", options);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col gap-3 pt-40 items-center">
        <div className="skeleton w-4xl h-20 container bg-caramel-200"></div>
        <div className="skeleton w-4xl h-20 container bg-caramel-200"></div>
        <div className="skeleton w-4xl h-20 container bg-caramel-200"></div>
      </div>
    );
  }

  return (
    <div className="pt-40 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Order History</h1>
      <div className="max-w-4xl mx-auto p-5 md:p-0">
        {pastOrders.map((order) => (
          <div
            key={order._id}
            className="collapse collapse-arrow bg-beige-200 border border-beige-300 rounded-lg mb-5"
          >
            <input type="radio" name="order-accordion" />

            <div className="collapse-title p-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="bg-beige-400 p-3 rounded-lg mr-2">
                    <FaMugHot className="size-7 text-caramel-400" />
                  </span>

                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-lg">{order.orderNumber}</p>
                    <p className="text-2xl font-bold">{order.totalPrice}₺</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-6">
                  <FaCalendarWeek className="size-5 text-caramel-300" />
                  <p>{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="collapse-content mt-3">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-caramel-200 rounded-lg my-3 p-2"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      className="size-20 rounded-lg object-cover"
                      alt=""
                    />
                    <div className="ml-2">
                      <p className="text-lg font-bold">{item.title}</p>
                      <div className="flex gap-2">
                        <p
                          className={`rounded-lg w-12 text-center ${
                            item.type === "Cold"
                              ? "bg-dusty-blue-300"
                              : "bg-caramel-300"
                          }`}
                        >
                          {item.type}
                        </p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-lg">
                    {item.price * item.quantity}₺
                  </p>
                </div>
              ))}

              {order.orderNote.length > 0 && (
                <div className="bg-caramel-200 border-l-4 border-caramel-400 p-3 rounded-lg mt-3">
                  <p className="italic text-caramel-500 text-xl mx-5">
                    {order.orderNote}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  className="mt-4 bg-caramel-400 hover:bg-caramel-400/70 transition rounded-lg p-3 cursor-pointer"
                  onClick={() => handleOrderAgain(order.orderItems)}
                >
                  Order Again
                </button>
                <button
                  onClick={() => setDeleteId(order._id)}
                  className="mt-4 text-white bg-red-400 hover:bg-red-400/70 transition rounded-lg p-3 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {deleteId && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-10"
            onClick={() => setDeleteId("")}
          >
            <motion.div
              className="bg-cream-50/50 backdrop-blur-sm border border-border-light p-6 rounded-xl shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-lg font-black">Delete Order</h1>
              <h3 className="font-light mt-3">
                Are you sure you want to delete this order?
              </h3>

              <div className="flex justify-between mt-4">
                <button
                  className={`p-2  rounded-lg cursor-pointer ${isDeleting ? "bg-gray-300 text-gray-600" : "bg-caramel-400 text-white"}`}
                  onClick={() => handleDelete(deleteId)}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center gap-2">
                      Deleting
                      <AiOutlineLoading3Quarters className="size-5 animate-spin" />
                    </span>
                  ) : (
                    "Yes I'm sure."
                  )}
                </button>

                <button
                  className="p-2 bg-beige-300 rounded-lg"
                  onClick={() => setDeleteId("")}
                >
                  Nevermind.
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistory;

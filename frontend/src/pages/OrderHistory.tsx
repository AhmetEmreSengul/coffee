import { useEffect, useState } from "react";
import { FaCalendarWeek, FaChevronDown, FaMugHot } from "react-icons/fa";
import { useOrderStore } from "../store/useOrderStore";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const { getPastOrders, pastOrders } = useOrderStore();

  useEffect(() => {
    getPastOrders();
  }, []);

  console.log(pastOrders);

  if (pastOrders.length === 0) {
    return (
      <div className="pt-40">
        <h1 className="text-3xl font-bold text-center mb-10">
          No Order History
        </h1>
        <p className="text-center text-lg">
          You can add coffees to your cart{" "}
          <Link
            className="text-caramel-400 hover:text-caramel-400/70 transition underline"
            to={"/menu"}
          >
            here.
          </Link>
        </p>
      </div>
    );
  }

  const handleOrderAgain = (order) => {
    useCartStore.setState({ cart: order });
    toast.success("Cart Updated");
  };

  return (
    <div className="pt-40 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Order History</h1>
      <div className="max-w-4xl mx-auto p-5 md:p-0">
        {pastOrders.map((order) => (
          <div
            className="bg-beige-200 rounded-lg p-2 mb-5 cursor-pointer"
            onClick={() => setOrderId(order._id)}
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="bg-beige-400 p-3 rounded-lg flex items-center justify-center mr-2">
                  <FaMugHot className="size-7 text-caramel-400" />
                </span>

                <div className="flex flex-col gap-2">
                  <p className="font-bold text-lg"> {order.orderNumber} </p>
                  <p className="inline-flex items-center gap-1">
                    <FaCalendarWeek className="size-5 text-caramel-300" />{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-caramel-500">Total</p>
                  <p className="text-2xl font-bold">{order.totalPrice}₺</p>
                </div>
                <span className="p-2">
                  <FaChevronDown
                    className={`transition ${orderId === order._id ? "rotate-180" : ""}`}
                  />
                </span>
              </div>
            </div>
            {orderId === order._id && (
              <div className="mt-3">
                {order.orderItems.map((item) => (
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      className="w-25 rounded-lg mb-3"
                      alt=""
                    />
                    <div className="ml-2">
                      <div className="inline-flex items-center">
                        <p className="mr-2 text-lg font-bold">{item.title}</p>
                        <p className="mr-2 ">x{item.quantity}</p>
                      </div>
                      <p>{item.price}₺</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex  mt-3">
              <button
                className="bg-caramel-400 hover:bg-caramel-400/70 transition rounded-lg p-3 cursor-pointer"
                onClick={() => handleOrderAgain(order.orderItems)}
              >
                Order Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;

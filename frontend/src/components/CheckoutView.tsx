import { FaCheckCircle } from "react-icons/fa";
import { useOrderStore } from "../store/useOrderStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const CheckoutView = () => {
  const { getLastOrder, lastOrder } = useOrderStore();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    getLastOrder();
  }, []);

  return (
    <div className="max-w-2xl mx-auto pt-30">
      <div className=" rounded-xl p-12 text-center  shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Order Successful!
        </h2>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Show the order number to the cashier to
          get your order.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="text-left">
              <div className="text-gray-600">Order Number</div>
              {lastOrder?.orderNumber}
            </div>
            <div className="text-right">
              <div className="text-gray-600">Order Date</div>
              {new Date(lastOrder!.createdAt).toLocaleDateString()}
              <div className="font-bold text-gray-900"></div>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600 mb-2">Order Total</div>
            <div className="font-bold text-lg text-gray-900">
              {lastOrder?.totalPrice}₺
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <div className="font-semibold text-caramel-500 mb-2">
            Order Details:
          </div>
          <div className="space-y-1 text-sm text-black">
            {Object.values(lastOrder!.orderItems).map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.title} x{item.quantity}
                </span>
                <span>{(item.price * item.quantity).toFixed(2)}₺</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            navigate("/menu");
            clearCart();
          }}
          className="bg-caramel-500 hover:bg-caramel-500/80 text-white cursor-pointer px-8 py-4 rounded-lg font-bold text-lg transition-colors"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
};

export default CheckoutView;

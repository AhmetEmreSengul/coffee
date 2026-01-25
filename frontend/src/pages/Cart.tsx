import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CartCoffeCard from "../components/CartCoffeCard";
import CheckoutForm from "../components/CheckoutForm";
import { stripePromise } from "../lib/stripe";
import { useCartStore } from "../store/useCartStore";

const Cart = () => {
  const [view, setView] = useState("");
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  if (view === "checkout") {
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
                {Math.floor(1000 + Math.random() * 9000)
                  .toString()
                  .slice(-4)}
              </div>
              <div className="text-right">
                <div className="text-gray-600">Order Date</div>
                {new Date().toLocaleDateString()}
                <div className="font-bold text-gray-900"></div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-2">Order Total</div>
              <div className="font-bold text-lg text-gray-900">
                {totalPrice}₺
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="font-semibold text-caramel-500 mb-2">
              Order Details:
            </div>
            <div className="space-y-1 text-sm text-black">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
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
  }

  return (
    <div className="pt-30 flex flex-col items-center justify-center mx-20">
      <h1 className="font-bold text-4xl">Cart</h1>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col gap-2 mt-10">
          {cart.length > 0 && (
            <div className="hidden md:flex w-full border-b items-center justify-between">
              <p className="font-bold text-lg w-70">Product</p>
              <p className="font-bold text-lg text-center">Quantity</p>
              <p className="font-bold text-lg">Total Price</p>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-xl">
              No items in cart. Browse coffees from the
              <Link
                className="text-caramel-400 underline hover:text-caramel-300 transition ml-1"
                to="/menu"
              >
                menu
              </Link>
              .
            </div>
          ) : (
            <div className="max-h-120 space-y-2 overflow-y-auto">
              {cart.map((item) => (
                <CartCoffeCard key={item.id} coffee={item} />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className=" border-caramel-200 rounded-lg flex flex-col p-5 min-w-[320px] shadow-2xl mb-5 md:mb-0">
            <div className="mt-2">
              <p className="font-bold text-lg">Total Items: {totalItems}</p>
              <p className="font-bold text-lg mt-2">
                Total Price: ${totalPrice}₺
              </p>
            </div>

            <textarea
              className="border border-caramel-400 rounded-lg p-3 mt-6 w-full min-h-30 max-h-30"
              placeholder="Order Note"
            />

            <div className="mt-5">
              <p>
                For testing enter
                <span className="text-gray-400 font-mono font-bold mx-1">
                  4242 4242 4242 4242
                </span>
                for the card number.
              </p>
              <p>Enter a future date and any CVC for for the rest.</p>
            </div>

            {cart.length > 0 && (
              <Elements stripe={stripePromise}>
                <CheckoutForm setView={setView} />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Link } from "react-router-dom";
import CartCoffeCard from "../components/CartCoffeCard";
import CheckoutForm from "../components/CheckoutForm";
import { stripePromise } from "../lib/stripe";
import { useCartStore } from "../store/useCartStore";
import CheckoutView from "../components/CheckoutView";

const Cart = () => {
  const [view, setView] = useState("");
  const { cart } = useCartStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  if (view === "checkout") {
    return <CheckoutView />;
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
                <CartCoffeCard key={item._id} coffee={item} />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className=" border-caramel-200 rounded-lg flex flex-col p-5 min-w-[320px] shadow-2xl mb-5 md:mb-0">
            <div className="mt-2">
              <p className="font-bold text-lg">Total Items: {totalItems}</p>
              <p className="font-bold text-lg mt-2">
                Total Price: {totalPrice}₺
              </p>
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

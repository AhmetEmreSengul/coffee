import { Elements } from "@stripe/react-stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import CartCoffeCard from "../components/CartCoffeCard";
import CheckoutForm from "../components/CheckoutForm";
import CheckoutView from "../components/CheckoutView";
import { stripePromise } from "../lib/stripe";
import { useCartStore } from "../store/useCartStore";

const Cart = () => {
  const { cart } = useCartStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const [view, setView] = useState("");

  if (view === "checkout") {
    return <CheckoutView />;
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[calc(100vh-5.75rem)] items-center justify-center px-4 py-16">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-lg rounded-2xl border border-border-light bg-beige-50 px-6 py-10 text-center sm:px-10 sm:py-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500">
            Your basket
          </p>
          <h1 className="mt-3 font-serif text-4xl text-text-primary">
            Nothing brewing just yet.
          </h1>
          <p className="mt-3 leading-7 text-text-secondary">
            Browse the menu and add a café favourite to get started.
          </p>
          <Link
            className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-caramel-500 px-6 py-3 font-medium text-cream-50 transition-colors hover:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            to="/menu"
          >
            Explore the menu
            <AiOutlineArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="px-4 pb-16 pt-28 sm:px-6 md:px-10 md:pb-20 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-border-light pb-6 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500 sm:text-sm">
            Almost time for a coffee
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h1 className="font-serif text-4xl text-text-primary sm:text-5xl">
              Your cart
            </h1>
            <p className="pb-1 text-sm text-text-secondary">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)] lg:gap-8">
          <section aria-label="Items in your cart">
            <div className="mb-3 hidden grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-6 px-5 text-xs font-semibold uppercase tracking-wider text-text-tertiary sm:grid">
              <span>Item</span>
              <span>Quantity</span>
              <span className="min-w-26 text-right">Total</span>
              <span aria-hidden="true" className="size-10" />
            </div>
            <motion.div className="space-y-3">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.2 }}
                    exit={{ opacity: 0, x: -24 }}
                    key={item._id}
                    layout
                  >
                    <CartCoffeCard coffee={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <Link
              to="/menu"
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium text-caramel-500 transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            >
              <span aria-hidden="true">←</span>
              Continue browsing
            </Link>
          </section>

          <div
            aria-labelledby="order-summary-title"
            className="rounded-2xl border border-border-light bg-beige-50 p-5 sm:p-7 sticky top-28"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border-light pb-4">
              <h2
                id="order-summary-title"
                className="font-serif text-2xl text-text-primary"
              >
                Order summary
              </h2>
              <span className="rounded-full bg-cream-50 px-3 py-1 text-sm text-text-secondary">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-semibold tabular-nums text-text-primary">
                ₺{totalPrice.toFixed(2)}
              </span>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm setView={setView} />
            </Elements>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;

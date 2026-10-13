import { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderStore } from "../store/useOrderStore";

const formatPrice = (price: number) =>
  `₺${price.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const CheckoutView = () => {
  const { getLastOrder, lastOrder, isLoading } = useOrderStore();

  useEffect(() => {
    getLastOrder();
  }, [getLastOrder]);

  if (isLoading) {
    return (
      <main
        className="flex min-h-[calc(100vh-5.75rem)] items-center justify-center px-4 py-16"
        aria-label="Loading your order confirmation"
      >
        <div role="status" className="flex flex-col items-center gap-4 text-text-secondary">
          <AiOutlineLoading3Quarters
            aria-hidden="true"
            className="size-8 animate-spin text-caramel-500"
          />
          <p>Getting your order details…</p>
        </div>
      </main>
    );
  }

  if (!lastOrder) {
    return (
      <main className="flex min-h-[calc(100vh-5.75rem)] items-center justify-center px-4 py-16">
        <section className="w-full max-w-lg rounded-2xl border border-border-light bg-beige-50 px-6 py-10 text-center sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500">
            Order details
          </p>
          <h1 className="mt-3 font-serif text-3xl text-text-primary">
            We couldn’t find your order details.
          </h1>
          <p className="mt-3 leading-7 text-text-secondary">
            Your order information may still be processing. You can check your
            order history or return to the menu.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/order-history"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-caramel-500 px-5 py-2 font-medium text-cream-50 transition-colors hover:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            >
              View order history
            </Link>
            <Link
              to="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-medium px-5 py-2 font-medium text-text-primary transition-colors hover:bg-cream-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            >
              Return to menu
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const orderDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(lastOrder.createdAt));

  const totalItems = lastOrder.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <main className="px-4 pb-16 pt-28 sm:px-6 md:px-10 md:pb-20 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-3xl"
      >
        <section
          aria-labelledby="order-confirmation-title"
          className="overflow-hidden rounded-2xl border border-border-light bg-cream-50 shadow-sm"
        >
          <div className="bg-beige-50 px-5 py-8 text-center sm:px-10 sm:py-10">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-sage-100 text-sage-400 sm:size-16">
              <FaCheck aria-hidden="true" className="size-6 sm:size-7" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500">
              Made with care
            </p>
            <h1
              id="order-confirmation-title"
              className="mt-2 font-serif text-4xl text-text-primary sm:text-5xl"
            >
              Order received.
            </h1>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-text-secondary">
              Thanks for choosing Time Slot Café. Show your order number to our
              team when you arrive.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-10 sm:py-8">
            <div className="grid gap-4 rounded-xl border border-border-light bg-bg-primary p-4 sm:grid-cols-2 sm:gap-6 sm:p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Order number
                </p>
                <p className="mt-1 font-serif text-2xl tracking-wide text-text-primary">
                  {lastOrder.orderNumber}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Placed
                </p>
                <p className="mt-2 text-sm font-medium text-text-primary">
                  {orderDate}
                </p>
              </div>
            </div>

            <section aria-labelledby="order-items-title" className="mt-8">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2
                    id="order-items-title"
                    className="font-serif text-2xl text-text-primary"
                  >
                    In your order
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Amount
                </span>
              </div>

              <ul className="divide-y divide-border-light">
                {lastOrder.orderItems.map((item, index) => (
                  <li
                    key={item._id ?? `${item.title}-${index}`}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="wrap-break-word font-medium text-text-primary">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums text-text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex items-center justify-between border-t border-border-medium pt-4">
                <p className="font-semibold text-text-primary">Total paid</p>
                <p className="font-semibold tabular-nums text-text-primary">
                  {formatPrice(lastOrder.totalPrice)}
                </p>
              </div>
            </section>

            {lastOrder.orderNote?.trim() && (
              <section
                aria-labelledby="order-note-title"
                className="mt-6 rounded-lg border border-border-light bg-beige-50 p-4"
              >
                <h2
                  id="order-note-title"
                  className="text-sm font-semibold text-text-primary"
                >
                  Note for the café
                </h2>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                  {lastOrder.orderNote}
                </p>
              </section>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/menu"
                className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-caramel-500 px-5 py-3 font-medium text-cream-50 transition-colors hover:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
              >
                Back to the menu
                <AiOutlineArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/order-history"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg border border-border-medium px-5 py-3 font-medium text-text-primary transition-colors hover:bg-beige-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
              >
                View order history
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
};

export default CheckoutView;

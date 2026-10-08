import { useEffect } from "react";
import { useCoffeeStore } from "../store/useCoffeeStore";
import CoffeeCard from "./CoffeeCard";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";

const CoffeeDisplay = () => {
  const { getCoffee, getRandomThree, isLoading } = useCoffeeStore();

  useEffect(() => {
    getCoffee();
  }, [getCoffee]);

  const randomThree = getRandomThree();

  return (
    <section className="bg-beige-50 px-4 py-16 sm:px-6 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500 sm:text-sm">
              A good place to start
            </p>
            <h2 className="font-serif text-4xl leading-tight text-text-primary sm:text-5xl">
              A few café favourites
            </h2>
            <p className="mt-3 max-w-lg leading-7 text-text-secondary">
              Find something lovely to sip while you make the time your own.
            </p>
          </div>
          <Link
            to="/menu"
            className="group inline-flex min-h-11 w-fit items-center gap-2 border-b border-caramel-400 pb-1 font-medium text-text-primary transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
          >
            View the full menu
            <AiOutlineArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div
            aria-label="Loading featured drinks"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                aria-hidden="true"
                className="skeleton rounded-xl border border-border-light bg-cream-50 p-3"
              >
                <div className="h-64 rounded-lg bg-beige-200" />
                <div className="mt-5 h-5 w-2/3 rounded bg-beige-200" />
                <div className="mt-3 h-4 w-full rounded bg-beige-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-beige-100" />
                <div className="mt-5 h-10 rounded-lg bg-beige-200" />
              </div>
            ))}
          </div>
        ) : randomThree.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {randomThree.map((coffee, index) => (
              <motion.div
                key={coffee._id}
                initial={{ y: 14, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.45,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="h-full"
              >
                <CoffeeCard coffee={coffee} variant="featured" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border-light bg-cream-50 px-6 py-10 text-center">
            <p className="font-serif text-2xl text-text-primary">
              The featured drinks are taking a little breather.
            </p>
            <p className="mt-2 text-text-secondary">
              Head to the full menu to see what’s available.
            </p>
            <Link
              to="/menu"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-caramel-500 px-5 py-2 font-medium text-cream-50 transition-colors hover:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            >
              Browse the menu
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoffeeDisplay;

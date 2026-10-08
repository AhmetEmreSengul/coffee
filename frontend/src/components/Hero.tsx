import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Hero = () => {
  const { authUser } = useAuthStore();

  return (
    <section className="mx-auto max-w-screen-2xl px-4 pb-12 pt-28 sm:px-6 md:px-10 md:pb-16 md:pt-32">
      <div className="grid items-center gap-9 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="order-0 max-w-xl py-4 md:py-10"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500 sm:text-sm">
            A little more room to slow down
          </p>
          <h1 className="font-serif text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.98] tracking-tight text-text-primary">
            Good coffee.
            <br />
            <span className="italic text-caramel-500">Time that’s yours.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            A calm corner to sip, focus, or catch up. Choose a table, settle in,
            and make a little space for yourself.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-caramel-500 px-6 py-3 font-medium text-cream-50 transition-colors hover:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            >
              Explore the menu
              <AiOutlineArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/book-table"
              onClick={() =>
                !authUser && toast.error("Please log in to book a table")
              }
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-caramel-400 px-6 py-3 font-medium text-text-primary transition-colors hover:bg-caramel-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
            >
              Book a table
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
          className="relative order-1"
        >
          <div className="overflow-hidden rounded-2xl border border-border-light bg-beige-100 shadow-lg shadow-text-primary/10">
            <img
              className="h-[clamp(18rem,48vw,39rem)] w-full object-cover object-center"
              src="/shop.png"
              alt="A bright café with window-side tables and a leafy green wall"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-lg border border-border-light bg-cream-50 px-4 py-3 shadow-md sm:bottom-5 sm:left-5 sm:px-5">
            <p className="font-serif text-lg italic text-text-primary sm:text-xl">
              Find your moment away.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

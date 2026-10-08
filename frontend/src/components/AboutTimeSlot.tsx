import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";

const AboutTimeSlot = () => {
  const { authUser } = useAuthStore();

  return (
    <section className="px-4 py-16 sm:px-6 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-border-light pt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pt-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500 sm:text-sm">
            The Time Slot Café
          </p>
          <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight text-text-primary sm:text-5xl">
            A little space to call your own.
          </h2>
        </div>
        <div className="max-w-2xl md:pt-2">
          <p className="text-lg leading-8 text-text-secondary">
            Great moments deserve their own space. Choose a table and a time,
            then settle into a calm, welcoming café—whether you’re here to
            focus, unwind, or catch up with someone special.
          </p>
          <Link
            to="/book-table"
            onClick={() =>
              !authUser && toast.error("Please log in to book a table")
            }
            className="group mt-6 inline-flex min-h-11 items-center gap-2 border-b border-caramel-400 pb-1 font-medium text-text-primary transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500"
          >
            Make a little time
            <AiOutlineArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutTimeSlot;

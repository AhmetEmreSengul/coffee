import { AiFillClockCircle, AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

const Hero = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-3 pt-30">
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-caramel-200 text-caramel-500 bg-cream-100 text-sm uppercase tracking-tighter md:tracking-widest">
        <AiFillClockCircle size={14} />
        <span>Reservation Only • Exclusive Access</span>
      </div>
      <div>
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-text-primary leading-tight font-serif text-center">
          The Time Slot <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-caramel-400 to-caramel-500 text-center italic">
            Café
          </span>
        </h1>
        <p className="text-xl text-center my-5 text-text-secondary max-w-2xl mx-auto font-light">
          A sanctuary for productivity and peace. Book your specific table,
          receive your digital key, and enter a world where time is respected.
        </p>
      </div>
      <Link
        to={"/book-table"}
        className="p-3 rounded-lg bg-caramel-200 border border-caramel-300 text-caramel-500 hover:bg-caramel-300 hover:border-caramel-400 transition cursor-pointer"
        onClick={() =>
          !authUser && toast.error("Please log in to book a table")
        }
      >
        <span className="inline-flex gap-3 items-center group">
          Book a Table
          <AiOutlineArrowRight className="size-6 transform transition-transform group-hover:translate-x-2" />
        </span>
      </Link>
    </div>
  );
};

export default Hero;

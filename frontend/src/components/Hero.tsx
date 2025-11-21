import { AiFillClockCircle, AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

const Hero = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-3 border-amber-900/30 text-amber-200/80 text-sm uppercase tracking-widest">
        <AiFillClockCircle size={14} />
        <span>Reservation Only • Exclusive Access</span>
      </div>
      <div>
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-amber-50 leading-tight font-serif text-center">
          The Time Slot <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-600 text-center italic">
            Café
          </span>
        </h1>
      </div>
      <Link
        to={"/book-table"}
        className="p-3 rounded-lg bg-transparent border  text-amber-200/80 hover:bg-amber-900/30 hover:border-none transition cursor-pointer"
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

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "../Data";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {width < 900 ? (
        <div>
          <div className="w-screen fixed h-23 bg-white/20 backdrop-blur-sm flex items-center justify-between relative">
            <div onClick={() => setOpen(!open)} className="px-8">
              <AiOutlineMenu size={30} />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
              <img className="size-30 rounded-xl" src="./timeslot.png" alt="" />
            </div>

            <div className="mr-20">
              <span>
                {authUser ? (
                  <button className="cursor-pointer" onClick={logout}>
                    Logout
                  </button>
                ) : (
                  <Link to={"/login"}> Login </Link>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-screen fixed h-23 bg-white/20 backdrop-blur-sm flex items-center justify-between relative">
          <div className="flex flex-row gap-6 ml-20">
            {navItems.map((item) => {
              if (item.protected && !authUser) return null;

              return (
                <span
                  key={item.link}
                  onClick={() => {
                    if (!authUser && item.requiresAuth) {
                      toast.error("Please login to book a table");
                    }
                  }}
                >
                  <Link to={item.link}>{item.title}</Link>
                </span>
              );
            })}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <img className="size-30 rounded-xl" src="./timeslot.png" alt="" />
          </div>

          <div className="mr-20">
            <span>
              {authUser ? (
                <button className="cursor-pointer" onClick={logout}>
                  Logout
                </button>
              ) : (
                <Link to={"/login"}> Login </Link>
              )}
            </span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <div className="text-2xl flex w-screen h-screen backdrop-blur-sm flex-col items-center mt-10 gap-5 fixed">
            {navItems.map((item, i) => {
              if (item.protected && !authUser) return null;
              return (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  key={item.link}
                  onClick={() => {
                    if (!authUser && item.requiresAuth) {
                      toast.error("Please login to book a table");
                    }
                  }}
                >
                  <Link to={item.link}>{item.title}</Link>
                </motion.span>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

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
    <div className="z-10">
      {width < 900 ? (
        <div>
          <div className="w-screen fixed h-23 bg-transparent backdrop-blur-sm flex items-center justify-between">
            <div onClick={() => setOpen(!open)} className="px-8">
              <AiOutlineMenu size={30} />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
              <img className="size-30 rounded-xl" src="./timeslot.png" alt="" />
            </div>

            <div className="mr-10">
              <span>
                {authUser ? (
                  <button
                    className="px-4 py-3 font-bold border-2 text-amber-200/80 rounded-xl cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    className="px-4 py-3 font-bold border-2 hover:border-amber-300 text-amber-200/80 rounded-xl transition cursor-pointer"
                    to={"/login"}
                  >
                    Login
                  </Link>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-screen fixed h-23 bg-transparent backdrop-blur-sm flex items-center justify-between">
          <div className="flex flex-row gap-6 ml-20">
            {navItems.map((item) => {
              if (item.protected && !authUser) return null;

              return (
                <span
                  className="font-bold hover:text-amber-300 transition"
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

          <div className="absolute left-1/2 -translate-x-1/2 translate-y-1/9">
            <img className="size-45 rounded-xl" src="./timeslot.png" alt="" />
          </div>

          <div className="mr-20">
            <span>
              {authUser ? (
                <button
                  className="px-4 py-3 font-bold border-2 hover:border-amber-300 text-amber-200/80 rounded-xl transition cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              ) : (
                <Link
                  className="px-4 py-3 font-bold border-2 hover:border-amber-300 text-amber-200/80 rounded-xl transition cursor-pointer"
                  to={"/login"}
                >
                  Login
                </Link>
              )}
            </span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="text-2xl flex w-screen h-screen backdrop-blur-sm bg-transparent flex-col items-center fixed top-23"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setOpen(false)}
          >
            {navItems.map((item, i) => {
              if (item.protected && !authUser) return null;
              return (
                <motion.span
                  className="mt-5 border-b-2 border-amber-200"
                  key={item.link}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => {
                    if (!authUser && item.requiresAuth) {
                      toast.error("Please login to book a table");
                    }
                    setOpen(false); // close menu on click
                  }}
                >
                  <Link to={item.link}>{item.title}</Link>
                </motion.span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

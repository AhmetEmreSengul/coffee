import { useEffect } from "react";
import { useCoffeeStore } from "../store/useCoffeeStore";
import CoffeeCard from "./CoffeeCard";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import CoffeDisplaySkeleton from "./CoffeDisplaySkeleton";

const CoffeeDisplay = () => {
  const { getCoffee, getRandomThree, isLoading } = useCoffeeStore();

  useEffect(() => {
    getCoffee();
    getRandomThree();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(() => (
            <div>
              <CoffeDisplaySkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-20">
      <h1 className="text-4xl text-text-primary mb-10">Today's Selection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-7">
        {getRandomThree().map((coffee, i) => (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            viewport={{ once: true }}
          >
            <CoffeeCard key={coffee.id} coffee={coffee} />
          </motion.div>
        ))}
      </div>

      <Link
        to={"/menu"}
        className="p-3 rounded-lg bg-caramel-200 border border-caramel-300 text-caramel-500 hover:bg-caramel-300 hover:border-caramel-400 transition cursor-pointer mt-10"
      >
        <span className="inline-flex gap-3 items-center group">
          See The Full Menu
          <AiOutlineArrowRight className="size-6 transform transition-transform group-hover:translate-x-2" />
        </span>
      </Link>
    </div>
  );
};

export default CoffeeDisplay;

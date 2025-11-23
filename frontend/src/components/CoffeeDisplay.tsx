import { useEffect } from "react";
import { useCoffeeStore } from "../store/useCoffeeStore";
import CoffeeCard from "./CoffeeCard";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";

const CoffeeDisplay = () => {
  const { getCoffee, getRandomThree } = useCoffeeStore();

  useEffect(() => {
    getCoffee();
    getRandomThree();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-4xl ">Today's Selection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-7">
        {getRandomThree().map((coffee, i) => (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            viewport={{ once: true }}
          >
            <CoffeeCard
              title={coffee.title}
              key={coffee.id}
              image={coffee.image}
              type={coffee.type}
              description={coffee.description}
            />
          </motion.div>
        ))}
      </div>

      <Link
        to={"/menu"}
        className="p-3 rounded-lg bg-transparent border text-amber-200/80 hover:bg-amber-900/30 hover:border-none transition cursor-pointer mt-10"
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

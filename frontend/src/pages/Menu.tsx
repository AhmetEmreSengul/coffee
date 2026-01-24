import { useEffect, useState } from "react";
import { useCoffeeStore } from "../store/useCoffeeStore";
import CoffeeCard from "../components/CoffeeCard";
import { motion } from "framer-motion";
import { FaQuestion } from "react-icons/fa";
import CoffeDisplaySkeleton from "../components/CoffeDisplaySkeleton";

const Menu = () => {
  const {
    getCoffee,
    filteredCoffee,
    searchCoffee,
    currentPage,
    coffeesPerPage,
    setPage,
    isLoading,
  } = useCoffeeStore();
  const [text, setText] = useState("");

  const indexOfLast = currentPage * coffeesPerPage;
  const indexOfFirst = indexOfLast - coffeesPerPage;
  const paginated = filteredCoffee.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredCoffee.length / coffeesPerPage);

  useEffect(() => {
    getCoffee();
    searchCoffee("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCoffee(text);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="min-h-screen overflow-x-hidden items-center flex flex-col bg-bg-primary">
      <div className="mt-35">
        <h1 className="text-5xl text-center mt-10 text-text-primary">MENU</h1>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-3">
          <div className="hidden md:block md:w-80 md:shrink-0" />
          <div className="w-full md:h-20 md:fixed items-center md:items-start flex flex-col p-3">
            <input
              value={text}
              className="p-3 mt-7 w-72 border border-border-medium rounded-lg bg-cream-50 text-text-primary placeholder:text-text-tertiary focus:border-caramel-400 focus:outline-none transition"
              type="text"
              placeholder="Search For Coffees"
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-7 flex flex-row md:flex-col justify-start items-start gap-3">
              <button
                onClick={() => setText("hot")}
                className="w-22 h-17 md:h-12 p-3 bg-caramel-300 text-black rounded-lg hover:bg-caramel-400 transition cursor-pointer font-medium"
              >
                Hot
              </button>
              <button
                onClick={() => setText("cold")}
                className="w-22 h-17 md:h-12 p-3 bg-dusty-blue-300 text-black rounded-lg hover:bg-dusty-blue-400 transition cursor-pointer font-medium"
              >
                Cold
              </button>
              <button
                onClick={() => setText("")}
                className="w-22 h-17 md:h-12 p-3 rounded-lg bg-beige-300 text-black hover:bg-beige-400 transition cursor-pointer font-medium"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            {paginated.length === 0 && (
              <div className="w-full p-10 flex flex-col justify-center items-center gap-20">
                <h1 className="text-2xl font-light">
                  No coffees found for that description.
                </h1>
                <FaQuestion className="size-90 md:size-100 animate-pulse" />
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(() => (
                  <div>
                    <CoffeDisplaySkeleton />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 md:p-0 gap-3">
                  {paginated.map((coffee, i) => (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    >
                      <CoffeeCard
                        key={coffee.id}
                        title={coffee.title}
                        price={coffee.price}
                        description={coffee.description}
                        image={coffee.image}
                        type={coffee.type}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2 mb-5 px-15 my-10">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`px-4 py-2 rounded transition ${
                        currentPage === i + 1
                          ? "bg-caramel-400 text-cream-50"
                          : "bg-beige-200 text-text-secondary hover:bg-beige-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

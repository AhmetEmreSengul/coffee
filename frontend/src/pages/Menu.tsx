import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCoffeeStore } from "../store/useCoffeeStore";
import CoffeeCard from "../components/CoffeeCard";

const Menu = () => {
  const {
    getCoffee,
    filteredCoffee,
    searchCoffee,
    currentPage,
    coffeesPerPage,
    setPage,
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
    searchCoffee(text);
    setPage(1);
  }, [text]);

  return (
    <div className="min-h-screen overflow-x-hidden items-center flex flex-col">
      <Navbar />
      <div className="mt-35">
        <h1 className="text-5xl text-center mt-10">MENU</h1>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-3">
          <div className="hidden md:flex w-70 h-20 rounded-l-lg  flex-col p-3" />
          <div className="w-full md:h-20 md:fixed items-center md:items-start flex flex-col p-3">
            <input
              className="p-3 mt-7 w-72 border rounded-lg "
              type="text"
              placeholder="Search For Coffees"
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-7 flex flex-row md:flex-col justify-start items-start gap-3">
              <button
                onClick={() => setText("hot")}
                className="w-22 h-17 md:h-12 p-3 bg-red-500 rounded-lg hover:bg-red-900 transition cursor-pointer"
              >
                Hot
              </button>
              <button
                onClick={() => setText("cold")}
                className="w-22 h-17 md:h-12 p-3 bg-sky-500 rounded-lg hover:bg-sky-600 transition cursor-pointer"
              >
                Cold
              </button>
              <button
                onClick={() => setText("")}
                className="w-22 h-17 md:h-12 p-3 rounded-lg bg-neutral-500 hover:bg-neutral-600 transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="grid  grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 px-15 gap-3">
              {paginated.map((coffee) => (
                <CoffeeCard
                  key={coffee.id}
                  title={coffee.title}
                  description={coffee.description}
                  image={coffee.image}
                  type={coffee.type}
                />
              ))}
            </div>
            <div className="flex gap-2 mb-5 px-15 my-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-amber-600 text-white"
                      : "bg-neutral-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

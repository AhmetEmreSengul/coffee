import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";

interface Coffee {
  _id: number;
  title: string;
  type: string;
  quantity: number;
  price: number;
  image: string;
  description: string;
}

interface CoffeeCardProps {
  coffee: Coffee;
}

const CartCoffeCard = ({ coffee }: CoffeeCardProps) => {
  const { decreaseQty, increaseQty } = useCartStore();

  const totalPrice = coffee.price * coffee.quantity;

  return (
    <div className="flex :flex-row items-start md:items-center ">
      <img className="w-25 md:w-40 mr-5 rounded-lg" src={coffee.image} alt="" />
      <div className="w-30 md:w-50">
        <p className="font-bold text-lg w-20 truncate md:overflow-visible">
          {coffee.title}
        </p>
        <p className="text-sm">{coffee.price}TL</p>
      </div>
      <div className="w-40 items-center justify-center flex">
        <div className="flex flex-row">
          <button
            onClick={() => decreaseQty(coffee._id)}
            className="text-caramel-400 hover:text-caramel-300 transition cursor-pointer rounded-full"
          >
            <FaMinusCircle className="size-4" />
          </button>
          <p className="px-2 py-1 border-2 border-caramel-500 text-lg rounded-lg mx-3">
            {coffee.quantity}
          </p>
          <button
            onClick={() => increaseQty(coffee._id)}
            className="text-caramel-400 hover:text-caramel-300 transition cursor-pointer rounded-full"
          >
            <FaPlusCircle className="size-4" />
          </button>
        </div>
      </div>
      <div className="hidden md:block w-40">
        <p className="font-bold text-lg ml-20">{totalPrice}TL</p>
      </div>
    </div>
  );
};

export default CartCoffeCard;

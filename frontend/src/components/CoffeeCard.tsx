import { IoMdCart } from "react-icons/io";
import { useCartStore } from "../store/useCartStore";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

interface Coffee {
  _id: string;
  title: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

interface CoffeeCardProps {
  coffee: Coffee;
}

const CoffeeCard = ({ coffee }: CoffeeCardProps) => {
  const { addToCart, increaseQty, decreaseQty, cart } = useCartStore();

  const cartItem = cart.find((item) => item._id === coffee._id);

  return (
    <div className="flex flex-col items-center justify-center bg-beige-100 p-6 rounded-3xl mt-10 border border-border-light shadow-2xl">
      <div className="rounded-xl flex flex-col items-center w-70 h-120">
        <img
          className={`size-63 md:size-70 rounded-lg border-2 ${
            coffee.type === "Cold"
              ? "border-dusty-blue-300"
              : "border-caramel-300"
          }`}
          src={coffee.image}
          alt=""
        />
        <div className="flex flex-col gap-5 mt-5 p-3 md:p-0">
          <span className="flex justify-between">
            <p>{coffee.title}</p>
            <p>₺{coffee.price}</p>
          </span>
          <p className="font-light text-text-secondary  h-20">
            {coffee.description}
          </p>
        </div>
        {!cartItem ? (
          <div
            onClick={() => addToCart(coffee)}
            className="w-full bg-beige-400 hover:bg-beige-400/70 transition cursor-pointer rounded-full p-2 flex items-center justify-center gap-2"
          >
            <IoMdCart className="size-5" /> Add to Cart
          </div>
        ) : (
          <div className="w-full bg-beige-400 hover:bg-beige-400/70 transition cursor-pointer rounded-full p-2 flex items-center justify-center gap-10">
            <button
              onClick={() => decreaseQty(coffee._id)}
              className="text-xl font-bold cursor-pointer"
            >
              <CiCircleMinus className="size-7" />
            </button>

            <span className="font-semibold">{cartItem.quantity}</span>

            <button
              onClick={() => increaseQty(coffee._id)}
              className="text-xl font-bold cursor-pointer"
            >
              <CiCirclePlus className="size-7" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeCard;

import { IoMdCart } from "react-icons/io";

interface CoffeeCardProps {
  title: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

const CoffeeCard = ({
  title,
  type,
  image,
  description,
  price,
}: CoffeeCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-beige-100 p-6 rounded-3xl mt-10 border border-border-light shadow-2xl">
      <div className="rounded-xl flex flex-col items-center w-70 h-120">
        <img
          className={`size-63 md:size-70 rounded-lg border-2 ${
            type === "Cold" ? "border-dusty-blue-300" : "border-caramel-300"
          }`}
          src={image}
          alt=""
        />
        <div className="flex flex-col gap-5 mt-5 p-3 md:p-0">
          <span className="flex justify-between">
            <p>{title}</p>
            <p>₺{price}</p>
          </span>
          <p className="font-light text-text-secondary  h-20">{description}</p>
        </div>
        <div className="w-full bg-beige-400 hover:bg-beige-400/70 transition cursor-pointer rounded-full p-2 flex items-center justify-center gap-2">
          <IoMdCart className="size-5" /> Add to Cart
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;

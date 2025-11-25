interface CoffeeCardProps {
  title: string;
  type: string;
  image: string;
  description: string;
}

const CoffeeCard = ({ title, type, image, description }: CoffeeCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-amber-900/20 p-6 rounded-3xl mt-10">
      <div className="rounded-xl flex flex-col items-center w-70 h-100">
        <img
          className={`size-63 md:size-70 rounded-lg border ${
            type === "Cold" ? "border-sky-600" : "border-orange-600"
          }`}
          src={image}
          alt=""
        />
        <div className="flex flex-col gap-5 mt-5 p-3 md:p-0">
          <p className="font-bold"> {title} </p>
          <p className="font-light"> {description} </p>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;

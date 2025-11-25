interface CoffeeCardProps {
  title: string;
  type: string;
  image: string;
  description: string;
}

const CoffeeCard = ({ title, type, image, description }: CoffeeCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-beige-100 p-6 rounded-3xl mt-10 border border-border-light shadow-sm">
      <div className="rounded-xl flex flex-col items-center w-70 h-100">
        <img
          className={`size-63 md:size-70 rounded-lg border-2 ${
            type === "Cold" ? "border-dusty-blue-300" : "border-caramel-300"
          }`}
          src={image}
          alt=""
        />
        <div className="flex flex-col gap-5 mt-5 p-3 md:p-0">
          <p className="font-bold text-text-primary"> {title} </p>
          <p className="font-light text-text-secondary"> {description} </p>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;

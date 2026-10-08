const CoffeDisplaySkeleton = () => {
  return (
    <div className="w-70 h-100 bg-caramel-200 flex flex-col  gap-5 p-3 rounded-xl mt-5 skeleton">
      <div className="h-1/2  bg-caramel-100"></div>
      <div className="h-7  bg-caramel-100"></div>
      <div className="h-25  bg-caramel-100"></div>
      <div className="h-10  bg-caramel-100 rounded-full"></div>
    </div>
  );
};

export default CoffeDisplaySkeleton;

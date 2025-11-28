const TableCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center my-auto gap-5 mt-30 p-5">
      <div className="skeleton size-85 md:size-120 bg-caramel-200" />
      <div className="skeleton size-60 bg-caramel-200" />
      <div className="flex gap-5 mt-10">
        <div className="skeleton w-30 h-15 bg-caramel-200"></div>
        <div className="skeleton w-30 h-15 bg-caramel-200"></div>
      </div>
    </div>
  );
};

export default TableCardSkeleton;

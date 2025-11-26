const TableCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center my-auto mt-30">
      <div className="skeleton size-85 md:size-120 bg-neutral-400" />
      <div className="flex flex-col md:flex-row gap-5 mt-10">
        <div className="skeleton size-65 bg-neutral-400"></div>
        <div className="skeleton size-65 bg-neutral-400"></div>
      </div>
    </div>
  );
};

export default TableCardSkeleton;

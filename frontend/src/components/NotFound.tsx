import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col gap-5 items-center justify-center pt-30 bg-black">
      <h1 className="text-9xl font-extralight text-white animate-pulse">404</h1>
      <p className="text-xl text-white font-bold">
        Page you're looking for is not found.
      </p>
      <Link
        className="text-white font-extrabold underline hover:text-amber-300 transition"
        to="/"
      >
        Go Back
      </Link>
    </div>
  );
};

export default NotFound;

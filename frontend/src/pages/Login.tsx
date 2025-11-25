import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible, AiOutlineGoogle } from "react-icons/ai";

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen overflow-hidden bg-bg-primary">
      <Link to={"/"}>
        <div className="inline-flex items-center fixed top-0 left-0 md:p-20 p-5">
          <img className="size-20 md:size-30" src="/timeslot.png" alt="" />
          <h1 className="text-4xl font-serif text-caramel-500">Time Slot</h1>
        </div>
      </Link>

      <div>
        <form
          className="flex flex-col gap-7 size-80 md:size-100 justify-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-4xl text-text-primary">Welcome Back</h1>
          <div>
            <input
              className="p-4 w-full border border-border-medium rounded-lg bg-cream-50 text-text-primary placeholder:text-text-tertiary hover:border-caramel-300 focus:border-caramel-400 focus:outline-none transition"
              type="email"
              placeholder="coffee@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <input
              className="p-4 w-full border border-border-medium rounded-lg hover:border-caramel-300 bg-cream-50 text-text-primary placeholder:text-text-tertiary focus:border-caramel-400 focus:outline-none transition"
              type={`${visible ? "text" : "password"}`}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {visible ? (
              <AiFillEye
                onClick={() => setVisible(false)}
                className="absolute right-5 top-1/3 size-6 text-text-secondary cursor-pointer"
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setVisible(true)}
                className="absolute right-5 top-1/3 size-6 text-text-secondary cursor-pointer"
              />
            )}
          </div>
          <button
            className="p-3 rounded-lg border border-caramel-300 bg-caramel-200 text-caramel-500 cursor-pointer hover:bg-caramel-300 hover:border-caramel-400 transition font-medium"
            disabled={isLoggingIn}
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col gap-8 items-center">
          <h2 className="text-center text-text-secondary">
            Don't have an account?{" "}
            <Link className="hover:text-caramel-500 text-caramel-400 transition" to={"/signup"}>
              Signup
            </Link>
          </h2>
          <button
            disabled
            className="inline-flex text-md gap-2 items-center border border-border-medium p-3 bg-beige-100 text-text-tertiary cursor-not-allowed hover:border-border-medium transition rounded-lg w-full justify-center text-center"
          >
            Continue with <AiOutlineGoogle className="size-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

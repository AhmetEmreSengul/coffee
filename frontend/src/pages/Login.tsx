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
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen overflow-hidden">
      <Link to={"/"}>
        <div className="inline-flex items-center fixed top-0 left-0 md:p-20 p-5">
          <img className="size-20 md:size-30" src="/timeslot.png" alt="" />
          <h1 className="text-4xl font-serif text-amber-200/70">Time Slot</h1>
        </div>
      </Link>

      <div>
        <form
          className="flex flex-col gap-7 size-80 md:size-100 justify-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-4xl">Welcome Back</h1>
          <div>
            <input
              className="p-4 w-full border rounded-lg bg-white/4 backdrop-blur-3xl hover:border-amber-200 focus:border-none transition"
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
              className="p-4 w-full border rounded-lg hover:border-amber-200 bg-white/4 backdrop-blur-3xl focus:border-none transition"
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
                className="absolute right-5 top-1/3 size-6"
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setVisible(true)}
                className="absolute right-5 top-1/3 size-6"
              />
            )}
          </div>
          <button
            className="p-3 rounded-lg border bg-white/4 backdrop-blur-3xl border-amber-200/70 text-amber-200/70 cursor-pointer hover:border-amber-200 transition"
            disabled={isLoggingIn}
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col gap-8 items-center">
          <h2 className="text-center">
            Don't have an account?{" "}
            <Link className="hover:text-amber-200 transition" to={"/signup"}>
              Signup
            </Link>
          </h2>
          <button
            disabled
            className="inline-flex text-md gap-2 items-center border p-3 bg-white/4 backdrop-blur-3xl border-amber-200/70 text-amber-200/70 cursor-not-allowed hover:border-amber-200 transition rounded-lg w-full justify-center text-center"
          >
            Continue with <AiOutlineGoogle className="size-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

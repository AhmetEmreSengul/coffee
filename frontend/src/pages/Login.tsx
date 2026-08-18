import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineGoogle } from "react-icons/ai";
import { FaFish } from "react-icons/fa";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const { login, forgotPassword, isLoggingIn } = useAuthStore();

  const formSchema = z.object({
    email: z.email().min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const { Field, handleSubmit, getFieldValue } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await login(value);
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
  });

  const [visible, setVisible] = useState<boolean>(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const handleForgotPassword = async () => {
    const email = getFieldValue("email");
    const result = z.email().safeParse(email);

    if (!result.success) return;

    await forgotPassword(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen overflow-hidden bg-bg-primary">
      <Link to={"/"} className="hidden md:block">
        <div className="inline-flex items-center fixed top-0 left-0 md:p-20 p-5">
          <img className="size-20 md:size-30" src="/timeslot.png" alt="" />
          <h1 className="text-4xl font-serif text-caramel-500">Time Slot</h1>
        </div>
      </Link>

      <div>
        <form
          className="flex flex-col gap-7 size-80 md:size-100 justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h1 className="text-center text-4xl text-text-primary">
            Welcome Back
          </h1>
          <Field name="email">
            {(field) => {
              const { errors, isTouched } = field.state.meta;

              return (
                <div className="flex flex-col">
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="p-4 w-full border border-border-medium rounded-lg bg-cream-50 text-text-primary placeholder:text-text-tertiary hover:border-caramel-300 focus:border-caramel-400 focus:outline-none transition"
                    type="text"
                    placeholder="Email"
                  />

                  {errors.length > 0 && isTouched && (
                    <span className="text-red-500 text-sm">
                      {errors[0]?.message}
                    </span>
                  )}
                </div>
              );
            }}
          </Field>
          <div className="relative">
            <Field name="password">
              {(field) => {
                const { errors, isTouched } = field.state.meta;

                return (
                  <div className="flex flex-col">
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="p-4 w-full border border-border-medium rounded-lg bg-cream-50 text-text-primary placeholder:text-text-tertiary hover:border-caramel-300 focus:border-caramel-400 focus:outline-none transition"
                      type="text"
                      placeholder="Password"
                    />

                    {errors.length > 0 && isTouched && (
                      <span className="text-red-500 text-sm">
                        {errors[0]?.message}
                      </span>
                    )}
                  </div>
                );
              }}
            </Field>
            {visible ? (
              <AiFillEye
                onClick={() => setVisible(false)}
                className="absolute right-5 top-2/9 size-6 text-text-secondary cursor-pointer"
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setVisible(true)}
                className="absolute right-5 top-2/9 size-6 text-text-secondary cursor-pointer"
              />
            )}
            <div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="hover:text-caramel-500 text-caramel-400 transition text inline-flex items-center gap-2 mt-2 cursor-pointer"
              >
                Forgot Password? <FaFish />
              </button>
            </div>
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
            <Link
              className="hover:text-caramel-500 text-caramel-400 transition"
              to={"/signup"}
            >
              Signup
            </Link>
          </h2>
          <button
            onClick={handleGoogleLogin}
            className="inline-flex text-md gap-2 items-center border cursor-pointer border-border-medium p-3 bg-beige-100 text-text-tertiary  hover:border-border-medium transition rounded-lg w-full justify-center text-center"
          >
            Continue with <AiOutlineGoogle className="size-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

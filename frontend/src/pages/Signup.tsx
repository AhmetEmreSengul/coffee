import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineGoogle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const { signup, isSigningUp } = useAuthStore();

  const { Field, handleSubmit, state } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await signup(value);
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
  });

  const isDisabled = isSigningUp || !state.canSubmit;

  const [visible, setVisible] = useState<boolean>(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen overflow-hidden bg-bg-primary">
      <Link to={"/"} className="hidden md:block">
        <div className="inline-flex items-center fixed top-0 left-0 md:p-20 p-5">
          <img className="size-20 md:size-30" src="/timeslot.png" alt="" />
          <h1 className="text-4xl font-serif text-caramel-500">Time Slot</h1>
        </div>
      </Link>
      <form
        className="flex flex-col gap-7 size-80 md:size-100 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className="text-center text-4xl text-text-primary">Welcome </h1>
        <Field name="fullName">
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
                  placeholder="Full Name"
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
                  type="Email"
                  placeholder="coffee@gmail.com"
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
                    type={visible ? "text" : "password"}
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
          className={`p-3 rounded-lg border border-caramel-300 bg-caramel-200 text-caramel-500 cursor-pointer hover:border-caramel-400 transition font-medium ${isDisabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "hover:bg-caramel-300"}`}
          disabled={isDisabled}
          type="submit"
        >
          {isSigningUp ? (
            <span className="inline-flex gap-2">
              Creating Account{" "}
              <AiOutlineLoading3Quarters className="animate-spin size-5" />
            </span>
          ) : (
            "Create Account"
          )}
        </button>
        <div className="flex flex-col gap-8 items-center">
          <h2 className="text-center text-text-secondary">
            Already have an account?{" "}
            <Link
              className="hover:text-caramel-500 text-caramel-400 transition"
              to={"/login"}
            >
              Login
            </Link>
          </h2>
          <button
            onClick={handleGoogleLogin}
            className=" inline-flex text-md gap-2 items-center border cursor-pointer border-border-medium p-3 bg-beige-100 text-text-tertiary hover:border-border-medium transition rounded-lg w-full justify-center text-center"
          >
            Continue with <AiOutlineGoogle className="size-8" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

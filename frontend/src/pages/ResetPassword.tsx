import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const ResetPassword = () => {
  const { resetPassword } = useAuthStore();
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    await resetPassword(token!, password);
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="container w-lg flex flex-col items-center justify-center bg-beige-100 p-6 rounded-3xl mt-10 border border-border-light shadow-2xl">
        <h1 className="text-3xl text-green-700 my-4">Reset Password</h1>
        <input
          className="border p-2 rounded-lg w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="p-3 border rounded-lg mt-5 bg-beige-400 hover:bg-beige-400/70 transition cursor-pointer text-white"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

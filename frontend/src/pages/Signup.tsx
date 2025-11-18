import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface UserFormData {
  fullName: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signup(formData);
  };

  const { signup, isSigningUp } = useAuthStore();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            placeholder="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>
        <div>
          <label>Email</label>
          <input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button disabled={isSigningUp} type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;

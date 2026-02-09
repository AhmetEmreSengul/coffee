import { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AdminPage = () => {
  const { getAllUsers, users, usersLoading } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="pt-40 bg-[#333] min-h-screen w-screen font-mono space-y-5 text-white">
      <h1 className="text-5xl font-bold text-center">Admin Dashboard</h1>
      <div className="container max-w-6xl mx-auto space-y-4">
        {usersLoading ? (
          <div>
            <AiOutlineLoading3Quarters className="size-10 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 p-2 md:p-0">
            {users.map((user) => (
              <div
                key={user._id}
                className="text-white text-lg md:text-2xl flex gap-2 justify-between border p-1"
              >
                <p className="my-auto">
                  {user.fullName} - {user.email}
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Link
                    className="p-0 md:p-1 border-b cursor-pointer text-white/70 hover:text-white transition"
                    to={user._id}
                  >
                    Activity
                  </Link>
                  <button className="p-1 border-b border-red-500 cursor-pointer text-white/70 hover:text-red-600 transition">
                    Ban User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

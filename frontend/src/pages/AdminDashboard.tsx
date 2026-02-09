import { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const { getAllUsers, users } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="pt-40 bg-[#333] min-h-screen w-screen font-mono space-y-5">
      <h1 className="text-5xl text-white font-bold text-center">
        Admin Dashboard
      </h1>
      <div className="max-w-6xl mx-auto space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="text-white text-2xl flex gap-2 justify-between"
          >
            <p>
              {user.fullName} - {user.email}
            </p>
            <div className="inline-flex gap-2">
              <Link className="p-1 border cursor-pointer" to={user._id}>
                Manage User
              </Link>
              <button className="p-1 border border-red-500 cursor-pointer">
                Ban User 
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;

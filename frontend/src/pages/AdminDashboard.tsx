import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import VerifyBooking from "../components/VerifyBookings";
import { FaArrowRight } from "react-icons/fa";

const AdminPage = () => {
  const {
    getAllUsers,
    banUser,
    searchUsers,
    users,
    filteredUsers,
    usersLoading,
    verifyBookingQr,
  } = useAdminStore();

  const [text, setText] = useState<string>("");

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(text);
    }, 500);

    return () => clearTimeout(timer);
  }, [text]);

  const handleBan = async (id: string) => {
    await banUser(id);
  };

  const usersToDisplay = text.trim() ? filteredUsers : users;

  return (
    <div className="py-40 bg-[#333] min-h-screen w-screen font-mono space-y-5 text-white">
      <h1 className="text-5xl font-bold text-center">Admin Dashboard</h1>
      <div className="container max-w-6xl mx-auto space-y-4">
        {usersLoading ? (
          <div>
            <AiOutlineLoading3Quarters className="size-10 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 p-2 md:p-0">
            <h2 className="text-center text-2xl mt-10">Verify a Booking</h2>
            <VerifyBooking onScan={verifyBookingQr} />
            <h2 className="text-2xl text-center">Users</h2>
            <div className="flex justify-between">
              <input
                className="border p-2 w-"
                type="text"
                placeholder="Search by username/id"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Link
                to="/admin/coffees"
                className="inline-flex gap-2 items-center border p-2"
              >
                Manage Coffees
                <span>
                  <FaArrowRight />
                </span>
              </Link>
            </div>
            {usersToDisplay.map((user) => (
              <div
                key={user._id}
                className="text-white text-lg md:text-2xl flex flex-col md:flex-row gap-2 justify-center md:justify-between border p-1"
              >
                <p className="my-auto">
                  {user.fullName} - {user.email}
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Link
                    className="text-center p-0 md:p-1 border-b cursor-pointer text-white/70 hover:text-white transition"
                    to={user._id}
                  >
                    Activity
                  </Link>
                  <button
                    onClick={() => handleBan(user._id)}
                    className={`p-1 border-b  cursor-pointer text-white/70 transition  ${user.isBanned ? "hover:text-green-600 border-green-500" : "hover:text-red-600 border-red-500"}`}
                  >
                    {user.isBanned ? "Unban User" : "Ban User"}
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

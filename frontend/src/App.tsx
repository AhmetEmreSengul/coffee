import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Menu from "./pages/Menu";
import BookTable from "./pages/BookTable";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import UserBookings from "./pages/UserBookings";

const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="font-[lato]">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={authUser ? <LandingPage /> : <Login />} />
        <Route
          path="/signup"
          element={authUser ? <LandingPage /> : <Signup />}
        />
        <Route path="/menu" element={<Menu />} />
        <Route
          path="/book-table"
          element={authUser ? <BookTable /> : <LandingPage />}
        />
        <Route
          path="/my-bookings"
          element={authUser ? <UserBookings /> : <LandingPage />}
        />
      </Routes>
    </div>
  );
};

export default App;

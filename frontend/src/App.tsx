import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Menu from "./pages/Menu";
import BookTable from "./pages/BookTable";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import UserBookings from "./pages/UserBookings";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";

const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="font-[lato] min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
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
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/"} /> : <Signup />}
        />
        <Route path="/menu" element={<Menu />} />
        <Route
          path="/book-table"
          element={authUser ? <BookTable /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/my-bookings"
          element={authUser ? <UserBookings /> : <Navigate to={"/login"} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
      </Routes>
    </div>
  );
};

export default App;

import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import BookTable from "./pages/BookTable";
import Cart from "./pages/Cart";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";
import Signup from "./pages/Signup";
import UserBookings from "./pages/UserBookings";
import { useAuthStore } from "./store/useAuthStore";
import AdminPage from "./pages/AdminDashboard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AdminManageUsers from "./pages/AdminManageUsers";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const isAdmin = authUser?.role === "admin";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-primary text-text-primary">
        <AiOutlineLoading3Quarters className="size-10" />
      </div>
    );
  }

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
        <Route
          path="/order-history"
          element={authUser ? <OrderHistory /> : <Navigate to={"/login"} />}
        />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/admin/:id"
          element={isAdmin ? <AdminManageUsers /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
};

export default App;

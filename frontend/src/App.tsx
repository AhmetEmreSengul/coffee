import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Menu from "./pages/Menu";
import BookTable from "./pages/BookTable";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { auth, isLoading, login } = useAuthStore();

  console.log(auth, isLoading);

  return (
    <div>
      <button onClick={login}>Click</button>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/book-table" element={<BookTable />} />
      </Routes>
    </div>
  );
};

export default App;

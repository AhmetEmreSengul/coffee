import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        await checkAuth();
        navigate("/");
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };

    handleSuccess();
  }, [checkAuth, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Completing authentication...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default GoogleAuthSuccess;

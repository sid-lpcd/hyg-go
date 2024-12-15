import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return token;
};

export default useAuth;

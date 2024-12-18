import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();
  console.log(authState);

  if (!authState.isLoggedIn) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;

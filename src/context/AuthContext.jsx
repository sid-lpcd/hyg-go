import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, deleteToken, isTokenExpired, getTokenIfValid } from "../utils/tokenHelper";
import {
  loginUser,
  refreshTokenUser,
  registerUser,
  updateUser,
} from "../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
    expiresAt: null,
  });

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      setToken(response.token, response.expiresAt);
      setAuthState({
        isLoggedIn: true,
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      setToken(response.token, response.expiresAt);
      setAuthState({
        isLoggedIn: true,
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const update = async (formData) => {
    try {
      const response = await updateUser({
        user_id: authState.user.user_id,
        ...formData,
      });
      setToken(response.token, response.expiresAt);
      setAuthState({
        isLoggedIn: true,
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    deleteToken();
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  };
  const refreshToken = async () => {
    try {
      const response = await refreshTokenUser();
      setToken(response.token, response.expiresAt);
      setAuthState({
        token: response.token,
        expiresAt: response.expiresAt,
        isLoggedIn: true,
      });
      setLoading(false);
    } catch (err) {
      logout();
      navigate("/user");
    }
  };

  useEffect(() => {
    if (authState.token && isTokenExpired()) {
      logout();
      navigate("/user");
    }
  }, [authState]);

  useEffect(() => {
    const tokenData = getTokenIfValid();
    if (tokenData) {
      // Set the auth state with the valid token
      setAuthState(prevState => ({
        ...prevState,
        token: tokenData.token,
        expiresAt: tokenData.expiresAt,
        isLoggedIn: true
      }));
      refreshToken();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, update }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

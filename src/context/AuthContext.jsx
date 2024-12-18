import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, deleteToken } from "../utils/localStorageHelper";
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
  const isTokenExpired = (expiresAt) => {
    if (!expiresAt) return true;
    return new Date() >= new Date(Number(expiresAt));
  };

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
      if (response.status === 200) {
        setToken(response.data.token);
        setAuthState({
          isLoggedIn: true,
          user: response.data.user,
          token: response.data.token,
          expiresAt: response.data.expiresAt,
        });
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      if (response.status === 201) {
        const token = response.data.token;
        setToken(token);
        setAuthState({
          isLoggedIn: true,
          user: response.data.user,
          token: token,
          expiresAt: response.data.expiresAt,
        });
        return { success: true };
      }
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
      if (response.status === 200) {
        setToken(response.data.token, response.data.expiresAt);
        setAuthState({
          isLoggedIn: true,
          user: response.data.user,
          token: response.data.token,
          expiresAt: response.data.expiresAt,
        });
        return { success: true };
      }
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
      if (response.status === 200) {
        setToken(response.data.token, response.data.expiresAt);
        setAuthState({
          token: response.data.token,
          expiresAt: response.data.expiresAt,
          isLoggedIn: true,
        });
        setLoading(false);
      }
    } catch (err) {
      logout();
      navigate("/user");
    }
  };

  useEffect(() => {
    if (authState.token && isTokenExpired(authState.expiresAt)) {
      logout();
      navigate("/user");
    }
  }, [authState]);

  useEffect(() => {
    if (getToken()) {
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

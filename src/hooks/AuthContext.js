import { createContext, useContext, useState } from "react";
import { getToken, setToken, removeToken } from "../utils/localStorageHelper";
import { loginUser, registerUser } from "../utils/apiHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: !!getToken(),
    user: null, // Can hold user details
    token: getToken(),
  });

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setAuthState({
          isLoggedIn: true,
          user: data.user,
          token: data.token,
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
        });
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    removeToken();
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

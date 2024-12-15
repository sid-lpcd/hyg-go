import { createContext, useContext, useState } from "react";
import { getToken, setToken, deleteToken } from "../utils/localStorageHelper";
import { loginUser, registerUser, updateUser } from "../utils/apiHelper";

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
      if (response.status === 200) {
        console.log(response);
        setToken(response.data.token);
        setAuthState({
          isLoggedIn: true,
          user: response.data.user,
          token: response.data.token,
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

  const update = async (formData) => {
    try {
      const response = await updateUser({
        user_id: authState.user.user_id,
        ...formData,
      });
      if (response.status === 200) {
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
    deleteToken();
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, update }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

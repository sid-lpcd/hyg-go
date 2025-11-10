import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken, setToken, deleteToken, isTokenExpired, getTokenIfValid } from "../utils/tokenHelper";
import {
  loginUser,
  refreshTokenUser,
  registerUser,
  updateUser,
} from "../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { 
  User, 
  LoginUserRequest, 
  RegisterUserRequest, 
  UpdateUserRequest,
  LoginUserResponse,
  RegisterUserResponse
} from "../types/contract";
import { AuthState, AuthStateResponse } from "../types/common";

interface AuthContextType {
  authState: AuthState;
  login: (formData: LoginUserRequest) => Promise<AuthStateResponse>;
  register: (formData: RegisterUserRequest) => Promise<AuthStateResponse>;
  logout: () => void;
  update: (formData: Partial<UpdateUserRequest>) => Promise<AuthStateResponse>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
    expiresAt: null,
  });

  const login = async (formData: LoginUserRequest): Promise<AuthStateResponse> => {
    try {
      const response = await loginUser(formData);
      setToken(response.token, response.expiresAt);
      setAuthState({
        isLoggedIn: true,
        user: response.user || null,
        token: response.token,
        expiresAt: response.expiresAt || null,
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const register = async (formData: RegisterUserRequest): Promise<AuthStateResponse> => {
    try {
      const response = await registerUser(formData);
      setToken(response.token, response.expiresAt);
      setAuthState({
        isLoggedIn: true,
        user: response.user || null,
        token: response.token,
        expiresAt: response.expiresAt || null,
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const update = async (formData: Partial<UpdateUserRequest>): Promise<AuthStateResponse> => {
    try {
      const updateData: UpdateUserRequest = {
        userId: authState.user!.userId,
        ...formData,
      };
      const response = await updateUser(updateData);
      // Note: updateUser returns { user: User }, need to check if it also returns token
      setAuthState(prevState => ({
        ...prevState,
        isLoggedIn: true,
        user: response.user,
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = (): void => {
    deleteToken();
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
      expiresAt: null,
    });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await refreshTokenUser();
      setToken(response.token, response.expiresAt);
      setAuthState({
        token: response.token,
        expiresAt: response.expiresAt,
        isLoggedIn: true,
        user: authState.user, // Preserve user data
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
  }, [authState, navigate]);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
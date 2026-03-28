import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { setToken, deleteToken, isTokenExpired, getTokenIfValid } from "../utils/tokenHelper";
import {
  loginUser,
  refreshTokenUser,
  registerUser,
  updateUser,
} from "../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { 
  LoginUserRequest, 
  RegisterUserRequest, 
  UpdateUserRequest,
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
    user: undefined,
    token: "",
    expiresAt: undefined,
  });

  const loginInFlightRef = useRef<Promise<AuthStateResponse> | null>(null);
  const registerInFlightRef = useRef<Promise<AuthStateResponse> | null>(null);
  const updateInFlightRef = useRef<Promise<AuthStateResponse> | null>(null);
  const refreshInFlightRef = useRef<Promise<void> | null>(null);

  const login = async (formData: LoginUserRequest): Promise<AuthStateResponse> => {
    if (loginInFlightRef.current) {
      return loginInFlightRef.current;
    }

    const promise = (async () => {
      try {
        const response = await loginUser(formData);
        setToken(response.token, response.expiresAt);
        setAuthState({
          isLoggedIn: true,
          user: response.user || undefined,
          token: response.token,
          expiresAt: response.expiresAt || undefined,
        });
        return { success: true };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      } finally {
        loginInFlightRef.current = null;
      }
    })();

    loginInFlightRef.current = promise;
    return promise;
  };

  const register = async (formData: RegisterUserRequest): Promise<AuthStateResponse> => {
    if (registerInFlightRef.current) {
      return registerInFlightRef.current;
    }

    const promise = (async () => {
      try {
        const response = await registerUser(formData);
        setToken(response.token, response.expiresAt);
        setAuthState({
          isLoggedIn: true,
          user: response.user || undefined,
          token: response.token,
          expiresAt: response.expiresAt || undefined,
        });
        return { success: true };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      } finally {
        registerInFlightRef.current = null;
      }
    })();

    registerInFlightRef.current = promise;
    return promise;
  };

  const update = async (formData: Partial<UpdateUserRequest>): Promise<AuthStateResponse> => {
    if (updateInFlightRef.current) {
      return updateInFlightRef.current;
    }

    const promise = (async () => {
      try {
        const currentUserId = authState.user?.userId;
        if (!currentUserId) {
          return { success: false, error: "No authenticated user found for profile update" };
        }

        const updateData: UpdateUserRequest = {
          userId: currentUserId,
          ...formData,
        };
        const response = await updateUser(updateData);
        setAuthState(prevState => ({
          ...prevState,
          isLoggedIn: true,
          user: { userId: response.userId, email: response.email },
        }));
        return { success: true };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      } finally {
        updateInFlightRef.current = null;
      }
    })();

    updateInFlightRef.current = promise;
    return promise;
  };

  const logout = (): void => {
    deleteToken();
    setAuthState({
      isLoggedIn: false,
      user: undefined,
      token: "",
      expiresAt: undefined,
    });
  };

  const refreshToken = async (): Promise<void> => {
    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }

    const promise = (async () => {
      try {
        const response = await refreshTokenUser();
        setToken(response.token, response.expiresAt);
        setAuthState(prevState => ({
          token: response.token,
          expiresAt: response.expiresAt,
          isLoggedIn: true,
          user: prevState.user, // Preserve user data
        }));
        setLoading(false);
      } catch (err) {
        logout();
        navigate("/user");
      } finally {
        refreshInFlightRef.current = null;
      }
    })();

    refreshInFlightRef.current = promise;
    return promise;
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
          width="200"
          color="#ffffff"
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

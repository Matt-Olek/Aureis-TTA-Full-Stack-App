import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Axios from "../utils/Axios";

// Define types for user, error, and context values
type User = {
  email: string;
  type: string;
  loggedIn: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
};

// Define initial context and hook for accessing it
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Define AuthProvider component with types for props
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialUser: User = {
    email: "",
    type: "",
    loggedIn: false,
    is_staff: false,
    is_superuser: false,
  };

  const [user, setUser] = useState<User>(initialUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to set tokens in localStorage and Axios headers
  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    Axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  // Helper function to clear tokens from localStorage and Axios headers
  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete Axios.defaults.headers.common["Authorization"];
  };

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await Axios.post("token/", { email, password });
      const { access, refresh } = response.data;
      console.log(response.data);
      setTokens(access, refresh);

      // Optionally, you can fetch user info after login if needed
      const userInfoResponse = await Axios.get("user/");
      setUser(userInfoResponse.data.user);
      setUser((prevUser) => ({ ...prevUser, loggedIn: true }));

      setError(null);
      return "Login successful";
    } catch {
      setError("An unexpected error occurred");
      throw new Error("An unexpected error occurred");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      clearTokens();
      setUser(initialUser);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      } else {
        setError("An unexpected error occurred");
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        Axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        const response = await Axios.get("user/");
        console.log(response.data);
        setUser(response.data.user);
        setUser((prevUser) => ({ ...prevUser, loggedIn: true }));
      } catch {
        // Handle invalid token or expired token
        clearTokens();
        setUser(initialUser);
      }
    } else {
      setUser(initialUser);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

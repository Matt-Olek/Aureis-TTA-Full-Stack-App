import { createContext, useContext, useState, useEffect } from "react";
import Axios from "../utils/Axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const initialUser = {
    email: "",
    type: "",
    loggedIn: false,
    is_staff: false,
    is_superuser: false,
  };

  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to set tokens in localStorage and Axios headers
  const setTokens = (accessToken, refreshToken) => {
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

  const login = async (email, password) => {
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
    } catch (error) {
      setError(error.response?.data?.detail || error.message);
      throw new Error(error.response?.data?.detail || error.message);
    }
  };

  const logout = async () => {
    try {
      clearTokens();
      setUser(initialUser);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.detail || error.message);
      throw new Error(error.response?.data?.detail || error.message);
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
      } catch (error) {
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

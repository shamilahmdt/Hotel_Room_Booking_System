import { createContext, useState, useEffect } from "react";
import { profileAPI } from "../api/profileAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access");

      if (token) {
        try {
          const res = await profileAPI.getProfile();
          setUser(res.data.data); // 🔥 store full user object
        } catch (err) {
          logout();
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (tokens) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    try {
      const res = await profileAPI.getProfile();
      setUser(res.data.data); // 🔥 store full user
    } catch (err) {
      console.error("Failed to fetch user after login");
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
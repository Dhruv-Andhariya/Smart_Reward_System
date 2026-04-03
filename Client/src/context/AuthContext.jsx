import { createContext, useContext, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

const parseJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("srs_token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("srs_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/login", { email, password });
      const nextToken = data?.token || "";
      const decoded = parseJwtPayload(nextToken);
      const nextUser = data?.user || {
        id: decoded?.id,
        email,
        role: decoded?.role || "user"
      };

      localStorage.setItem("srs_token", nextToken);
      localStorage.setItem("srs_user", JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      await api.post("/api/users/register", payload);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("srs_token");
    localStorage.removeItem("srs_user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      loading,
      login,
      signup,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useEffect, useMemo, useState } from "react";
import { getMe, loginRequest } from "../services/auth.service";

export const AuthContext = createContext(null);

const STORAGE_KEY = "student-attendance-tracker-auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).token : null;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).user : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;

    getMe()
      .then((response) => {
        if (!active) {
          return;
        }

        setUser(response.data);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, user]);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    setToken(response.data.token);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      logout,
      setUser,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

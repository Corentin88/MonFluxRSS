"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    setIsLogged(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem("jwt", token);
    setIsLogged(true);

    // Planifie la déconnexion automatique selon l'expiration
    const decoded = parseJwt(token);
    if (decoded && decoded.exp) {
      const expirationTime = decoded.exp * 1000 - Date.now();
      if (expirationTime > 0) {
        setTimeout(logout, expirationTime);
      } else {
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000 - Date.now();
        if (expirationTime > 0) {
          setIsLogged(true);
          const timeout = setTimeout(logout, expirationTime);
          return () => clearTimeout(timeout);
        } else {
          logout();
        }
      } else {
        logout();
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return context;
}

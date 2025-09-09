import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI, setAuthToken, clearAuth, getAuthToken } from '../services/api';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider provides authentication state and actions to the app.
 * Exposes: user, loading, login, register, logout, ensureAuth
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    // Try to fetch current user if token exists
    const token = getAuthToken();
    if (!token) {
      setBootstrapped(true);
      return;
    }
    AuthAPI.me()
      .then((u) => setUser(u))
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setBootstrapped(true));
  }, []);

  const login = async (email, password) => {
    const res = await AuthAPI.login({ email, password });
    if (res?.token) setAuthToken(res.token);
    if (res?.user) setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await AuthAPI.register({ name, email, password });
    if (res?.token) setAuthToken(res.token);
    if (res?.user) setUser(res.user);
    return res;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const ensureAuth = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading: !bootstrapped, login, register, logout, ensureAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  return useContext(AuthContext);
}

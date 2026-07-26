import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // A simple ping route could be added to backend, but we can just assume 
        // if user data is needed we fetch it, or decode a token if we stored it in localStorage.
        // Wait, the backend uses httpOnly cookies. We need a `/api/auth/me` route on the backend
        // to return the current user profile based on the cookie.
        // Let's assume we need to add a `/api/auth/me` to the backend! I will add that later.
        const res = await api.get('/auth/me'); 
        setUser(res.data.user);
      } catch (error) {
        // Not logged in or token expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

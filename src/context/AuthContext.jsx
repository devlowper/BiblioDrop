import React, { createContext, useContext } from 'react';
import { useSession, signOut } from '../lib/auth-client';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: loading } = useSession();
  
  const user = session?.user || null;

  const login = (userData) => {
    // State is managed by better-auth automatically
  };

  const logout = async () => {
    try {
      await signOut();
      window.location.href = '/';
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

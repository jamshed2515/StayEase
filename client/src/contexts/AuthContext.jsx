import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('stayease_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Validate session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('stayease_token');
      if (token) {
        try {
          const data = await authService.getMe();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('stayease_user', JSON.stringify(data.user));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('stayease_token');
          localStorage.removeItem('stayease_user');
          setUser(null);
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      localStorage.setItem('stayease_token', data.token);
      localStorage.setItem('stayease_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, phone, password }) => {
    setLoading(true);
    try {
      const data = await authService.register({ name, email, phone, password });
      setUser(data.user);
      localStorage.setItem('stayease_token', data.token);
      localStorage.setItem('stayease_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore
    } finally {
      setUser(null);
      localStorage.removeItem('stayease_token');
      localStorage.removeItem('stayease_user');
    }
  };

  /**
   * Fast demo login using real seeded database accounts
   */
  const demoLogin = async (role = 'user') => {
    const creds =
      role === 'admin'
        ? { email: 'admin@stayease.com', password: 'admin123' }
        : { email: 'guest@stayease.com', password: 'password123' };

    return await login(creds.email, creds.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

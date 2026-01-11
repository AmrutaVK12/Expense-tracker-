import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/api/v1/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const register = async (name, email, password) => {
    const res = await api.post('/api/v1/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
  };

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

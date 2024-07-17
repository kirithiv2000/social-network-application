import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Set the base URL
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.get('/api/auth/user', { headers: { 'x-auth-token': token } })
        .then(res => setUser(res.data))
        .catch(err => console.log(err));
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/api/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    await axiosInstance.post('/api/users/register', { username, email, password });
    login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

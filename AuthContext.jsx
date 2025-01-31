import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
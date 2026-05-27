import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { connectSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const saveSession = (token, userData) => {
    localStorage.setItem('gf_token', token);
    localStorage.setItem('gf_user', JSON.stringify(userData));
    setUser(userData);
    connectSocket(userData.id);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('gf_token');
    localStorage.removeItem('gf_user');
    setUser(null);
    setReport(null);
  }, []);

  const fetchReport = useCallback(async () => {
    try {
      const { data } = await api.get('/reports/latest');
      setReport(data.report);
      return data.report;
    } catch {
      setReport(null);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      localStorage.setItem('gf_user', JSON.stringify(data.user));
      return data.user;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('gf_token');
      const stored = localStorage.getItem('gf_user');
      if (token && stored) {
        try {
          setUser(JSON.parse(stored));
          await refreshUser();
          await fetchReport();
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [refreshUser, fetchReport, logout]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data.token, data.user);
    await fetchReport();
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    saveSession(data.token, data.user);
    return data.user;
  };

  const googleLogin = async (profile) => {
    const { data } = await api.post('/auth/google', profile);
    saveSession(data.token, data.user);
    await fetchReport();
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        report,
        setReport,
        login,
        register,
        googleLogin,
        logout,
        fetchReport,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(sessionStorage.getItem('booklog_token')));

  const clearSession = useCallback(() => {
    sessionStorage.removeItem('booklog_token');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('booklog_token');
    if (!token) return;

    api.get('/users/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [clearSession]);

  const login = useCallback((token, nextUser) => {
    sessionStorage.setItem('booklog_token', token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // 서버 응답과 관계없이 브라우저의 토큰을 삭제합니다.
    }
    clearSession();
  }, [clearSession]);

  const updateUser = useCallback((nextUser) => setUser(nextUser), []);

  const value = useMemo(() => ({
    user,
    loading,
    isLoggedIn: Boolean(user),
    login,
    logout,
    updateUser,
    clearSession
  }), [user, loading, login, logout, updateUser, clearSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return context;
}

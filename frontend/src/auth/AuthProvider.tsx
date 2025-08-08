import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { authService } from '../services/auth.service';
import { App } from 'antd';

export interface UserPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: UserPayload | null;
  login: (accessToken: string) => void;
  logout: () => void;
  loading: boolean;
  getAccessToken: () => Promise<string | null>; // mới: dùng để gọi API an toàn
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const { message } = App.useApp();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const access = localStorage.getItem('access_token');
    if (access) {
      const decoded = jwtDecode<UserPayload>(access);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        await refreshToken(); // token hết hạn -> thử refresh
      }
    }
    setLoading(false);
  };

  const login = (accessToken: string, refreshToken?: string) => {
    authService.setToken(accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    setUser(jwtDecode<UserPayload>(accessToken));
  };

  const logout = async () => {
    await authService.clearToken();
    setUser(null);
    message.success('Đăng xuất thành công!');
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const res = await axios.post(
        'http://localhost:3000/auth/refresh',
        {},
        { withCredentials: true },
      );

      const { access_token } = res.data;
      login(access_token);
      return access_token;
    } catch (err) {
      console.error('Refresh token failed:', err);
      await logout();
      return null;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    const decoded = jwtDecode<UserPayload>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      return await refreshToken();
    }

    return token;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, getAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const getAccessToken = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('getAccessToken must be used inside AuthProvider');
  return ctx.getAccessToken;
};

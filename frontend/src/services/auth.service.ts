import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import type { UserPayload } from '../auth/AuthProvider';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const apis = {
  login: '/auth/login',
  register: '/users',
  getUserInfo: (id: string) => `/users/${id}`,
  logout: '/auth/logout',
  refreshToken: '/auth/refresh',
};

class AuthService {
  private accessTokenKey = 'access_token';

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post(apis.login, payload, { withCredentials: true });
    const { access_token, refresh_token } = response.data;
    return { accessToken: access_token, refreshToken: refresh_token };
  }

  async register(payload: {
    email: string;
    password: string;
    name: string;
  }): Promise<void> {
    await api.post(apis.register, payload);
  }

  async getUserInfo(userId: string) {
    const response = await api.get(apis.getUserInfo(userId));
    return response.data;
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Lưu token
  setToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  // Xóa token
  async clearToken() {
    localStorage.removeItem(this.accessTokenKey);
    await api.post(apis.logout, {}, { withCredentials: true });
  }

  // Check token hết hạn chưa
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<UserPayload>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const res = await api.post(apis.refreshToken, {}, { withCredentials: true });
      const { access_token } = res.data;
      if (access_token) {
        this.setToken(access_token);
        return access_token;
      }
      return null;
    } catch (err) {
      console.error('Refresh token failed:', err);
      this.clearToken();
      return null;
    }
  }

  // Lấy token an toàn
  async getAccessToken(): Promise<string | null> {
    const token = this.getToken();
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      return await this.refreshToken();
    }
    return token;
  }
}

export const authService = new AuthService();

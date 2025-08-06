import api from '../api/axios';

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
}

class AuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post(apis.login, payload);
    const { access_token, refresh_token } = response.data;
    return { accessToken: access_token, refreshToken: refresh_token };
  }

  async register(payload: { email: string; password: string; name: string }): Promise<void> {
    await api.post(apis.register, payload);
  }
}

export const authService = new AuthService();

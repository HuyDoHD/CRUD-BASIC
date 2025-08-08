import axios from 'axios';
import { getMessageInstance } from '../utils/messageProxy';
import { history } from '../utils/history';
import { authService } from '../services/auth.service';


const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  if (config.url?.includes('/auth/refresh') || config.url?.includes('/auth/logout')) {
    return config;
  }
  const token = await authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('hiiiiii');
    return response;
  },
  (error) => {
    console.log('hello');

    // ✅ Delay lấy message đến lúc chạy interceptor
    try {
      const message = getMessageInstance();

      if (error.response?.status === 401) {
        authService.clearToken();
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        history.push('/login');
      }

      const backendMsg = error.response?.data?.message;
      if (backendMsg) {
        message.error(backendMsg);
      } else {
        message.error('Đã xảy ra lỗi không xác định.');
      }
    } catch (err) {
      console.error('Message context not ready yet', err);
    }

    return Promise.reject(error);
  }
);

export default api;

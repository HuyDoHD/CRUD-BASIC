import { useAuth } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { App } from 'antd';

export const useLogin = () => {
  const { login } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    const { accessToken, refreshToken } = await authService.login(values);
    if (accessToken && refreshToken) {
      login(accessToken, refreshToken);
      message.success('Đăng nhập thành công!');
      navigate('/events');
    }
  };

  return {
    onFinish,
  };
};

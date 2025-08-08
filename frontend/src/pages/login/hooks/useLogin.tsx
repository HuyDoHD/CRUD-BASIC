import { useAuth } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { App } from 'antd';

export const useLogin = () => {
  const { login } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    const { accessToken } = await authService.login(values);
    if (accessToken) {
      login(accessToken);
      message.success('Đăng nhập thành công!');
      navigate('/events');
    }
  };

  return {
    onFinish,
  };
};

import { useNavigate } from 'react-router-dom';
import { Form, App } from 'antd';
import { useEffect } from 'react';
import { authService } from '../../../services/auth.service';

export const useRegister = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    message.success('Đăng ký thành công!');
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (values.password.trim() !== values.confirmPassword.trim()) {
        message.error('Mật khẩu không khớp');
        return;
      }
      const { confirmPassword, ...rest } = values;
      await authService.register(rest);
      message.success('Đăng ký thành công!');
      navigate('/login');
    } catch (error: any) {
      console.error('Register error:', error); // Ghi log
      message.error(
        error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
      );
    }
  };

  return {
    onFinish,
    form,
  };
};

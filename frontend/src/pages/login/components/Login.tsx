import { Form, Input, Button, Space, Typography } from 'antd';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export default function LoginForm() {
  const { onFinish } = useLogin();
  const navigate = useNavigate();

  return (
    <Form onFinish={onFinish} style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>Login</h2>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Nhập email!' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Nhập mật khẩu!' }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>

        <Space align="center" className='mt-2'>
          <Text>Bạn chưa có tài khoản?</Text>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => navigate('/register')}
          >
            Đăng ký
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

// src/layouts/Navbar.tsx
import { Button, Space } from 'antd';
import { useAuth } from '../auth/AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Space style={{ float: 'right', marginRight: 16 }}>
      <span>{user?.email}</span>
      <Button type="primary" onClick={logout}>
        Logout
      </Button>
    </Space>
  );
}

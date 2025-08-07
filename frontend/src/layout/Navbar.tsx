// src/layouts/Navbar.tsx
import { Menu, Space } from 'antd';
import { useAuth } from '../auth/AuthProvider';
import { InfoCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<InfoCircleOutlined />}>
        Thông tin người dùng
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Space style={{ float: 'right', marginRight: 16 }}>
      <Dropdown overlay={menu} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <UserOutlined />
          <span>{user?.email}</span>
        </Space>
      </Dropdown>
    </Space>
  );
}

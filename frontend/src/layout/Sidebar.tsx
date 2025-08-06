// src/layouts/Sidebar.tsx
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import {
    SettingOutlined,
    AppstoreOutlined
  } from '@ant-design/icons';

const { SubMenu } = Menu;

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={['/events']}
      style={{ height: '100%', borderRight: 0 }}
    >
      <SubMenu key="main" icon={<AppstoreOutlined />} title="Quản lý">
        <Menu.Item key="/events">
          <Link to="/events">Events</Link>
        </Menu.Item>
        <Menu.Item key="/request-voucher">
          <Link to="/request-voucher">Request Voucher</Link>
        </Menu.Item>
      </SubMenu>

      {user?.role === 'admin' && (
        <SubMenu key="admin" icon={<SettingOutlined />} title="Admin">
          <Menu.Item key="/admin">
            <Link to="/users">Users</Link>
          </Menu.Item>
        </SubMenu>
      )}
    </Menu>
  );
}

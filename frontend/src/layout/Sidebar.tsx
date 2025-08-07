// src/layouts/Sidebar.tsx
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import {
    SettingOutlined,
    AppstoreOutlined
  } from '@ant-design/icons';

const { SubMenu } = Menu;

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const selectedKey = location.pathname;
  return (
    <Menu
      mode="inline"
      theme="dark"
      // defaultSelectedKeys={['/events']}
      selectedKeys={[selectedKey]}
      style={{ height: '100%', borderRight: 0 }}
    >
      <SubMenu key="main" icon={<AppstoreOutlined />} title="Quản lý">
        <Menu.Item key="/events">
          <Link to="/events">Sự kiện</Link>
        </Menu.Item>
        <Menu.Item key="/voucher">
          <Link to="/voucher">Voucher</Link>
        </Menu.Item>
      </SubMenu>

      {user?.role === 'admin' && (
        <SubMenu key="admin" icon={<SettingOutlined />} title="Quản trị">
          <Menu.Item key="/users">
            <Link to="/users">Người dùng</Link>
          </Menu.Item>
        </SubMenu>
      )}
    </Menu>
  );
}

import { Menu, Space } from 'antd';
import { useAuth } from '../auth/AuthProvider';
import { InfoCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import UserInfoModal from '../common/components/user-info/UserInfo';


export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<InfoCircleOutlined />}
        onClick={() => setOpen(true)}
      >
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
      <UserInfoModal open={open} onClose={() => setOpen(false)} user={user} />
    </Space>
  );
}

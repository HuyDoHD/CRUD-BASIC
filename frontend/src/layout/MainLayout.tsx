// src/layouts/MainLayout.tsx
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

const { Header, Content, Sider } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        width={200}
        style={{ background: '#001529' }}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Sidebar />
      </Sider>

      {/* Main content */}
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <Navbar />
        </Header>

        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

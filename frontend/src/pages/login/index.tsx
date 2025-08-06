import { Card, Col, Layout, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import LoginForm from './components/Login';

const LoginPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={6}>
            <Card
              style={{ borderRadius: 8 }}
              bodyStyle={{ padding: '32px 24px' }}
            >
              <LoginForm />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginPage;

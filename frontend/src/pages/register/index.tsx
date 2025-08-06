import { Layout, Row, Col, Card } from 'antd';
import RegisterForm from './components/RegisterForm';

const { Content } = Layout;

const RegisterPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={6}>
            <Card
              title="Đăng ký tài khoản"
              style={{ borderRadius: 8 }}
              bodyStyle={{ padding: '32px 24px' }}
            >
              <RegisterForm />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RegisterPage;

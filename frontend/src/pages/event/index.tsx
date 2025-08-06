import { Layout} from 'antd';
import Event from './components/Event';

const { Content } = Layout;

const EventPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content>
        <Event />
      </Content>
    </Layout>
  );
};

export default EventPage;

import { useState } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../../services/event.service';
import { App, Button, Space } from 'antd';
import { useEffect } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { voucherService } from '../../../services/voucher.service';

export interface Events {
  _id: string;
  name: string;
  maxQuantity: number;
  issued: number;
}

export const useEvent = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await eventService.fetchAll();
      setEvents(data);
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleIssueVoucher = async (eventId: string) => {
    try {
      await voucherService.issueVoucher(eventId);
      message.success('Lấy voucher thành công!');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tổng số lượng voucher',
      dataIndex: 'maxQuantity',
      key: 'maxQuantity',
    },
    {
      title: 'Số lượng còn lại',
      key: 'remaining',
      render: (_: any, record: Events) => record.maxQuantity - record.issued,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Events) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleIssueVoucher(record._id)}
          >
            <PlusOutlined /> Lấy voucher
          </Button>
          <Button
            type="primary"
            onClick={() => navigate(`/events/${record._id}`)}
          >
            <EditOutlined /> Sửa
          </Button>
          <Button danger onClick={() => navigate(`/events/${record._id}`)}>
            <DeleteOutlined /> Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return {
    events,
    loading,
    handleLogout,
    columns,
  };
};

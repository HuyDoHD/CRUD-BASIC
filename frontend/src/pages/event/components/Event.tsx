import { Table, Space, Spin } from 'antd';
import * as React from 'react';
import { useEvent } from '../hooks/useEvent';
import type { Events } from '../hooks/useEvent';

const EventPage: React.FC = () => {
  const { events, loading, columns } = useEvent();

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 16,
        }}
      >
        <h2>Danh sách sự kiện</h2>
      </Space>

      {loading ? (
        <Spin />
      ) : (
        <Table<Events>
          dataSource={events}
          rowKey="_id"
          columns={columns}
        />
      )}
    </div>
  );
};

export default EventPage;

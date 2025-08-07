import { Space, Spin, Button } from 'antd';
import * as React from 'react';
import { useEventTable } from '../hooks/useEventTable';
import type { Events } from '../hooks/useEventTable';
import { EventFormModal } from './EventForm';
import { DataTable } from '../../../common/components/data-table/DataTable';
import { FilterPanel } from '../../../common/components/filter-panel/FilterPanel';

const EventTable: React.FC = () => {
  const {
    events,
    loading,
    columns,
    handleCreate,
    isModalVisible,
    handleClose,
    editingEvent,
    handleSubmit,
    pagination,
    setPagination,
    filterFields,
    handleFilterChange
  } = useEventTable();

  return (
    <div style={{ padding: 24 }}>
      <FilterPanel fields={filterFields} onChange={handleFilterChange} />

      <Space
        style={{
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 16,
        }}
      >
        <h2>Danh sách sự kiện</h2>
        <Button type="primary" onClick={handleCreate}>
          + Thêm mới
        </Button>
      </Space>

      {loading ? (
        <Spin />
      ) : (
        // <Table<Events> dataSource={events} rowKey="_id" columns={columns} />
        <DataTable<Events>
          rowKey="_id"
          data={events}
          columns={columns}
          onPaginationChange={(newPagination) => {
            setPagination((prev) => ({
              ...prev,
              current: newPagination.current ?? 1,
              pageSize: newPagination.pageSize ?? 10,
            }));
          }}
          pagination={pagination}
        />
      )}

      <EventFormModal
        visible={isModalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editingEvent || {}}
        mode={editingEvent ? 'edit' : 'create'}
      />
    </div>
  );
};

export default EventTable;

import { Space, Spin, Button } from 'antd';
import * as React from 'react';
import { useUserTable } from '../hooks/useUserTable';
import type { Users } from '../hooks/useUserTable';
import { DataTable } from '../../../common/components/data-table/DataTable';
import { FilterPanel } from '../../../common/components/filter-panel/FilterPanel';
import { UserFormModal } from './UserForm';
// import { UserFormModal } from './UserForm';

const UserTable: React.FC = () => {
  const {
    users,
    loading,
    columns,
    handleCreate,
    isModalVisible,
    handleClose,
    editingUser,
    handleSubmit,
    filterFields,
    handleFilterChange,
    setPagination,
    pagination,
  } = useUserTable();

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
        <h2>Danh sách người dùng</h2>
        <Button type="primary" onClick={handleCreate}>
          + Thêm mới
        </Button>
      </Space>

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200, // hoặc 100% nếu bạn muốn toàn vùng
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <DataTable<Users>
          rowKey="_id"
          data={users}
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

      <UserFormModal
        visible={isModalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editingUser || {}}
        mode={editingUser ? 'edit' : 'create'}
      />
    </div>
  );
};

export default UserTable;

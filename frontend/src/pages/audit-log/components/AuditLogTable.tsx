import { Space, Spin } from 'antd';
import * as React from 'react';
import { useAuditLogTable } from '../hooks/useAuditLogTable';
import { DataTable } from '../../../common/components/data-table/DataTable';
import { FilterPanel } from '../../../common/components/filter-panel/FilterPanel';

const AuditLogTable: React.FC = () => {
  const {
    users,
    loading,
    columns,
    filterFields,
    handleFilterChange,
    setPagination,
    pagination,
  } = useAuditLogTable();

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
        <h2>Lịch sử thay đổi</h2>
      </Space>

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <DataTable
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
    </div>
  );
};

export default AuditLogTable;

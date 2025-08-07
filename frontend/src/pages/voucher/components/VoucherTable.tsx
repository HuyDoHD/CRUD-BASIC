import { Space, Spin } from 'antd';
import * as React from 'react';
import { useVoucherTable } from '../hooks/useVoucherTable';
import type { Vouchers } from '../hooks/useVoucherTable';
import { DataTable } from '../../../common/components/data-table/DataTable';
import { FilterPanel } from '../../../common/components/filter-panel/FilterPanel';

const VoucherTable: React.FC = () => {
  const {
    vouchers,
    loading,
    columns,
    filterFields,
    handleFilterChange,
    setPagination,
    pagination,
  } = useVoucherTable();

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
        <h2>Danh sách voucher của tôi</h2>
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
        <DataTable<Vouchers>
          rowKey="_id"
          data={vouchers}
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

export default VoucherTable;

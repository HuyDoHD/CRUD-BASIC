import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, Button, Space } from 'antd';
import { useEffect } from 'react';
import type { DataTableColumn } from '../../../common/components/data-table/DataTable';
import type { FilterField } from '../../../common/components/filter-panel/FilterPanel';
import { useDebounce } from '../../../common/hooks/useDebounce';
import { voucherService } from '../../../services/voucher.service';
import DeleteConfirmModal from '../../../common/components/delete-confirm-modal/DeleteConfirmModal';

export interface Vouchers {
  _id: string;
  code: string;
  eventName: string;
}

export const useVoucherTable = () => {
  const [vouchers, setVouchers] = useState<Vouchers[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns: DataTableColumn<Vouchers>[] = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <DeleteConfirmModal
            title="Xác nhận xoá"
            content="Bạn có chắc chắn muốn xoá voucher này?"
            onConfirm={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: 'eventName',
      label: 'Tên sự kiện',
      type: 'text',
      colSpan: 4,
    },
    {
      name: 'code',
      label: 'Mã voucher',
      type: 'text',
      colSpan: 4,
    },
  ];

  const convertFiltersToQuery = (filters: Record<string, string[] | null>) => {
    const query: Record<string, string> = {};

    Object.entries(filters).forEach(([key, val]) => {
      if (!val || val.length === 0) return;

      query[key] = val.join(',');
    });

    return query;
  };

  const loadData = async ({
    pagination,
    filters,
    sorter,
  }: {
    pagination: { current: number; pageSize: number };
    filters: Record<string, string[] | null>;
    sorter?: { field: string; order: 'ascend' | 'descend' | null };
  }) => {
    try {
      setLoading(true);
      const res = await voucherService.pagination({
        page: pagination.current,
        limit: pagination.pageSize,
        ...convertFiltersToQuery(filters),
      });

      setVouchers(res.data);
      const { total } = res.meta;
      setPagination((prev) => ({
        ...prev,
        total,
        current: pagination.current,
      }));
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData({ pagination, filters: debouncedFilters });
  }, [pagination.current, pagination.pageSize, debouncedFilters]);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setFilters(filters);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await voucherService.delete(id);
      message.success('Xóa voucher thành công');
      loadData({ pagination, filters: debouncedFilters });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    vouchers,
    loading,
    columns,
    loadData,
    filterFields,
    handleFilterChange,
    setPagination,
    pagination,
  };
};

import { useState } from 'react';
import { App } from 'antd';
import { useEffect } from 'react';
import type { DataTableColumn } from '../../../common/components/data-table/DataTable';
import type { FilterField } from '../../../common/components/filter-panel/FilterPanel';
import { useDebounce } from '../../../common/hooks/useDebounce';
import { auditLogService } from '../../../services/audit-log.service';

export interface Audit {
  _id: string;
  action: string;
  collectionName: string;
  performedBy: string;
  changedFields: Record<string, { old: any; new: any }>;
  createdAt: string;
}

export const useAuditLogTable = () => {
  const [users, setUsers] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });

  const columns: DataTableColumn<Audit>[] = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Collection',
      dataIndex: 'collectionName',
      key: 'collectionName',
    },
    {
      title: 'Thực hiện bởi',
      dataIndex: 'performedBy',
      key: 'performedBy',
    },
    {
      title: 'Thay đổi',
      key: 'changedFields',
      render: (_, record) => {
        const changes = Object.entries(record.changedFields || {});
        return (
          <div>
            {changes.map(([field, { old, new: newVal }]) => (
              <div key={field} style={{ marginBottom: 4 }}>
                <b>{field}</b>:{' '}
                <span style={{ color: 'red' }}>{old ?? '(null)'}</span>
                {' → '}
                <span style={{ color: 'green' }}>{newVal ?? '(null)'}</span>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: 'createdAt',
      label: 'Thời gian',
      type: 'date',
      colSpan: 4,
    },
    {
      name: 'action',
      label: 'Hành động',
      type: 'select',
      colSpan: 4,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
      ],
    },
    {
      name: 'collectionName',
      label: 'Collection',
      type: 'text',
      colSpan: 4,
    },
    {
      name: 'performedBy',
      label: 'Thực hiện bởi',
      type: 'text',
      colSpan: 4,
    },
  ];

  const convertFiltersToQuery = (filters: Record<string, string[] | null>) => {
    const query: Record<string, string> = {};

    Object.entries(filters).forEach(([key, val]) => {
      if (!val || val.length === 0) return; // bỏ qua null hoặc mảng rỗng

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
      const res = await auditLogService.pagination({
        page: pagination.current,
        limit: pagination.pageSize,
        ...convertFiltersToQuery(filters),
      });

      setUsers(res.data);
      const { total } = res.meta;
      setPagination((prev) => ({
        ...prev,
        total,
        current: pagination.current,
      }));
    } catch (err) {
      console.error(err);
      // message.error('Lỗi khi tải lịch sử thay đổi');
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

  return {
    users,
    loading,
    columns,
    loadData,
    filterFields,
    handleFilterChange,
    setPagination,
    pagination,
  };
};

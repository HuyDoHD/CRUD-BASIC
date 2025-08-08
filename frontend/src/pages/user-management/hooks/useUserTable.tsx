import { useState } from 'react';
import { App, Button, Space } from 'antd';
import { useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import type { UserFormData } from '../type';
import { userService } from '../../../services/user.service';
import type { DataTableColumn } from '../../../common/components/data-table/DataTable';
import type { FilterField } from '../../../common/components/filter-panel/FilterPanel';
import { useDebounce } from '../../../common/hooks/useDebounce';
import DeleteConfirmModal from '../../../common/components/delete-confirm-modal/DeleteConfirmModal';

export interface Users {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export const useUserTable = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });

  const columns: DataTableColumn<Users>[] = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filterOptions: ['admin', 'user'],
      render: (_, record) => record.role,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
          >
            <EditOutlined /> Sửa
          </Button>
          <DeleteConfirmModal
            title="Xác nhận xoá"
            content="Bạn có chắc chắn muốn xoá người dùng này? Mọi voucher liên quan sẽ bị xoá"
            onConfirm={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: 'Tên người dùng',
      type: 'text',
      colSpan: 4,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      colSpan: 4,
    },
    {
      name: 'role',
      label: 'Vai trò',
      type: 'select',
      colSpan: 4,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      colSpan: 4,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
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
      const res = await userService.pagination({
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
      // message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData({ pagination, filters: debouncedFilters });
  }, [pagination.current, pagination.pageSize, debouncedFilters]);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleClose = async () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handleEdit = async (user: Users) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await userService.delete(id);
      message.success('Xóa người dùng thành công');
      loadData({ pagination, filters: debouncedFilters });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (data: UserFormData) => {
    if (editingUser) {
      if (!data.newPassword || data.newPassword === '') {
        const { newPassword, ...rest } = data;
        userService.update(editingUser._id, rest);
      } else {
        userService.update(editingUser._id, data);
      }
    } else {
      if (data.password !== data.confirmPassword) {
        message.error('Mật khẩu không khớp');
        return;
      }
      const { confirmPassword: _confirmPassword, ...rest } = data;
      userService.create(rest);
    }
    handleClose();
    loadData({ pagination, filters: debouncedFilters });
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setFilters(filters);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  return {
    users,
    loading,
    columns,
    handleCreate,
    isModalVisible,
    handleClose,
    editingUser,
    handleSubmit,
    loadData,
    filterFields,
    handleFilterChange,
    setPagination,
    pagination,
    handleDelete,
  };
};

import { useRef, useState } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../../services/event.service';
import { App, Button, Space } from 'antd';
import { useEffect } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { voucherService } from '../../../services/voucher.service';
import type { EventFormData } from '../types';
import type { DataTableColumn } from '../../../common/components/data-table/DataTable';
import { convertFiltersToQuery } from '../../../common/components/data-table/utils';
import { useDebounce } from '../../../common/hooks/useDebounce';
import type { FilterField } from '../../../common/components/filter-panel/FilterPanel';
import DeleteConfirmModal from '../../../common/components/delete-confirm-modal/DeleteConfirmModal';

export interface Events {
  _id: string;
  name: string;
  maxQuantity: number;
  issued: number;
}

export const useEventTable = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Events | null>(null);
  const editIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 500);

  const columns: DataTableColumn<Events>[] = [
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
          <Button type="primary" onClick={() => handleIssueVoucher(record._id)}>
            <PlusOutlined /> Lấy voucher
          </Button>
          <Button type="primary" onClick={() => handleEdit(record)}>
            <EditOutlined /> Sửa
          </Button>
          <DeleteConfirmModal
            title="Xác nhận xoá"
            content="Bạn có chắc chắn muốn xoá sự kiện này? Mọi voucher liên quan sẽ bị xoá"
            onConfirm={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: 'Tên sự kiện',
      type: 'text',
    },
    {
      name: 'maxQuantity',
      label: 'Tổng số lượng voucher',
      type: 'number',
    },
  ];

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
      const res = await eventService.pagination({
        page: pagination.current,
        limit: pagination.pageSize,
        ...convertFiltersToQuery(filters),
      });
      setEvents(res.data);
      const { total } = res.meta;
      setPagination((prev) => ({
        ...prev,
        total,
        current: pagination.current,
      }));
    } catch (err) {
      console.error(err);
      // message.error('Lỗi khi tải danh sách sự kiện');
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
      loadData({
        pagination,
        filters: debouncedFilters,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData({
      pagination,
      filters: debouncedFilters,
    });
  }, [pagination.current, pagination.pageSize, debouncedFilters]);

  useEffect(() => {
    return () => {
      if (editIntervalRef.current) {
        clearInterval(editIntervalRef.current);
      }
    };
  }, []);

  const handleCreate = () => {
    setEditingEvent(null);
    setIsModalVisible(true);
  };

  const handleClose = async () => {
    if (editingEvent) {
      await eventService.releaseEdit(editingEvent._id);
    }
    setIsModalVisible(false);
    setEditingEvent(null);
    if (editIntervalRef.current) {
      clearInterval(editIntervalRef.current);
      editIntervalRef.current = null;
    }
  };

  const handleEdit = async (event: Events) => {
    const canEdit = await eventService.requestEdit(event._id);
    if (canEdit) {
      setEditingEvent(event);
      setIsModalVisible(true);

      if (editIntervalRef.current) clearInterval(editIntervalRef.current);

      editIntervalRef.current = setInterval(() => {
        eventService.maintainEdit(event._id);
      }, 180_000);
    }
  };

  const handleDelete = async (id: string) => {
    await eventService.delete(id);
    message.success('Xóa sự kiện thành công');
    loadData({
      pagination,
      filters: debouncedFilters,
    });
  };

  const handleSubmit = (data: EventFormData) => {
    if (editingEvent) {
      eventService.update(editingEvent._id, data);
    } else {
      eventService.create(data);
    }
    handleClose();
    loadData({
      pagination,
      filters: debouncedFilters,
    });
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setFilters(filters);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  return {
    events,
    loading,
    handleLogout,
    columns,
    handleCreate,
    isModalVisible,
    handleClose,
    editingEvent,
    handleSubmit,
    pagination,
    setPagination,
    filterFields,
    handleFilterChange,
  };
};

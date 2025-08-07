import {
  Table,
  Input,
  Button,
  Space,
  Select,
  DatePicker,
  Checkbox,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { useCallback, useRef, useState, type JSX } from 'react';
import type { ColumnType, TablePaginationConfig } from 'antd/es/table';

export type FilterType = 'text' | 'date' | 'select' | 'checkbox';

export interface DataTableColumn<T> {
  title: React.ReactNode | ((props: any) => React.ReactNode);
  dataIndex?: Extract<keyof T, string | number>;
  key: string;
  filterType?: FilterType;
  filterOptions?: any[]; // cho select/checkbox
  render?: (value: any, record: T) => React.ReactNode;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey?: string;
  pagination?: false | TablePaginationConfig;
  onFilterChange?: (filters: Record<string, any[]>) => void;
  onPaginationChange?: (pagination: TablePaginationConfig) => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  rowKey = 'key',
  pagination = { pageSize: 10 },
  onFilterChange,
  onPaginationChange
}: DataTableProps<T>) {
  const [filters, setFilters] = useState<Record<string, any[]>>({});
  const searchInput = useRef<InputRef>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const debouncedFilterChange = useCallback(
    (next: Record<string, any[]>) => {
      setFilters(next);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onFilterChange?.(next);
      }, 500); // debounce 500ms
    },
    [onFilterChange],
  );

  const getColumnSearchProps = (col: DataTableColumn<T>): ColumnType<T> => {
    const { filterType = 'text', filterOptions = [] } = col;
    const dataIndex = col.dataIndex as Extract<keyof T, string>;

    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleSearch = () => {
          confirm();
          debouncedFilterChange({ [dataIndex]: selectedKeys as any[] });
        };

        const handleReset = () => {
          clearFilters?.();
          debouncedFilterChange({ [dataIndex]: [] });
        };

        let inputNode: React.ReactNode;

        switch (filterType) {
          case 'date':
            inputNode = (
              <DatePicker
                onChange={(_date, dateString) => {
                  if (typeof dateString === 'string') {
                    setSelectedKeys(dateString ? [dateString] : []);
                  } else {
                    setSelectedKeys([]);
                  }
                }}
                style={{ width: '100%' }}
              />
            );
            break;

          case 'select':
            inputNode = (
              <Select
                allowClear
                style={{ width: '100%' }}
                options={filterOptions.map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                onChange={(val) => setSelectedKeys(val ? [val] : [])}
              />
            );
            break;

          case 'checkbox':
            inputNode = (
              <Checkbox.Group
                options={filterOptions}
                onChange={(vals) => setSelectedKeys(vals)}
              />
            );
            break;

          default:
            inputNode = (
              <Input
                placeholder={`Tìm theo ${dataIndex}`}
                value={selectedKeys?.[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={handleSearch}
                style={{ width: '100%' }}
              />
            );
        }

        return (
          <div style={{ padding: 8 }}>
            {inputNode}
            <Space style={{ marginTop: 8 }}>
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<SearchOutlined />}
                size="small"
              >
                Tìm
              </Button>
              <Button onClick={handleReset} size="small">
                Xoá
              </Button>
            </Space>
          </div>
        );
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
    };
  };

  const enhancedColumns = columns.map((col) =>
    col.filterType ? { ...col, ...getColumnSearchProps(col) } : col,
  );

  return (
    <Table
      rowKey={rowKey}
      columns={enhancedColumns}
      dataSource={data}
      pagination={{...pagination, showSizeChanger: true}}
      onChange={(pagination) => {
        onPaginationChange?.(pagination);
      }}
    />
  );
}

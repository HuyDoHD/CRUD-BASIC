import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Collapse,
  Row,
  Col,
  InputNumber,
  Checkbox,
} from 'antd';
import type { Rule } from 'antd/es/form';
import dayjs from 'dayjs';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export type FilterField =
  | {
      name: string;
      label: string;
      type: 'text';
      placeholder?: string;
      rules?: Rule[];
      colSpan?: number;
    }
  | {
      name: string;
      label: string;
      type: 'select';
      options: { label: string; value: string }[];
      placeholder?: string;
      rules?: Rule[];
      colSpan?: number;
    }
  | {
      name: string;
      label: string;
      type: 'date';
      placeholder?: string;
      rules?: Rule[];
      colSpan?: number;
    }
  | {
      name: string;
      label: string;
      type: 'number';
      placeholder?: string;
      rules?: Rule[];
      colSpan?: number;
    }
  | {
      name: string;
      label: string;
      type: 'checkbox';
      rules?: Rule[];
      colSpan?: number;
    };

type Props = {
  fields: FilterField[];
  onChange: (filters: Record<string, string[]>) => void;
};

export const FilterPanel = ({ fields, onChange }: Props) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, any>) => {
    const filters: Record<string, string[]> = {};

    for (const [key, val] of Object.entries(values)) {
      if (!val) continue;

      if (dayjs.isDayjs(val)) {
        filters[key] = [val.format('YYYY-MM-DD')];
      } else {
        filters[key] = [val];
      }
    }

    onChange(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onChange({});
  };

  return (
    <Collapse defaultActiveKey={['1']} className="mb-4">
      <Collapse.Panel header="Bộ lọc tìm kiếm" key="1">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            {fields.map((field) => {
              const colSpan = field.colSpan || 8; // mặc định 8/24 = 1/3 cột

              const commonProps = {
                label: field.label,
                name: field.name,
              };

              let inputElement = null;

              switch (field.type) {
                case 'text':
                  inputElement = (
                    <Input
                      placeholder={field.placeholder || `Nhập ${field.label}`}
                    />
                  );
                  break;
                case 'select':
                  inputElement = (
                    <Select
                      placeholder={field.placeholder || `Chọn ${field.label}`}
                      allowClear
                    >
                      {field.options?.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  );
                  break;
                case 'date':
                  inputElement = <DatePicker style={{ width: '100%' }} />;
                  break;
                case 'number':
                  inputElement = <InputNumber style={{ width: '100%' }} />;
                  break;
                case 'checkbox':
                  inputElement = <Checkbox style={{ width: '100%' }} />;
                  break;
                default:
                  return null;
              }

              return (
                <Col xs={24} md={12} lg={colSpan} span={colSpan} key={field.name}>
                  <Form.Item {...commonProps}>{inputElement}</Form.Item>
                </Col>
              );
            })}
            <Col span={4} xs={24} md={12} lg={8} xl={6}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    Tìm kiếm
                  </Button>
                  <Button onClick={handleReset} icon={<ReloadOutlined />}>Đặt lại</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

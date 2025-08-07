import { Modal, Form, Input, InputNumber } from 'antd';
import type { EventFormData } from '../types';
import { useEventForm } from '../hooks/useEventForm';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialValues?: Partial<EventFormData>;
  mode?: 'create' | 'edit';
};

export const EventFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  mode = 'create',
}: Props) => {
  const { form, handleOk, handleCancel } = useEventForm({
    visible,
    onClose,
    onSubmit,
    initialValues,
  });

  return (
    <Modal
      open={visible}
      title={mode === 'create' ? 'Thêm mới sự kiện' : 'Sửa sự kiện'}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={mode === 'create' ? 'Thêm' : 'Cập nhật'}
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên sự kiện"
          rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="maxQuantity"
          label="Số lượng voucher tối đa"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số lượng voucher tối đa!',
            },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

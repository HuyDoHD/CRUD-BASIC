import { Form } from 'antd';
import { useEffect } from 'react';
import type { EventFormData } from '../types';

export const useEventForm = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialValues?: Partial<EventFormData>;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
      });
      form.resetFields();
      onClose();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  const handleCancel = async () => {
    form.resetFields();
    onClose();
  };

  return {
    form,
    handleOk,
    handleCancel,
  };
};

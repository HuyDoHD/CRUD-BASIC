import { Form } from 'antd';
import { useEffect } from 'react';
import type { UserFormData } from '../type';

export const useUserForm = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialValues?: Partial<UserFormData>;
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

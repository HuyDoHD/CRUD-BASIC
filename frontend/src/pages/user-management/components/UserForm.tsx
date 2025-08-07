import { Modal, Form, Input, Select } from 'antd';
import type { UserFormData } from '../type';
import { useUserForm } from '../hooks/useUserForm';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialValues?: Partial<UserFormData>;
  mode?: 'create' | 'edit';
};

export const UserFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  mode = 'create',
}: Props) => {
  const { form, handleOk, handleCancel } = useUserForm({
    visible,
    onClose,
    onSubmit,
    initialValues,
  });

  return (
    <Modal
      open={visible}
      title={mode === 'create' ? 'Thêm mới người dùng' : 'Sửa người dùng'}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={
        <>
          <CheckOutlined />
          {mode === 'create' ? ' Thêm' : ' Cập nhật'}
        </>
      }
      cancelText={
        <>
          <CloseOutlined />
          Hủy
        </>
      }
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên người dùng"
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
        >
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input type="email" placeholder="Nhập email" />
        </Form.Item>

        {mode === 'create' && (
          <>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!', min: 6 },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập xác nhận mật khẩu!',
                  min: 6,
                },
              ]}
            >
              <Input.Password placeholder="Nhập xác nhận mật khẩu" />
            </Form.Item>
          </>
        )}
        {mode === 'edit' && (
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                validator(_, value) {
                  if (!value) return Promise.resolve(); 
                  if (value.length < 6)
                    return Promise.reject('Ít nhất 6 ký tự');
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn vai trò!',
            },
          ]}
        >
          <Select
            placeholder="Chọn vai trò"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

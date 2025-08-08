import type { UserPayload } from '../../../auth/AuthProvider';
import { useEffect, useState } from 'react';
import { authService } from '../../../services/auth.service';
import { Descriptions, Modal } from 'antd';
interface UserInfoModalProps {
  open: boolean;
  onClose: () => void;
  user: UserPayload | null;
}

interface UserInfo {
  email: string;
  name: string;
  role: string;
}

export default function UserInfoModal({
  open,
  onClose,
  user,
}: UserInfoModalProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (open && user) {
      authService
        .getUserInfo(user.sub)
        .then((res) => {
          setUserInfo(res);
        })
        .finally();
    }
  }, [open, user]);

  return (
    <Modal
      title="Thông tin người dùng"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      {user ? (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Email">{userInfo?.email}</Descriptions.Item>
          <Descriptions.Item label="Tên">{userInfo?.name}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{userInfo?.role}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có thông tin người dùng</p>
      )}
    </Modal>
  );
}

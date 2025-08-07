import { Modal, Button } from 'antd';
import { useState } from 'react';

const DeleteConfirmModal = ({
  onConfirm,
  title,
  content,
}: {
  onConfirm: () => void;
  title: string;
  content: string;
}) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);
  const handleOk = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <Button danger onClick={showModal}>
        Xoá
      </Button>

      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xoá"
        cancelText="Huỷ"
      >
        {content}
      </Modal>
    </>
  );
};

export default DeleteConfirmModal;

// src/utils/messageProxy.ts
import type { MessageInstance } from 'antd/es/message/interface';

let message: MessageInstance;

export const setMessageInstance = (msg: MessageInstance) => {
  message = msg;
};

export const getMessageInstance = () => {
  if (!message) {
    throw new Error('Message instance not set. Make sure to call setMessageInstance inside App.useEffect');
  }
  return message;
};

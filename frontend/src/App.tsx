import { AuthProvider } from './auth/AuthProvider';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { App as AntdApp } from 'antd';
import { useEffect } from 'react';
import { setMessageInstance } from './utils/messageProxy';

function App() {
  const { message } = AntdApp.useApp();

  useEffect(() => {
    setMessageInstance(message); // Gán message context vào proxy
  }, [message]);
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

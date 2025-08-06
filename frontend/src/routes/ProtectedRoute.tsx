import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // e.g. ['admin', 'user']
  redirectTo?: string;     // e.g. '/login' or '/unauthorized'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  console.log("user", user)

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Chưa đăng nhập
  if (!user) return <Navigate to={redirectTo} replace />;

  // Có giới hạn quyền
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Được phép truy cập
  return <Outlet />;
};

export default ProtectedRoute;

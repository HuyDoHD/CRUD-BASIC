import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layout/MainLayout';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import EventPage from '../pages/event';
import UserManagementPage from '../pages/user-management';
import VoucherPage from '../pages/voucher';
import AuditLogPage from '../pages/audit-log';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/events" element={<EventPage />} />
          <Route path="/voucher" element={<VoucherPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

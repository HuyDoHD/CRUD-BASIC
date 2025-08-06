import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Event from '../pages/event/components/Event';
import MainLayout from '../layout/MainLayout';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/events" element={<Event />} />
          {/* <Route path="/admin" element={<Admin />} />
          <Route path="/request-voucher" element={<RequestVoucher />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute
 * - 檢查是否已登入
 * - 可選擇限制允許的角色 allowedRoles（陣列）
 * - 用法：
 *   <ProtectedRoute allowedRoles={["admin"]}>
 *     <YourComponent />
 *   </ProtectedRoute>
 * 或作為 Route element：
 *   <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> ... </Route>
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const auth = useSelector((s) => s.auth);
  const isAuthenticated = auth?.isAuthenticated;
  const role = auth?.user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    // 沒有權限，導回首頁（或顯示未授權頁）
    return <Navigate to="/dashboard" replace />;
  }

  // 支援 children 或 Route Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;

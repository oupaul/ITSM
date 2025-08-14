import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Layout Components
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CustomerManagement from './pages/customers/CustomerManagement';
import DeviceManagement from './pages/devices/DeviceManagement';
import InventoryManagement from './pages/inventory/InventoryManagement';
import WarrantyManagement from './pages/warranty/WarrantyManagement';
import MaintenanceSchedule from './pages/maintenance/MaintenanceSchedule';
import ServiceTickets from './pages/tickets/ServiceTickets';
import MobileInventory from './pages/mobile/MobileInventory';
import NotificationCenter from './pages/notifications/NotificationCenter';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import TechnicianManagement from './pages/technicians/TechnicianManagement';
import RoleLogin from './pages/auth/RoleLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import KnowledgeBaseAdmin from './pages/kb/KnowledgeBaseAdmin';
import SelfServicePortal from './pages/portal/SelfServicePortal';
import EmailIngestSimulator from './pages/integrations/EmailIngestSimulator';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<RoleLogin />} />
            
            {/* 受保護的應用程式 */}
            <Route element={<ProtectedRoute />}> 
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* 客戶可見 */}
                <Route path="/customers" element={<ProtectedRoute allowedRoles={["admin","technician"]}><CustomerManagement /></ProtectedRoute>} />
                {/* 工程師/管理員可見 */}
                <Route path="/technicians" element={<ProtectedRoute allowedRoles={["admin"]}><TechnicianManagement /></ProtectedRoute>} />
                <Route path="/devices" element={<DeviceManagement />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/warranty" element={<WarrantyManagement />} />
                <Route path="/maintenance" element={<ProtectedRoute allowedRoles={["admin","technician"]}><MaintenanceSchedule /></ProtectedRoute>} />
                <Route path="/tickets" element={<ProtectedRoute allowedRoles={["admin","technician","customer"]}><ServiceTickets /></ProtectedRoute>} />
                <Route path="/kb" element={<ProtectedRoute allowedRoles={["admin","technician"]}><KnowledgeBaseAdmin /></ProtectedRoute>} />
                <Route path="/portal" element={<ProtectedRoute allowedRoles={["admin","technician","customer"]}><SelfServicePortal /></ProtectedRoute>} />
                <Route path="/email-ingest" element={<ProtectedRoute allowedRoles={["admin","technician","customer"]}><EmailIngestSimulator /></ProtectedRoute>} />
                <Route path="/mobile-inventory" element={<ProtectedRoute allowedRoles={["admin","technician"]}><MobileInventory /></ProtectedRoute>} />
                <Route path="/notifications" element={<NotificationCenter />} />
                <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin"]}><Reports /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin"]}><Settings /></ProtectedRoute>} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

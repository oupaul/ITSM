import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Devices as DevicesIcon,
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Security as WarrantyIcon,
  Build as MaintenanceIcon,
  Assignment as TicketIcon,
  PhoneAndroid as MobileIcon,
  LibraryBooks as KnowledgeIcon,
  Support as PortalIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const allMenuItems = [
  { text: '儀表板', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin','technician','customer'] },
  { text: '客戶管理', icon: <PeopleIcon />, path: '/customers', roles: ['admin','technician'] },
  { text: '工程師管理', icon: <PeopleIcon />, path: '/technicians', roles: ['admin'] },
  { text: '設備與雲端服務管理', icon: <DevicesIcon />, path: '/devices', roles: ['admin','technician','customer'] },
  { text: '盤點管理', icon: <InventoryIcon />, path: '/inventory', roles: ['admin','technician'] },
  { text: '保固管理', icon: <WarrantyIcon />, path: '/warranty', roles: ['admin','technician','customer'] },
  { text: '維護排程', icon: <MaintenanceIcon />, path: '/maintenance', roles: ['admin','technician'] },
  { text: '服務工單', icon: <TicketIcon />, path: '/tickets', roles: ['admin','technician','customer'] },
  { text: '知識庫管理', icon: <KnowledgeIcon />, path: '/kb', roles: ['admin','technician'] },
  { text: '自助服務入口', icon: <PortalIcon />, path: '/portal', roles: ['admin','technician','customer'] },
  { text: '郵件轉單模擬', icon: <EmailIcon />, path: '/email-ingest', roles: ['admin','technician','customer'] },
  { text: '行動盤點', icon: <MobileIcon />, path: '/mobile-inventory', roles: ['admin','technician'] },
  { text: '通知中心', icon: <NotificationsIcon />, path: '/notifications', roles: ['admin','technician','customer'] },
  { text: '報告分析', icon: <AssessmentIcon />, path: '/reports', roles: ['admin'] },
  { text: '系統設定', icon: <SettingsIcon />, path: '/settings', roles: ['admin'] },
];

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const role = useSelector((state) => state.auth?.user?.role);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = allMenuItems.filter(item => !item.roles || item.roles.includes(role || ''));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2 }}>
        <Box
          component="img"
          src="/logo192.png"
          alt="Logo"
          sx={{ height: 40, width: 'auto' }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => {}}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

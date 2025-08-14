import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import Snackbar from '../common/Snackbar';

const Layout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          marginTop: '64px',
          marginLeft: { xs: 0, sm: sidebarOpen ? '240px' : 0 },
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
      <Snackbar />
    </Box>
  );
};

export default Layout;

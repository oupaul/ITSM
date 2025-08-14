import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  Devices as DevicesIcon,
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // 模擬資料
  const stats = [
    {
      title: '總客戶數',
      value: '156',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
    },
    {
      title: '總設備數',
      value: '1,234',
      icon: <DevicesIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#2e7d32',
    },
    {
      title: '進行中盤點',
      value: '12',
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ed6c02',
    },
    {
      title: '未讀通知',
      value: '5',
      icon: <NotificationsIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: '#d32f2f',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        儀表板
      </Typography>
      
      <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
        {stats.map((stat, index) => (
          <Grid key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              最近活動
            </Typography>
            <Typography variant="body2" color="textSecondary">
              系統正在開發中，敬請期待更多功能...
            </Typography>
          </Paper>
        </Grid>
        
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              快速操作
            </Typography>
            <Typography variant="body2" color="textSecondary">
              系統正在開發中，敬請期待更多功能...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

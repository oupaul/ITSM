import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const NotificationCenter = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        通知中心
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          通知中心功能正在開發中，敬請期待...
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotificationCenter;

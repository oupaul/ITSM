import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        系統設定
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          系統設定功能正在開發中，敬請期待...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;

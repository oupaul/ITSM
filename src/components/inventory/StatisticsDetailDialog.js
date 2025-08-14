import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const StatisticsDetailDialog = ({ open, onClose, inventories }) => {
  if (!inventories) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'scheduled': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in_progress': return '進行中';
      case 'scheduled': return '已排程';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'monthly': return '每月';
      case 'quarterly': return '每季';
      case 'annual': return '每年';
      case 'custom': return '自訂';
      default: return type;
    }
  };

  // 計算統計數據
  const totalInventories = inventories.length;
  const completedInventories = inventories.filter(inv => inv.status === 'completed').length;
  const inProgressInventories = inventories.filter(inv => inv.status === 'in_progress').length;
  const scheduledInventories = inventories.filter(inv => inv.status === 'scheduled').length;

  const totalDevices = inventories.reduce((sum, inv) => sum + inv.totalDevices, 0);
  const totalCheckedDevices = inventories.reduce((sum, inv) => sum + inv.checkedDevices, 0);
  const totalNormalDevices = inventories.reduce((sum, inv) => sum + inv.normalDevices, 0);
  const totalAbnormalDevices = inventories.reduce((sum, inv) => sum + inv.abnormalDevices, 0);
  const totalMissingDevices = inventories.reduce((sum, inv) => sum + inv.missingDevices, 0);

  // 按客戶分組統計
  const customerStats = {};
  inventories.forEach(inventory => {
    if (!customerStats[inventory.customerName]) {
      customerStats[inventory.customerName] = {
        totalInventories: 0,
        completedInventories: 0,
        totalDevices: 0,
        normalDevices: 0,
        abnormalDevices: 0,
        missingDevices: 0,
      };
    }
    customerStats[inventory.customerName].totalInventories++;
    if (inventory.status === 'completed') {
      customerStats[inventory.customerName].completedInventories++;
    }
    customerStats[inventory.customerName].totalDevices += inventory.totalDevices;
    customerStats[inventory.customerName].normalDevices += inventory.normalDevices;
    customerStats[inventory.customerName].abnormalDevices += inventory.abnormalDevices;
    customerStats[inventory.customerName].missingDevices += inventory.missingDevices;
  });

  // 按月份統計
  const monthlyStats = {};
  inventories.forEach(inventory => {
    const month = inventory.startDate.substring(0, 7); // YYYY-MM
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        totalInventories: 0,
        completedInventories: 0,
        totalDevices: 0,
      };
    }
    monthlyStats[month].totalInventories++;
    if (inventory.status === 'completed') {
      monthlyStats[month].completedInventories++;
    }
    monthlyStats[month].totalDevices += inventory.totalDevices;
  });

  const overallProgress = totalDevices > 0 ? Math.round((totalCheckedDevices / totalDevices) * 100) : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <AssessmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6">盤點統計詳細報告</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* 總體統計 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>總體統計</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                        <AssessmentIcon />
                      </Avatar>
                      <Typography variant="h4" color="primary.main">
                        {totalInventories}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        總盤點數
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Typography variant="h4" color="success.main">
                        {completedInventories}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        已完成
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                        <WarningIcon />
                      </Avatar>
                      <Typography variant="h4" color="warning.main">
                        {inProgressInventories}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        進行中
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                        <ScheduleIcon />
                      </Avatar>
                      <Typography variant="h4" color="info.main">
                        {scheduledInventories}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        已排程
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 設備統計 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>設備統計</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {totalDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        總設備數
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {totalNormalDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        正常設備
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {totalAbnormalDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        異常設備
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main">
                        {totalMissingDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        遺失設備
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">整體盤點進度</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalCheckedDevices}/{totalDevices} ({overallProgress}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 客戶統計 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>按客戶統計</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>客戶</TableCell>
                        <TableCell align="center">盤點數</TableCell>
                        <TableCell align="center">完成率</TableCell>
                        <TableCell align="center">設備數</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(customerStats).map(([customerName, stats]) => (
                        <TableRow key={customerName}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <BusinessIcon sx={{ mr: 1, fontSize: 16 }} />
                              {customerName}
                            </Box>
                          </TableCell>
                          <TableCell align="center">{stats.totalInventories}</TableCell>
                          <TableCell align="center">
                            {stats.totalInventories > 0 
                              ? Math.round((stats.completedInventories / stats.totalInventories) * 100)
                              : 0}%
                          </TableCell>
                          <TableCell align="center">{stats.totalDevices}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 月度統計 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>按月份統計</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>月份</TableCell>
                        <TableCell align="center">盤點數</TableCell>
                        <TableCell align="center">完成率</TableCell>
                        <TableCell align="center">設備數</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(monthlyStats)
                        .sort(([a], [b]) => b.localeCompare(a)) // 按月份降序排列
                        .map(([month, stats]) => (
                        <TableRow key={month}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                              {month}
                            </Box>
                          </TableCell>
                          <TableCell align="center">{stats.totalInventories}</TableCell>
                          <TableCell align="center">
                            {stats.totalInventories > 0 
                              ? Math.round((stats.completedInventories / stats.totalInventories) * 100)
                              : 0}%
                          </TableCell>
                          <TableCell align="center">{stats.totalDevices}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 最近盤點列表 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>最近盤點列表</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>盤點名稱</TableCell>
                        <TableCell>客戶</TableCell>
                        <TableCell>類型</TableCell>
                        <TableCell>狀態</TableCell>
                        <TableCell align="center">設備數</TableCell>
                        <TableCell align="center">進度</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...inventories]
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) // 按開始日期降序排列
                        .slice(0, 10) // 只顯示最近10筆
                        .map((inventory) => {
                          const progress = inventory.totalDevices > 0 
                            ? Math.round((inventory.checkedDevices / inventory.totalDevices) * 100)
                            : 0;
                          return (
                            <TableRow key={inventory.id}>
                              <TableCell>{inventory.name}</TableCell>
                              <TableCell>{inventory.customerName}</TableCell>
                              <TableCell>
                                <Chip label={getTypeText(inventory.type)} size="small" color="primary" />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusText(inventory.status)}
                                  color={getStatusColor(inventory.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">{inventory.totalDevices}</TableCell>
                              <TableCell align="center">
                                <Box display="flex" alignItems="center">
                                  <Typography variant="body2" sx={{ mr: 1 }}>
                                    {progress}%
                                  </Typography>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={progress}
                                    sx={{ width: 60, height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatisticsDetailDialog;

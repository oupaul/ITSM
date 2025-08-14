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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  DeviceHub as DeviceIcon,
} from '@mui/icons-material';

const InventoryDetailDialog = ({ open, onClose, inventory }) => {
  if (!inventory) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'in_progress': return <ScheduleIcon color="warning" />;
      case 'scheduled': return <ScheduleIcon color="info" />;
      case 'cancelled': return <ErrorIcon color="error" />;
      default: return <ScheduleIcon />;
    }
  };

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

  const getProgressPercentage = () => {
    if (inventory.totalDevices === 0) return 0;
    return Math.round((inventory.checkedDevices / inventory.totalDevices) * 100);
  };

  // 模擬設備詳細列表
  const mockDeviceDetails = [
    { id: 1, name: '伺服器-001', type: 'server', status: 'normal', location: '機房A', ip: '192.168.1.100' },
    { id: 2, name: '工作站-001', type: 'workstation', status: 'normal', location: '辦公室A', ip: '192.168.1.101' },
    { id: 3, name: '印表機-001', type: 'printer', status: 'abnormal', location: '辦公室B', ip: '192.168.1.102' },
    { id: 4, name: '網路設備-001', type: 'network', status: 'normal', location: '機房A', ip: '192.168.1.103' },
    { id: 5, name: '工作站-002', type: 'workstation', status: 'missing', location: '辦公室C', ip: '192.168.1.104' },
  ];

  const getDeviceStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <CheckCircleIcon color="success" />;
      case 'abnormal': return <WarningIcon color="warning" />;
      case 'missing': return <ErrorIcon color="error" />;
      default: return <DeviceIcon />;
    }
  };

  const getDeviceStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success';
      case 'abnormal': return 'warning';
      case 'missing': return 'error';
      default: return 'default';
    }
  };

  const getDeviceStatusText = (status) => {
    switch (status) {
      case 'normal': return '正常';
      case 'abnormal': return '異常';
      case 'missing': return '遺失';
      default: return '未知';
    }
  };

  const getDeviceTypeText = (type) => {
    switch (type) {
      case 'server': return '伺服器';
      case 'workstation': return '工作站';
      case 'printer': return '印表機';
      case 'network': return '網路設備';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <AssessmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6">盤點詳細結果</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* 基本資訊 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>基本資訊</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                        盤點名稱：
                      </Typography>
                      <Typography variant="subtitle1">{inventory.name}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                        客戶：
                      </Typography>
                      <Typography variant="subtitle1">{inventory.customerName}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                        類型：
                      </Typography>
                      <Chip label={getTypeText(inventory.type)} size="small" color="primary" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                        狀態：
                      </Typography>
                      <Chip
                        icon={getStatusIcon(inventory.status)}
                        label={getStatusText(inventory.status)}
                        color={getStatusColor(inventory.status)}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                        執行者：
                      </Typography>
                      <Typography variant="subtitle1">{inventory.executor || '未指派'}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                        執行期間：
                      </Typography>
                      <Typography variant="subtitle1">
                        {inventory.startDate} ~ {inventory.endDate}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 統計概覽 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>統計概覽</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {inventory.totalDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        總設備數
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {inventory.normalDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        正常設備
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {inventory.abnormalDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        異常設備
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main">
                        {inventory.missingDevices}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        遺失設備
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">盤點進度</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {inventory.checkedDevices}/{inventory.totalDevices} ({getProgressPercentage()}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgressPercentage()}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 設備詳細列表 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>設備詳細列表</Typography>
                <List>
                  {mockDeviceDetails.map((device, index) => (
                    <React.Fragment key={device.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getDeviceStatusIcon(device.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="subtitle1">{device.name}</Typography>
                              <Chip
                                label={getDeviceStatusText(device.status)}
                                color={getDeviceStatusColor(device.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                類型: {getDeviceTypeText(device.type)} | 
                                位置: {device.location} | 
                                IP: {device.ip}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < mockDeviceDetails.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* 備註 */}
          {inventory.notes && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>備註</Typography>
                  <Typography variant="body1">{inventory.notes}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDetailDialog;

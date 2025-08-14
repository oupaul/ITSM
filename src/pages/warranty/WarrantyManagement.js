import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Computer as DeviceIcon,
  Email as EmailIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

const WarrantyManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // 讀取登入使用者以套用客戶視圖限制
  const auth = useSelector((s) => s.auth);
  const currentUser = auth?.user;
  const isCustomer = currentUser?.role === 'customer';
  const customerIdOfUser = currentUser?.customerId || currentUser?.id;

  // 模擬設備資料（實際應從 DeviceManagement 的狀態獲取）
  const mockDevices = [
    {
      id: 1,
      name: '主伺服器-01',
      type: 'server',
      model: 'Dell PowerEdge R740',
      customerId: 1,
      customerName: '群兆科技股份有限公司',
      warrantyExpiry: '2025-02-15',
      purchaseDate: '2024-01-15',
      location: '台北市信義區',
      administrator: '張工程師',
    },
    {
      id: 2,
      name: '核心路由器',
      type: 'network',
      model: 'Cisco ISR 4321',
      customerId: 2,
      customerName: '創新軟體有限公司',
      warrantyExpiry: '2025-01-20',
      purchaseDate: '2024-01-20',
      location: '台中市西屯區',
      administrator: '李工程師',
    },
    {
      id: 3,
      name: '工作站-005',
      type: 'computer',
      model: 'HP EliteDesk 800 G9',
      customerId: 1,
      customerName: '群兆科技股份有限公司',
      warrantyExpiry: '2024-12-30',
      purchaseDate: '2023-12-30',
      location: '台北市信義區',
      administrator: '王技術員',
    },
    {
      id: 4,
      name: 'Microsoft 365 商務版',
      type: 'm365',
      model: 'Business Premium',
      customerId: 3,
      customerName: '未來科技公司',
      warrantyExpiry: '2024-12-01',
      purchaseDate: '2023-12-01',
      location: 'N/A',
      administrator: '陳經理',
    },
    {
      id: 5,
      name: '備份儲存設備',
      type: 'storage',
      model: 'Synology DS1821+',
      customerId: 1,
      customerName: '群兆科技股份有限公司',
      warrantyExpiry: '2024-11-15',
      purchaseDate: '2023-02-01',
      location: '台北市信義區',
      administrator: '李工程師',
    },
  ];

  // 保固狀態計算函數
  const getWarrantyStatus = (warrantyExpiry) => {
    if (!warrantyExpiry) return 'unknown';
    
    const today = new Date();
    const expiryDate = new Date(warrantyExpiry);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring_soon';
    if (daysUntilExpiry <= 90) return 'expiring_within_3_months';
    return 'active';
  };

  const getWarrantyStatusText = (status) => {
    switch (status) {
      case 'active': return '有效';
      case 'expiring_within_3_months': return '3個月內到期';
      case 'expiring_soon': return '即將到期';
      case 'expired': return '已過期';
      case 'unknown': return '未知';
      default: return '未知';
    }
  };

  const getWarrantyStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'expiring_within_3_months': return 'warning';
      case 'expiring_soon': return 'error';
      case 'expired': return 'error';
      case 'unknown': return 'default';
      default: return 'default';
    }
  };

  const getWarrantyStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon />;
      case 'expiring_within_3_months': return <WarningIcon />;
      case 'expiring_soon': return <ErrorIcon />;
      case 'expired': return <ErrorIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getDaysRemaining = (warrantyExpiry) => {
    if (!warrantyExpiry) return null;
    
    const today = new Date();
    const expiryDate = new Date(warrantyExpiry);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry;
  };

  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case 'server':
      case 'storage':
      case 'computer':
        return <DeviceIcon />;
      case 'printer':
        return <PrintIcon />;
      case 'm365':
        return <EmailIcon />;
      default:
        return <DeviceIcon />;
    }
  };

  // 依據保固狀態分組設備（先套用客戶視圖限制）
  const groupDevicesByWarrantyStatus = () => {
    const groups = {
      expired: [],
      expiring_soon: [],
      expiring_within_3_months: [],
      active: [],
    };

    const sourceDevices = isCustomer
      ? mockDevices.filter(d => d.customerId === parseInt(customerIdOfUser) || String(d.customerId) === String(customerIdOfUser))
      : mockDevices;

    sourceDevices.forEach(device => {
      const status = getWarrantyStatus(device.warrantyExpiry);
      if (groups[status]) {
        groups[status].push({
          ...device,
          warrantyStatus: status,
          daysRemaining: getDaysRemaining(device.warrantyExpiry),
        });
      }
    });

    // 按剩餘天數排序
    Object.keys(groups).forEach(status => {
      groups[status].sort((a, b) => {
        if (a.daysRemaining === null) return 1;
        if (b.daysRemaining === null) return -1;
        return a.daysRemaining - b.daysRemaining;
      });
    });

    return groups;
  };

  const deviceGroups = groupDevicesByWarrantyStatus();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSendReminder = (device) => {
    dispatch(showSnackbar({ 
      message: `已發送保固到期提醒給 ${device.administrator}`, 
      severity: 'success' 
    }));
  };

  const handleEditDevice = (device) => {
    navigate(`/devices?editDevice=${device.id}`);
  };

  const renderDeviceCard = (device) => (
    <Card key={device.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
            <Box sx={{ mr: 2 }}>
              {getDeviceTypeIcon(device.type)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {device.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {device.model} | {device.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                位置: {device.location} | 負責人: {device.administrator}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Chip
              icon={getWarrantyStatusIcon(device.warrantyStatus)}
              label={getWarrantyStatusText(device.warrantyStatus)}
              color={getWarrantyStatusColor(device.warrantyStatus)}
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              到期日: {device.warrantyExpiry}
            </Typography>
            {device.daysRemaining !== null && (
              <Typography 
                variant="caption" 
                color={device.daysRemaining < 0 ? 'error.main' : 'text.secondary'}
                fontWeight={device.daysRemaining <= 30 ? 'bold' : 'normal'}
              >
                {device.daysRemaining < 0 
                  ? `已過期 ${Math.abs(device.daysRemaining)} 天`
                  : `剩餘 ${device.daysRemaining} 天`
                }
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Tooltip title="發送到期提醒">
            <IconButton 
              size="small" 
              onClick={() => handleSendReminder(device)}
              disabled={device.warrantyStatus === 'active'}
            >
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="編輯設備">
            <IconButton size="small" onClick={() => handleEditDevice(device)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStatisticsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ErrorIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="error.main">
                  {deviceGroups.expired.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  已過期
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ErrorIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="error.main">
                  {deviceGroups.expiring_soon.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30天內到期
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <WarningIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="warning.main">
                  {deviceGroups.expiring_within_3_months.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3個月內到期
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="success.main">
                  {deviceGroups.active.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  保固有效
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">保固管理</Typography>
        <Button
          variant="contained"
          startIcon={<NotificationsIcon />}
          onClick={() => dispatch(showSnackbar({ 
            message: '批量提醒功能開發中', 
            severity: 'info' 
          }))}
        >
          批量發送提醒
        </Button>
      </Box>

      {(deviceGroups.expired.length > 0 || deviceGroups.expiring_soon.length > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>保固到期警告</AlertTitle>
          {deviceGroups.expired.length > 0 && (
            <Typography>有 {deviceGroups.expired.length} 台設備保固已過期，請儘快處理。</Typography>
          )}
          {deviceGroups.expiring_soon.length > 0 && (
            <Typography>有 {deviceGroups.expiring_soon.length} 台設備保固將在30天內到期，請提前準備。</Typography>
          )}
        </Alert>
      )}

      {renderStatisticsCards()}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label={`已過期 (${deviceGroups.expired.length})`} 
            icon={<ErrorIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label={`即將到期 (${deviceGroups.expiring_soon.length})`} 
            icon={<ErrorIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label={`3個月內到期 (${deviceGroups.expiring_within_3_months.length})`} 
            icon={<WarningIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label={`保固有效 (${deviceGroups.active.length})`} 
            icon={<CheckCircleIcon />} 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              已過期設備
            </Typography>
            {deviceGroups.expired.length === 0 ? (
              <Alert severity="success">
                <Typography>目前沒有保固已過期的設備。</Typography>
              </Alert>
            ) : (
              deviceGroups.expired.map(renderDeviceCard)
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              即將到期設備（30天內）
            </Typography>
            {deviceGroups.expiring_soon.length === 0 ? (
              <Alert severity="success">
                <Typography>目前沒有即將到期的設備。</Typography>
              </Alert>
            ) : (
              deviceGroups.expiring_soon.map(renderDeviceCard)
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              3個月內到期設備
            </Typography>
            {deviceGroups.expiring_within_3_months.length === 0 ? (
              <Alert severity="success">
                <Typography>目前沒有3個月內到期的設備。</Typography>
              </Alert>
            ) : (
              deviceGroups.expiring_within_3_months.map(renderDeviceCard)
            )}
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              保固有效設備
            </Typography>
            {deviceGroups.active.length === 0 ? (
              <Alert severity="info">
                <Typography>目前沒有保固有效的設備資料。</Typography>
              </Alert>
            ) : (
              deviceGroups.active.map(renderDeviceCard)
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WarrantyManagement;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Grid,
  Alert,
  AlertTitle,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  LinearProgress,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Build as MaintenanceIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  Router as RouterIcon,
  Print as PrintIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  PlayArrow as ExecuteIcon,
  Assignment as TaskIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import DataTable from '../../components/common/DataTable';
import SearchFilter from '../../components/common/SearchFilter';

const MaintenanceSchedule = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openExecuteDialog, setOpenExecuteDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [executingSchedule, setExecutingSchedule] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    deviceType: 'all',
    frequency: 'all',
  });

  // 維護排程表單資料
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    deviceId: '',
    deviceName: '',
    deviceType: 'server',
    maintenanceType: 'preventive',
    frequency: 'monthly',
    customDays: 30,
    description: '',
    checklistItems: [],
    estimatedDuration: 60,
    assignedTechnician: '',
    isActive: true,
    notes: '',
  });

  // 執行維護表單資料
  const [executeFormData, setExecuteFormData] = useState({
    actualStartTime: '',
    actualEndTime: '',
    result: 'completed',
    findings: '',
    issues: '',
    nextMaintenanceDate: '',
    cost: '',
    notes: '',
    completedItems: [],
  });

  // 模擬客戶資料
  const mockCustomers = [
    { id: 1, name: '群兆科技股份有限公司' },
    { id: 2, name: '創新軟體有限公司' },
    { id: 3, name: '未來科技公司' },
    { id: 4, name: '智慧解決方案股份有限公司' },
  ];

  // 模擬技術員資料
  const mockTechnicians = [
    { id: 1, name: '張工程師' },
    { id: 2, name: '李工程師' },
    { id: 3, name: '王技術員' },
    { id: 4, name: '陳技術員' },
    { id: 5, name: '林工程師' },
    { id: 6, name: '吳工程師' },
    { id: 7, name: '趙工程師' },
    { id: 8, name: '黃工程師' },
  ];

  // 模擬設備資料
  const mockDevices = [
    { id: 1, name: '主伺服器-01', type: 'server', customerId: 1, customerName: '群兆科技股份有限公司' },
    { id: 2, name: '備份儲存設備', type: 'storage', customerId: 1, customerName: '群兆科技股份有限公司' },
    { id: 3, name: '核心路由器', type: 'network', customerId: 2, customerName: '創新軟體有限公司' },
    { id: 4, name: '彩色印表機-01', type: 'printer', customerId: 3, customerName: '未來科技公司' },
    { id: 5, name: '資安防火牆', type: 'security', customerId: 1, customerName: '群兆科技股份有限公司' },
    { id: 6, name: '工作站電腦-A01', type: 'computer', customerId: 2, customerName: '創新軟體有限公司' },
    { id: 7, name: '網路交換器', type: 'network', customerId: 3, customerName: '未來科技公司' },
    { id: 8, name: 'NAS儲存系統', type: 'storage', customerId: 4, customerName: '智慧解決方案股份有限公司' },
  ];

  // 模擬維護排程資料
  const mockSchedules = [
    {
      id: 1,
      deviceId: 1,
      deviceName: '主伺服器-01',
      deviceType: 'server',
      customerName: '群兆科技股份有限公司',
      maintenanceType: 'preventive',
      frequency: 'quarterly',
      customDays: null,
      description: '伺服器系統維護',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      estimatedDuration: 120,
      assignedTechnician: '張工程師',
      status: 'due',
      isActive: true,
      checklistItems: [
        '檢查系統溫度',
        '清理灰塵',
        '更新系統',
        '檢查硬碟狀態',
        '備份資料'
      ],
      completedMaintenances: 3,
      totalMaintenances: 4,
    },
    {
      id: 2,
      deviceId: 2,
      deviceName: '備份儲存設備',
      deviceType: 'storage',
      customerName: '群兆科技股份有限公司',
      maintenanceType: 'preventive',
      frequency: 'monthly',
      customDays: null,
      description: '儲存設備檢查',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-03-01',
      estimatedDuration: 60,
      assignedTechnician: '李工程師',
      status: 'overdue',
      isActive: true,
      checklistItems: [
        '檢查儲存容量',
        '驗證備份完整性',
        '清理暫存檔案',
        '檢查硬碟健康度'
      ],
      completedMaintenances: 11,
      totalMaintenances: 12,
    },
    {
      id: 3,
      deviceId: 3,
      deviceName: '核心路由器',
      deviceType: 'network',
      customerName: '創新軟體有限公司',
      maintenanceType: 'preventive',
      frequency: 'quarterly',
      customDays: null,
      description: '網路設備維護',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20',
      estimatedDuration: 90,
      assignedTechnician: '王技術員',
      status: 'scheduled',
      isActive: true,
      checklistItems: [
        '檢查連線狀態',
        '更新韌體',
        '清理設備',
        '檢查連接埠',
        '測試備援機制'
      ],
      completedMaintenances: 2,
      totalMaintenances: 3,
    },
    {
      id: 4,
      deviceId: 4,
      deviceName: '彩色印表機-01',
      deviceType: 'printer',
      customerName: '未來科技公司',
      maintenanceType: 'preventive',
      frequency: 'monthly',
      customDays: null,
      description: '印表機保養',
      lastMaintenance: '2024-02-15',
      nextMaintenance: '2024-03-15',
      estimatedDuration: 30,
      assignedTechnician: '陳技術員',
      status: 'completed',
      isActive: true,
      checklistItems: [
        '清潔印字頭',
        '更換墨水匣',
        '校正列印品質',
        '清理進紙匣'
      ],
      completedMaintenances: 8,
      totalMaintenances: 8,
    },
  ];

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 客戶和設備選擇狀態
  const [availableCustomers] = useState(mockCustomers);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);

  // 維護狀態相關函數
  const getMaintenanceStatus = (schedule) => {
    const today = new Date();
    const nextDate = new Date(schedule.nextMaintenance);
    const daysUntilMaintenance = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilMaintenance < 0) return 'overdue';
    if (daysUntilMaintenance <= 3) return 'due';
    if (daysUntilMaintenance <= 7) return 'upcoming';
    return 'scheduled';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return '已排程';
      case 'upcoming': return '即將到期';
      case 'due': return '需要維護';
      case 'overdue': return '逾期';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'upcoming': return 'warning';
      case 'due': return 'warning';
      case 'overdue': return 'error';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <ScheduleIcon />;
      case 'upcoming': return <WarningIcon />;
      case 'due': return <ErrorIcon />;
      case 'overdue': return <ErrorIcon />;
      case 'completed': return <CheckCircleIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case 'server': return <ComputerIcon />;
      case 'storage': return <StorageIcon />;
      case 'network': return <RouterIcon />;
      case 'printer': return <PrintIcon />;
      default: return <ComputerIcon />;
    }
  };

  const getDaysUntilMaintenance = (nextMaintenance) => {
    const today = new Date();
    const nextDate = new Date(nextMaintenance);
    return Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    // 模擬載入數據
    setTimeout(() => {
      setSchedules(mockSchedules);
      setAvailableDevices(mockDevices);
      setLoading(false);
    }, 500);
  }, []);

  // 篩選維護排程
  const filteredSchedules = schedules.filter(schedule => {
    const currentStatus = getMaintenanceStatus(schedule);
    const matchesSearch = !filters.search || 
      schedule.deviceName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      schedule.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      schedule.assignedTechnician?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || currentStatus === filters.status;
    const matchesDeviceType = filters.deviceType === 'all' || schedule.deviceType === filters.deviceType;
    const matchesFrequency = filters.frequency === 'all' || schedule.frequency === filters.frequency;
    
    return matchesSearch && matchesStatus && matchesDeviceType && matchesFrequency;
  });



  // 依據狀態分組
  const groupSchedulesByStatus = () => {
    const groups = {
      overdue: [],
      due: [],
      upcoming: [],
      scheduled: [],
      completed: [],
    };

    schedules.forEach(schedule => {
      const status = getMaintenanceStatus(schedule);
      if (groups[status]) {
        groups[status].push(schedule);
      }
    });

    return groups;
  };

  const scheduleGroups = groupSchedulesByStatus();

  // 事件處理函數
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // 處理客戶選擇變化
  const handleCustomerChange = (customerId) => {
    const selectedCustomer = availableCustomers.find(c => c.id === customerId);
    const customerDevices = availableDevices.filter(d => d.customerId === customerId);
    
    setFormData({
      ...formData,
      customerId,
      customerName: selectedCustomer?.name || '',
      deviceId: '',
      deviceName: '',
      deviceType: customerDevices[0]?.type || 'server',
    });
    
    setFilteredDevices(customerDevices);
  };

  // 處理設備選擇變化
  const handleDeviceChange = (deviceId) => {
    const selectedDevice = filteredDevices.find(d => d.id === deviceId);
    
    setFormData({
      ...formData,
      deviceId,
      deviceName: selectedDevice?.name || '',
      deviceType: selectedDevice?.type || 'server',
    });
  };

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      const device = availableDevices.find(d => d.id === schedule.deviceId);
      const customerDevices = availableDevices.filter(d => d.customerId === device?.customerId);
      
      setFormData({
        customerId: device?.customerId || '',
        customerName: schedule.customerName,
        deviceId: schedule.deviceId,
        deviceName: schedule.deviceName,
        deviceType: schedule.deviceType,
        maintenanceType: schedule.maintenanceType,
        frequency: schedule.frequency,
        customDays: schedule.customDays || 30,
        description: schedule.description,
        checklistItems: schedule.checklistItems,
        estimatedDuration: schedule.estimatedDuration,
        assignedTechnician: schedule.assignedTechnician,
        isActive: schedule.isActive,
        notes: schedule.notes || '',
      });
      
      setFilteredDevices(customerDevices);
    } else {
      setEditingSchedule(null);
      setFormData({
        customerId: '',
        customerName: '',
        deviceId: '',
        deviceName: '',
        deviceType: 'server',
        maintenanceType: 'preventive',
        frequency: 'monthly',
        customDays: 30,
        description: '',
        checklistItems: [],
        estimatedDuration: 60,
        assignedTechnician: '',
        isActive: true,
        notes: '',
      });
      
      setFilteredDevices([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleExecuteMaintenance = (schedule) => {
    setExecutingSchedule(schedule);
    setExecuteFormData({
      actualStartTime: new Date().toISOString().slice(0, 16),
      actualEndTime: '',
      result: 'completed',
      findings: '',
      issues: '',
      nextMaintenanceDate: '',
      cost: '',
      notes: '',
      completedItems: [],
    });
    setOpenExecuteDialog(true);
  };

  const handleCloseExecuteDialog = () => {
    setOpenExecuteDialog(false);
    setExecutingSchedule(null);
  };

  const handleSubmit = () => {
    // 驗證必要欄位
    if (!formData.customerId || !formData.deviceId || !formData.description || !formData.assignedTechnician) {
      dispatch(showSnackbar({ 
        message: '請填寫所有必要欄位（客戶、設備、維護描述、負責技術員）', 
        severity: 'error' 
      }));
      return;
    }

    // 實際應該調用 API
    if (editingSchedule) {
      // 更新維護排程
      const updatedSchedules = schedules.map(schedule =>
        schedule.id === editingSchedule.id
          ? { ...schedule, ...formData }
          : schedule
      );
      setSchedules(updatedSchedules);
      dispatch(showSnackbar({ message: '維護排程更新成功', severity: 'success' }));
    } else {
      // 新增維護排程
      const selectedDevice = availableDevices.find(d => d.id === formData.deviceId);
      const newSchedule = {
        id: schedules.length + 1,
        deviceId: formData.deviceId,
        deviceName: formData.deviceName || selectedDevice?.name,
        deviceType: formData.deviceType || selectedDevice?.type,
        customerName: formData.customerName || selectedDevice?.customerName,
        maintenanceType: formData.maintenanceType,
        frequency: formData.frequency,
        customDays: formData.customDays,
        description: formData.description,
        checklistItems: formData.checklistItems || [],
        estimatedDuration: formData.estimatedDuration,
        assignedTechnician: formData.assignedTechnician,
        isActive: formData.isActive,
        notes: formData.notes,
        lastMaintenance: null,
        nextMaintenance: calculateNextMaintenance(formData.frequency, formData.customDays),
        status: 'scheduled',
        completedMaintenances: 0,
        totalMaintenances: 0,
      };
      
      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      
      dispatch(showSnackbar({ message: '維護排程建立成功', severity: 'success' }));
    }
    handleCloseDialog();
  };

  const handleExecuteSubmit = () => {
    // 實際應該調用 API
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === executingSchedule.id
        ? {
            ...schedule,
            lastMaintenance: executeFormData.actualStartTime.split('T')[0],
            nextMaintenance: executeFormData.nextMaintenanceDate,
            status: 'completed',
            completedMaintenances: schedule.completedMaintenances + 1,
            totalMaintenances: schedule.totalMaintenances + 1,
          }
        : schedule
    );
    setSchedules(updatedSchedules);
    dispatch(showSnackbar({ message: '維護執行記錄已保存', severity: 'success' }));
    handleCloseExecuteDialog();
  };

  const calculateNextMaintenance = (frequency, customDays) => {
    const today = new Date();
    let nextDate = new Date(today);
    
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(today.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(today.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(today.getMonth() + 3);
        break;
      case 'annual':
        nextDate.setFullYear(today.getFullYear() + 1);
        break;
      case 'custom':
        nextDate.setDate(today.getDate() + (customDays || 30));
        break;
      default:
        nextDate.setMonth(today.getMonth() + 1);
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  const handleDelete = (scheduleId) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleId);
    setSchedules(updatedSchedules);
    dispatch(showSnackbar({ message: '維護排程刪除成功', severity: 'success' }));
  };

  // 篩選選項
  const filterOptions = [
    {
      field: 'status',
      label: '狀態',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部狀態' },
        { value: 'overdue', label: '逾期' },
        { value: 'due', label: '需要維護' },
        { value: 'upcoming', label: '即將到期' },
        { value: 'scheduled', label: '已排程' },
        { value: 'completed', label: '已完成' },
      ],
    },
    {
      field: 'deviceType',
      label: '設備類型',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部類型' },
        { value: 'server', label: '伺服器' },
        { value: 'storage', label: '儲存設備' },
        { value: 'network', label: '網路設備' },
        { value: 'printer', label: '列印設備' },
      ],
    },
    {
      field: 'frequency',
      label: '維護頻率',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部頻率' },
        { value: 'weekly', label: '每週' },
        { value: 'monthly', label: '每月' },
        { value: 'quarterly', label: '每季' },
        { value: 'annual', label: '每年' },
        { value: 'custom', label: '自訂' },
      ],
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">維護排程管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          新增維護排程
        </Button>
      </Box>

      {/* 警告提示 */}
      {(scheduleGroups.overdue.length > 0 || scheduleGroups.due.length > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>維護提醒</AlertTitle>
          {scheduleGroups.overdue.length > 0 && (
            <Typography>有 {scheduleGroups.overdue.length} 個維護項目已逾期，請儘快處理。</Typography>
          )}
          {scheduleGroups.due.length > 0 && (
            <Typography>有 {scheduleGroups.due.length} 個維護項目需要執行。</Typography>
          )}
        </Alert>
      )}

      {/* 統計卡片 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 3 
      }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ErrorIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="error.main">
                  {scheduleGroups.overdue.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  逾期維護
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <WarningIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="warning.main">
                  {scheduleGroups.due.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  需要維護
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ScheduleIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="info.main">
                  {scheduleGroups.upcoming.length + scheduleGroups.scheduled.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  已排程
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="success.main">
                  {schedules.reduce((total, schedule) => total + schedule.completedMaintenances, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  已完成維護
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 標籤頁 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label="維護排程列表" 
            icon={<ScheduleIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="維護歷史" 
            icon={<HistoryIcon />} 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      {/* 維護排程列表 */}
      {activeTab === 0 && (
        <Box>
          <SearchFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            searchPlaceholder="搜尋設備名稱、描述、技術員..."
            filterOptions={filterOptions}
          />

          <DataTable
            columns={[
              {
                field: 'device',
                header: '設備資訊',
                render: (value, row) => (
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getDeviceTypeIcon(row.deviceType)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{row.deviceName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.customerName}
                      </Typography>
                    </Box>
                  </Box>
                ),
              },
              {
                field: 'description',
                header: '維護項目',
                render: (value, row) => (
                  <Box>
                    <Typography variant="body2">{value}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      頻率: {row.frequency === 'monthly' ? '每月' : 
                             row.frequency === 'quarterly' ? '每季' : 
                             row.frequency === 'annual' ? '每年' : 
                             row.frequency === 'weekly' ? '每週' : '自訂'}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: 'status',
                header: '狀態',
                render: (value, row) => {
                  const currentStatus = getMaintenanceStatus(row);
                  return (
                    <Chip
                      icon={getStatusIcon(currentStatus)}
                      label={getStatusText(currentStatus)}
                      color={getStatusColor(currentStatus)}
                      size="small"
                    />
                  );
                },
              },
              {
                field: 'nextMaintenance',
                header: '下次維護',
                render: (value, row) => {
                  const days = getDaysUntilMaintenance(value);
                  return (
                    <Box>
                      <Typography variant="body2">{value}</Typography>
                      <Typography 
                        variant="caption" 
                        color={days < 0 ? 'error.main' : days <= 3 ? 'warning.main' : 'text.secondary'}
                      >
                        {days < 0 ? `逾期 ${Math.abs(days)} 天` : `剩餘 ${days} 天`}
                      </Typography>
                    </Box>
                  );
                },
              },
              {
                field: 'assignedTechnician',
                header: '負責技術員',
              },
              {
                field: 'progress',
                header: '完成進度',
                render: (value, row) => {
                  const percentage = row.totalMaintenances > 0 
                    ? Math.round((row.completedMaintenances / row.totalMaintenances) * 100)
                    : 0;
                  return (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption">
                          {row.completedMaintenances}/{row.totalMaintenances}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  );
                },
              },
            ]}
            data={filteredSchedules}
            loading={loading}
            emptyMessage="沒有找到維護排程資料"
            actions={(row) => (
              <Box>
                {(getMaintenanceStatus(row) === 'due' || getMaintenanceStatus(row) === 'overdue') && (
                  <Tooltip title="執行維護">
                    <IconButton
                      size="small"
                      onClick={() => handleExecuteMaintenance(row)}
                      color="success"
                    >
                      <ExecuteIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="編輯排程">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(row)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="刪除排程">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(row.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </Box>
      )}

      {/* 維護歷史標籤頁 */}
      {activeTab === 1 && (
        <Box>
          <Alert severity="info">
            <Typography>維護歷史功能開發中，敬請期待。</Typography>
          </Alert>
        </Box>
      )}

      {/* 新增/編輯維護排程對話框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchedule ? '編輯維護排程' : '新增維護排程'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            mt: 1, 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 2 
          }}>
            <FormControl fullWidth>
              <InputLabel>選擇客戶</InputLabel>
              <Select
                value={formData.customerId}
                label="選擇客戶"
                onChange={(e) => handleCustomerChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>請選擇客戶</em>
                </MenuItem>
                {availableCustomers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!formData.customerId}>
              <InputLabel>選擇設備</InputLabel>
              <Select
                value={formData.deviceId}
                label="選擇設備"
                onChange={(e) => handleDeviceChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>請選擇設備</em>
                </MenuItem>
                {filteredDevices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name} ({device.type === 'server' ? '伺服器' : 
                                  device.type === 'storage' ? '儲存設備' : 
                                  device.type === 'network' ? '網路設備' :
                                  device.type === 'printer' ? '列印設備' :
                                  device.type === 'computer' ? '電腦' :
                                  device.type === 'security' ? '資安設備' : device.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                label="維護描述"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>維護頻率</InputLabel>
              <Select
                value={formData.frequency}
                label="維護頻率"
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <MenuItem value="weekly">每週</MenuItem>
                <MenuItem value="monthly">每月</MenuItem>
                <MenuItem value="quarterly">每季</MenuItem>
                <MenuItem value="annual">每年</MenuItem>
                <MenuItem value="custom">自訂</MenuItem>
              </Select>
            </FormControl>
            {formData.frequency === 'custom' && (
              <TextField
                fullWidth
                type="number"
                label="自訂天數"
                value={formData.customDays}
                onChange={(e) => setFormData({ ...formData, customDays: parseInt(e.target.value) })}
              />
            )}
            <TextField
              fullWidth
              type="number"
              label="預估時間（分鐘）"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
            />
            <FormControl fullWidth>
              <InputLabel>負責技術員</InputLabel>
              <Select
                value={formData.assignedTechnician}
                label="負責技術員"
                onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
              >
                <MenuItem value="">
                  <em>請選擇技術員</em>
                </MenuItem>
                {mockTechnicians.map((technician) => (
                  <MenuItem key={technician.id} value={technician.name}>
                    {technician.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="啟用此維護排程"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSchedule ? '更新' : '建立'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 執行維護對話框 */}
      <Dialog open={openExecuteDialog} onClose={handleCloseExecuteDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          執行維護：{executingSchedule?.deviceName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            mt: 1, 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 2 
          }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="開始時間"
              value={executeFormData.actualStartTime}
              onChange={(e) => setExecuteFormData({ ...executeFormData, actualStartTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="結束時間"
              value={executeFormData.actualEndTime}
              onChange={(e) => setExecuteFormData({ ...executeFormData, actualEndTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>維護結果</InputLabel>
              <Select
                value={executeFormData.result}
                label="維護結果"
                onChange={(e) => setExecuteFormData({ ...executeFormData, result: e.target.value })}
              >
                <MenuItem value="completed">完成</MenuItem>
                <MenuItem value="partial">部分完成</MenuItem>
                <MenuItem value="failed">失敗</MenuItem>
                <MenuItem value="postponed">延期</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="下次維護日期"
              value={executeFormData.nextMaintenanceDate}
              onChange={(e) => setExecuteFormData({ ...executeFormData, nextMaintenanceDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                label="維護發現"
                value={executeFormData.findings}
                onChange={(e) => setExecuteFormData({ ...executeFormData, findings: e.target.value })}
                multiline
                rows={3}
                placeholder="記錄維護過程中的發現..."
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                label="問題與處理"
                value={executeFormData.issues}
                onChange={(e) => setExecuteFormData({ ...executeFormData, issues: e.target.value })}
                multiline
                rows={3}
                placeholder="記錄遇到的問題和處理方式..."
              />
            </Box>
            <TextField
              fullWidth
              type="number"
              label="維護成本"
              value={executeFormData.cost}
              onChange={(e) => setExecuteFormData({ ...executeFormData, cost: e.target.value })}
              InputProps={{ startAdornment: '$' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExecuteDialog}>取消</Button>
          <Button onClick={handleExecuteSubmit} variant="contained">
            保存維護記錄
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceSchedule;

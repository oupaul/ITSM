import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
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
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as ExecuteIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Devices as DevicesIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInventories, 
  createInventory, 
  updateInventory, 
  deleteInventory, 
  executeInventory,
  fetchInventoryCycles,
  updateInventoryCycle,
  createInventoryCycle,
  setFilters,
  resetFilters,
  deleteInventoryCycle,
} from '../../store/slices/inventorySlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import DataTable from '../../components/common/DataTable';
import SearchFilter from '../../components/common/SearchFilter';
import FormDialog from '../../components/common/FormDialog';
import InventoryDetailDialog from '../../components/inventory/InventoryDetailDialog';
import StatisticsDetailDialog from '../../components/inventory/StatisticsDetailDialog';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { inventories, inventoryCycles, loading, filters, pagination } = useSelector((state) => state.inventory);
  
  // 確保所有物件都有預設值
  const safeInventories = inventories || [];
  const safeInventoryCycles = inventoryCycles || [];
  const safeFilters = filters || {
    search: '',
    status: 'all',
    customerId: 'all',
    type: 'all',
    page: 1,
    limit: 10,
  };
  const safePagination = pagination || { total: 0, page: 1, limit: 10 };

  const [openDialog, setOpenDialog] = useState(false);
  const [openCycleDialog, setOpenCycleDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatisticsDialog, setOpenStatisticsDialog] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [editingCycle, setEditingCycle] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: 'quarterly',
    customerId: '',
    startDate: '',
    endDate: '',
    executor: '',
    notes: '',
  });
  const [cycleFormData, setCycleFormData] = useState({
    customerId: '',
    deviceType: 'all',
    cycleType: 'quarterly',
    cycleDays: 90,
    reminderDays: 7,
    isActive: true,
  });
  const [customers, setCustomers] = useState([]);

  // 模擬客戶資料
  const mockCustomers = [
    { id: 1, name: '群兆科技股份有限公司' },
    { id: 2, name: '創新軟體有限公司' },
    { id: 3, name: '未來科技公司' },
  ];

  useEffect(() => {
    setCustomers(mockCustomers);
    dispatch(fetchInventories(safeFilters));
    dispatch(fetchInventoryCycles());
  }, [dispatch]); // 移除 safeFilters 依賴，避免無限循環

  // 當篩選變更時重新獲取資料
  useEffect(() => {
    if (safeFilters) {
      dispatch(fetchInventories(safeFilters));
    }
  }, [dispatch, safeFilters.search, safeFilters.status, safeFilters.customerId, safeFilters.type, safeFilters.page, safeFilters.limit]);

  // 處理標籤切換
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 處理新增/編輯盤點對話框
  const handleOpenDialog = (inventory = null) => {
    if (inventory) {
      setEditingInventory(inventory);
      setFormData({
        name: inventory.name,
        type: inventory.type,
        customerId: inventory.customerId.toString(),
        startDate: inventory.startDate,
        endDate: inventory.endDate,
        executor: inventory.executor,
        notes: inventory.notes,
      });
    } else {
      setEditingInventory(null);
      setFormData({
        name: '',
        type: 'quarterly',
        customerId: '',
        startDate: '',
        endDate: '',
        executor: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInventory(null);
  };

  // 處理盤點週期設定對話框
  const handleOpenCycleDialog = (cycle = null) => {
    if (cycle) {
      setEditingCycle(cycle);
      setCycleFormData({
        customerId: cycle.customerId.toString(),
        deviceType: cycle.deviceType,
        cycleType: cycle.cycleType,
        cycleDays: cycle.cycleDays,
        reminderDays: cycle.reminderDays,
        isActive: cycle.isActive,
      });
    } else {
      setEditingCycle(null);
      setCycleFormData({
        customerId: '',
        deviceType: 'all',
        cycleType: 'quarterly',
        cycleDays: 90,
        reminderDays: 7,
        isActive: true,
      });
    }
    setOpenCycleDialog(true);
  };

  const handleCloseCycleDialog = () => {
    setOpenCycleDialog(false);
    setEditingCycle(null);
  };

  // 提交盤點表單
  const handleSubmit = async () => {
    try {
      if (editingInventory) {
        await dispatch(updateInventory({ id: editingInventory.id, data: formData })).unwrap();
        dispatch(showSnackbar({ message: '盤點更新成功', severity: 'success' }));
      } else {
        await dispatch(createInventory(formData)).unwrap();
        dispatch(showSnackbar({ message: '盤點建立成功', severity: 'success' }));
      }
      handleCloseDialog();
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || '操作失敗';
      dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
    }
  };

  // 提交盤點週期表單
  const handleCycleSubmit = async () => {
    try {
      console.log('提交週期設定表單:', cycleFormData);
      
      if (editingCycle) {
        console.log('更新週期設定:', editingCycle.id, cycleFormData);
        await dispatch(updateInventoryCycle({ id: editingCycle.id, data: cycleFormData })).unwrap();
        dispatch(showSnackbar({ message: '盤點週期更新成功', severity: 'success' }));
      } else {
        console.log('新增週期設定:', cycleFormData);
        await dispatch(createInventoryCycle(cycleFormData)).unwrap();
        dispatch(showSnackbar({ message: '盤點週期建立成功', severity: 'success' }));
      }
      handleCloseCycleDialog();
    } catch (error) {
      console.error('週期設定操作失敗:', error);
      const errorMessage = error?.message || error?.toString() || '操作失敗';
      dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
    }
  };

  // 刪除盤點
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此盤點嗎？')) {
      try {
        await dispatch(deleteInventory(id)).unwrap();
        dispatch(showSnackbar({ message: '盤點刪除成功', severity: 'success' }));
      } catch (error) {
        const errorMessage = error?.message || error?.toString() || '刪除失敗';
        dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
      }
    }
  };

  // 執行盤點
  const handleExecute = async (id) => {
    if (window.confirm('確定要執行此盤點嗎？')) {
      try {
        await dispatch(executeInventory(id)).unwrap();
        dispatch(showSnackbar({ message: '盤點執行成功', severity: 'success' }));
      } catch (error) {
        const errorMessage = error?.message || error?.toString() || '執行失敗';
        dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
      }
    }
  };

  // 刪除週期設定
  const handleDeleteCycle = async (id) => {
    if (window.confirm('確定要刪除此週期設定嗎？')) {
      try {
        await dispatch(deleteInventoryCycle(id)).unwrap();
        dispatch(showSnackbar({ message: '週期設定刪除成功', severity: 'success' }));
      } catch (error) {
        const errorMessage = error?.message || error?.toString() || '刪除失敗';
        dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
      }
    }
  };

  // 查看盤點詳細結果
  const handleViewDetail = (inventory) => {
    setSelectedInventory(inventory);
    setOpenDetailDialog(true);
  };

  // 查看統計詳情
  const handleViewStatistics = () => {
    setOpenStatisticsDialog(true);
  };

  // 篩選處理
  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // 分頁處理
  const handlePageChange = (event, newPage) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    dispatch(setFilters({ 
      limit: parseInt(event.target.value, 10), 
      page: 1 
    }));
  };

  // 獲取狀態顏色和文字
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'scheduled': return 'info';
      case 'cancelled': return 'error';
      default: return 'primary';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'in_progress': return <PendingIcon />;
      case 'scheduled': return <ScheduleIcon />;
      case 'cancelled': return <ErrorIcon />;
      default: return <WarningIcon />;
    }
  };

  // 獲取類型文字
  const getTypeText = (type) => {
    switch (type) {
      case 'quarterly': return '季度';
      case 'monthly': return '月度';
      case 'annual': return '年度';
      case 'custom': return '自訂';
      default: return '其他';
    }
  };

  // 計算進度百分比
  const getProgressPercentage = (inventory) => {
    if (!inventory || inventory.totalDevices === 0) return 0;
    const percentage = Math.round((inventory.checkedDevices / inventory.totalDevices) * 100);
    return isNaN(percentage) ? 0 : percentage;
  };

  // 表格欄位定義
  const columns = [
    {
      field: 'name',
      header: '盤點名稱',
      render: (value, row) => {
        try {
          const name = value || '';
          const customerName = row.customerName || '';
          
          return (
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <AssessmentIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {customerName}
                </Typography>
              </Box>
            </Box>
          );
        } catch (error) {
          console.error('Error rendering name:', error, { value, row });
          return <Typography color="error">載入錯誤</Typography>;
        }
      },
    },
    {
      field: 'type',
      header: '類型',
      render: (value) => {
        try {
          const typeText = getTypeText(value);
          
          return (
            <Chip
              label={typeText}
              size="small"
              variant="outlined"
              color="primary"
            />
          );
        } catch (error) {
          console.error('Error rendering type:', error, { value });
          return (
            <Chip
              label="未知"
              size="small"
              variant="outlined"
              color="default"
            />
          );
        }
      },
    },
    {
      field: 'status',
      header: '狀態',
      render: (value) => {
        try {
          const icon = getStatusIcon(value);
          const text = getStatusText(value);
          const color = getStatusColor(value);
          
          return (
            <Chip
              icon={icon}
              label={text}
              color={color}
              size="small"
            />
          );
        } catch (error) {
          console.error('Error rendering status:', error, { value });
          return (
            <Chip
              label="未知"
              color="default"
              size="small"
            />
          );
        }
      },
    },
    {
      field: 'progress',
      header: '進度',
      render: (value, row) => {
        try {
          const percentage = getProgressPercentage(row);
          const checkedDevices = row.checkedDevices || 0;
          const totalDevices = row.totalDevices || 0;
          
          return (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption">
                  {checkedDevices}/{totalDevices}
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
        } catch (error) {
          console.error('Error rendering progress:', error, { row });
          return <Typography color="error">載入錯誤</Typography>;
        }
      },
    },
    {
      field: 'dateRange',
      header: '執行期間',
      render: (value, row) => {
        try {
          const startDate = row.startDate || '';
          const endDate = row.endDate || '';
          const completedAt = row.completedAt || '';
          
          return (
            <Box>
              <Typography variant="body2">
                {startDate} ~ {endDate}
              </Typography>
              {completedAt && (
                <Typography variant="caption" color="text.secondary">
                  完成: {completedAt}
                </Typography>
              )}
            </Box>
          );
        } catch (error) {
          console.error('Error rendering dateRange:', error, { row });
          return <Typography color="error">載入錯誤</Typography>;
        }
      },
    },
    {
      field: 'executor',
      header: '執行者',
      render: (value) => {
        try {
          const executor = value || '未指派';
          return executor;
        } catch (error) {
          console.error('Error rendering executor:', error, { value });
          return '載入錯誤';
        }
      },
    },
    {
      field: 'results',
      header: '結果統計',
      render: (value, row) => {
        try {
          const normalDevices = row.normalDevices || 0;
          const abnormalDevices = row.abnormalDevices || 0;
          const missingDevices = row.missingDevices || 0;
          
          return (
            <Box>
              <Typography variant="caption" display="block">
                正常: {normalDevices}
              </Typography>
              <Typography variant="caption" display="block" color="warning.main">
                異常: {abnormalDevices}
              </Typography>
              <Typography variant="caption" display="block" color="error.main">
                遺失: {missingDevices}
              </Typography>
              {row.status === 'completed' && (
                <Button
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewDetail(row)}
                  sx={{ mt: 1 }}
                >
                  查看詳細
                </Button>
              )}
            </Box>
          );
        } catch (error) {
          console.error('Error rendering results:', error, { row });
          return <Typography color="error">載入錯誤</Typography>;
        }
      },
    },
  ];

  // 篩選選項
  const filterOptions = [
    {
      field: 'status',
      label: '狀態',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部狀態' },
        { value: 'scheduled', label: '已排程' },
        { value: 'in_progress', label: '進行中' },
        { value: 'completed', label: '已完成' },
        { value: 'cancelled', label: '已取消' },
      ],
    },
    {
      field: 'type',
      label: '類型',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部類型' },
        { value: 'quarterly', label: '季度' },
        { value: 'monthly', label: '月度' },
        { value: 'annual', label: '年度' },
        { value: 'custom', label: '自訂' },
      ],
    },
    {
      field: 'customerId',
      label: '客戶',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部客戶' },
        ...customers.map(customer => ({
          value: customer.id.toString(),
          label: customer.name,
        })),
      ],
    },
  ];

  // 表單欄位定義
  const formFields = [
    { name: 'name', label: '盤點名稱', required: true, width: 12 },
    {
      name: 'type',
      label: '盤點類型',
      type: 'select',
      required: true,
      width: 6,
      options: [
        { value: 'quarterly', label: '季度盤點' },
        { value: 'monthly', label: '月度盤點' },
        { value: 'annual', label: '年度盤點' },
        { value: 'custom', label: '自訂盤點' },
      ],
    },
    {
      name: 'customerId',
      label: '客戶',
      type: 'select',
      required: true,
      width: 6,
      options: customers.map(customer => ({
        value: customer.id.toString(),
        label: customer.name,
      })),
    },
    { name: 'startDate', label: '開始日期', type: 'date', required: true, width: 6 },
    { name: 'endDate', label: '結束日期', type: 'date', required: true, width: 6 },
    { name: 'executor', label: '執行者', width: 6 },
    { name: 'notes', label: '備註', multiline: true, rows: 3, width: 12 },
  ];

  // 盤點週期表單欄位
  const cycleFormFields = [
    {
      name: 'customerId',
      label: '客戶',
      type: 'select',
      required: true,
      width: 6,
      options: customers.map(customer => ({
        value: customer.id.toString(),
        label: customer.name,
      })),
    },
    {
      name: 'deviceType',
      label: '設備類型',
      type: 'select',
      required: true,
      width: 6,
      options: [
        { value: 'all', label: '全部設備' },
        { value: 'hardware', label: '硬體設備' },
        { value: 'cloud_service', label: '雲端服務' },
        { value: 'software', label: '軟體資產' },
      ],
    },
    {
      name: 'cycleType',
      label: '週期類型',
      type: 'select',
      required: true,
      width: 6,
      options: [
        { value: 'monthly', label: '每月' },
        { value: 'quarterly', label: '每季' },
        { value: 'annual', label: '每年' },
        { value: 'custom', label: '自訂天數' },
      ],
    },
    { name: 'cycleDays', label: '週期天數', type: 'number', required: true, width: 6 },
    { name: 'reminderDays', label: '提醒天數', type: 'number', required: true, width: 6 },
    {
      name: 'isActive',
      label: '啟用',
      type: 'switch',
      width: 6,
    },
  ];

  // 操作按鈕
  const renderActions = (row) => {
    try {
      if (!row) {
        console.error('renderActions: row is undefined or null');
        return <Box>錯誤</Box>;
      }
      
      const rowId = row.id || '';
      const rowStatus = row.status || '';
      
      if (!rowId) {
        console.error('renderActions: row.id is undefined or null');
        return <Box>ID錯誤</Box>;
      }
      
      return (
        <Box>
          {rowStatus === 'scheduled' && (
            <IconButton
              size="small"
              onClick={() => handleExecute(rowId)}
              color="success"
              title="執行盤點"
            >
              <ExecuteIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(row)}
            color="primary"
            title="編輯盤點"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(rowId)}
            color="error"
            title="刪除盤點"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    } catch (error) {
      console.error('Error in renderActions:', error, { row });
      return <Box>載入錯誤</Box>;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">盤點管理</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => handleOpenCycleDialog()}
            sx={{ mr: 2 }}
          >
            週期設定
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            新增盤點
          </Button>
        </Box>
      </Box>

      {/* 標籤頁 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="盤點列表" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="週期設定" icon={<ScheduleIcon />} iconPosition="start" />
          <Tab label="統計概覽" icon={<DevicesIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* 盤點列表標籤頁 */}
      {activeTab === 0 && (
        <>
          <SearchFilter
            filters={safeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            searchPlaceholder="搜尋盤點名稱、客戶、執行者..."
            filterOptions={filterOptions}
          />

          <DataTable
            columns={columns}
            data={safeInventories}
            loading={loading}
            emptyMessage="沒有找到盤點資料"
            page={safeFilters.page - 1}
            rowsPerPage={safeFilters.limit}
            totalCount={safePagination.total}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            actions={renderActions}
          />
        </>
      )}

      {/* 週期設定標籤頁 */}
      {activeTab === 1 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">盤點週期設定</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenCycleDialog()}
            >
              新增週期設定
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
            {safeInventoryCycles.map((cycle) => (
              <Grid key={cycle.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">{cycle.customerName}</Typography>
                      <Chip
                        label={cycle.isActive ? '啟用' : '停用'}
                        color={cycle.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      設備類型: {cycle.deviceType === 'all' ? '全部設備' : cycle.deviceType}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      週期: {cycle.cycleType === 'monthly' ? '每月' : 
                             cycle.cycleType === 'quarterly' ? '每季' : 
                             cycle.cycleType === 'annual' ? '每年' : `${cycle.cycleDays}天`}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      提醒: {cycle.reminderDays} 天前
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      下次盤點: {cycle.nextInventoryDate}
                    </Typography>
                    
                    <Box mt={2}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenCycleDialog(cycle)}
                      >
                        編輯
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCycle(cycle.id)}
                        color="error"
                        title="刪除週期設定"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 統計概覽標籤頁 */}
      {activeTab === 2 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">統計概覽</Typography>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              onClick={handleViewStatistics}
            >
              查看詳細統計
            </Button>
          </Box>
          
          <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}>
            <Grid>
              <Card sx={{ cursor: 'pointer' }} onClick={handleViewStatistics}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <AssessmentIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">{safeInventories.length}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        總盤點數
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid>
              <Card sx={{ cursor: 'pointer' }} onClick={handleViewStatistics}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">
                        {safeInventories.filter(inv => inv.status === 'completed').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        已完成
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid>
              <Card sx={{ cursor: 'pointer' }} onClick={handleViewStatistics}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}>
                      <PendingIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">
                        {safeInventories.filter(inv => inv.status === 'in_progress').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        進行中
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid>
              <Card sx={{ cursor: 'pointer' }} onClick={handleViewStatistics}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'info.main' }}>
                      <ScheduleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">
                        {safeInventories.filter(inv => inv.status === 'scheduled').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        已排程
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 新增/編輯盤點對話框 */}
      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingInventory ? '編輯盤點' : '新增盤點'}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={formFields}
        loading={loading}
        submitText={editingInventory ? '更新' : '建立'}
      />

      {/* 盤點週期設定對話框 */}
      <FormDialog
        open={openCycleDialog}
        onClose={handleCloseCycleDialog}
        title={editingCycle ? '編輯週期設定' : '新增週期設定'}
        formData={cycleFormData}
        onFormChange={setCycleFormData}
        onSubmit={handleCycleSubmit}
        fields={cycleFormFields}
        loading={loading}
        submitText={editingCycle ? '更新' : '建立'}
      />

      {/* 統計詳情對話框 */}
      <StatisticsDetailDialog
        open={openStatisticsDialog}
        onClose={() => setOpenStatisticsDialog(false)}
        inventories={safeInventories}
      />

      {/* 盤點詳細結果對話框 */}
      <InventoryDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        inventory={selectedInventory}
      />
    </Box>
  );
};

export default InventoryManagement;

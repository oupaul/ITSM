import React, { useState, useEffect, useRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Badge,
  LinearProgress,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  BottomNavigation,
  BottomNavigationAction,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  QrCodeScanner as ScannerIcon,
  Inventory as InventoryIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Camera as CameraIcon,
  Keyboard as KeyboardIcon,
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  Sync as SyncIcon,
  SyncDisabled as OfflineIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Storage as StorageIcon,
  Computer as ComputerIcon,
  Print as PrintIcon,
  Router as RouterIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Schedule as ScheduleIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';

const MobileInventory = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openScanDialog, setOpenScanDialog] = useState(false);
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [scannedCode, setScannedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [localInventoryData, setLocalInventoryData] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, pending, syncing, error

  // 模擬盤點會話資料
  const [inventorySessions] = useState([
    {
      id: 1,
      name: '2024年第一季盤點',
      location: '總公司',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      status: 'active',
      assignedTo: '盤點小組A',
      totalItems: 156,
      completedItems: 89,
      pendingItems: 67,
      progress: 57,
    },
    {
      id: 2,
      name: '機房設備專項盤點',
      location: '機房A-01',
      startDate: '2024-03-10',
      endDate: '2024-03-12',
      status: 'completed',
      assignedTo: '技術部',
      totalItems: 45,
      completedItems: 45,
      pendingItems: 0,
      progress: 100,
    },
  ]);

  // 模擬設備資料
  const mockDevices = [
    {
      id: 'DEV-001',
      barcode: 'DEV240115001SRV',
      name: '主伺服器-01',
      type: 'server',
      model: 'Dell PowerEdge R740',
      location: '機房A-01-R01',
      status: 'active',
      lastInventory: '2024-02-15',
      condition: 'good',
      notes: '',
    },
    {
      id: 'DEV-002',
      barcode: 'DEV240116002STG',
      name: '備份儲存設備',
      type: 'storage',
      model: 'Synology RS2421+',
      location: '機房A-01-R02',
      status: 'active',
      lastInventory: '2024-02-15',
      condition: 'good',
      notes: '',
    },
    {
      id: 'DEV-003',
      barcode: 'DEV240117003NET',
      name: '核心路由器',
      type: 'network',
      model: 'Cisco ISR 4331',
      location: '機房A-01-R03',
      status: 'active',
      lastInventory: null,
      condition: 'good',
      notes: '',
    },
    {
      id: 'DEV-004',
      barcode: 'DEV240118004PRT',
      name: '彩色印表機-01',
      type: 'printer',
      model: 'HP LaserJet Pro M404n',
      location: '辦公室3F-A區',
      status: 'active',
      lastInventory: null,
      condition: 'fair',
      notes: '墨水匣需要更換',
    },
  ];

  const [devices] = useState(mockDevices);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  // 監聽網路狀態
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 模擬攝影機掃描功能
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // 使用後置攝影機
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (error) {
      dispatch(showSnackbar({
        message: '無法啟動攝影機，請檢查權限設定或使用手動輸入',
        severity: 'warning'
      }));
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  // 模擬掃描條碼
  const simulateScan = () => {
    // 模擬掃描到條碼
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    setScannedCode(randomDevice.barcode);
    handleScannedDevice(randomDevice.barcode);
    stopCamera();
    setOpenScanDialog(false);
  };

  const handleScannedDevice = (barcode) => {
    const device = devices.find(d => d.barcode === barcode);
    if (device) {
      // 處理掃描到的設備
      handleInventoryItem(device);
    } else {
      dispatch(showSnackbar({
        message: `找不到條碼 ${barcode} 對應的設備`,
        severity: 'error'
      }));
    }
  };

  const handleManualInput = () => {
    if (!manualCode.trim()) {
      dispatch(showSnackbar({
        message: '請輸入條碼',
        severity: 'warning'
      }));
      return;
    }
    
    handleScannedDevice(manualCode.trim());
    setManualCode('');
    setOpenManualDialog(false);
  };

  const handleInventoryItem = (device) => {
    // 添加到本地盤點數據
    const inventoryItem = {
      id: Date.now(),
      deviceId: device.id,
      device: device,
      timestamp: new Date().toISOString(),
      condition: device.condition,
      location: device.location,
      notes: '',
      operator: '當前用戶', // 實際應該從登入狀態獲取
      sessionId: currentSession?.id,
    };

    setLocalInventoryData(prev => [...prev, inventoryItem]);
    setSyncStatus('pending');

    dispatch(showSnackbar({
      message: `已盤點設備：${device.name}`,
      severity: 'success'
    }));
  };

  const handleStartSession = (session) => {
    setCurrentSession(session);
    setActiveTab(1); // 切換到盤點標籤頁
    dispatch(showSnackbar({
      message: `開始盤點會話：${session.name}`,
      severity: 'info'
    }));
  };

  const handleSyncData = async () => {
    if (!isOnline) {
      dispatch(showSnackbar({
        message: '目前離線狀態，無法同步數據',
        severity: 'warning'
      }));
      return;
    }

    setSyncStatus('syncing');
    
    // 模擬同步過程
    setTimeout(() => {
      setSyncStatus('synced');
      dispatch(showSnackbar({
        message: `已同步 ${localInventoryData.length} 筆盤點記錄`,
        severity: 'success'
      }));
      setLocalInventoryData([]); // 清空本地數據
    }, 2000);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'server': return <ComputerIcon />;
      case 'storage': return <StorageIcon />;
      case 'network': return <RouterIcon />;
      case 'printer': return <PrintIcon />;
      case 'security': return <SecurityIcon />;
      default: return <ComputerIcon />;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'success';
      case 'good': return 'success';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case 'excellent': return '優良';
      case 'good': return '良好';
      case 'fair': return '普通';
      case 'poor': return '不佳';
      default: return '未知';
    }
  };

  const getTodayInventoryCount = () => {
    const today = new Date().toDateString();
    return localInventoryData.filter(item => 
      new Date(item.timestamp).toDateString() === today
    ).length;
  };

  return (
    <Box sx={{ pb: 8 }}> {/* 為底部導航留出空間 */}
      {/* 頂部狀態列 */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: isOnline ? 'success.light' : 'warning.light' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            {isOnline ? <SyncIcon color="success" /> : <OfflineIcon color="warning" />}
            <Typography variant="body2" color={isOnline ? 'success.dark' : 'warning.dark'}>
              {isOnline ? '線上模式' : '離線模式'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {syncStatus === 'pending' && (
              <Chip 
                label={`待同步 ${localInventoryData.length}`} 
                size="small" 
                color="warning" 
              />
            )}
            {syncStatus === 'syncing' && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} />
                <Typography variant="caption">同步中...</Typography>
              </Box>
            )}
            {isOnline && syncStatus === 'pending' && (
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleSyncData}
                startIcon={<UploadIcon />}
              >
                同步
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* 主要內容區域 */}
      {activeTab === 0 && (
        <Box>
          {/* 今日盤點統計 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>今日盤點進度</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 2, 
                textAlign: 'center' 
              }}>
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {getTodayInventoryCount()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    已盤點
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {localInventoryData.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    待同步
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {currentSession?.totalItems || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    總目標
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 盤點會話列表 */}
          <Typography variant="h6" gutterBottom>盤點會話</Typography>
          {inventorySessions.map(session => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {session.name}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      <Chip 
                        label={session.status === 'active' ? '進行中' : '已完成'}
                        color={session.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                      <Chip 
                        icon={<LocationIcon />}
                        label={session.location}
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        icon={<PersonIcon />}
                        label={session.assignedTo}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {session.startDate} - {session.endDate}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">
                        進度: {session.completedItems}/{session.totalItems}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={session.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box sx={{ ml: 2 }}>
                    {session.status === 'active' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleStartSession(session)}
                      >
                        開始盤點
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* 快速操作 */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>快速操作</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 2 
              }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ScannerIcon />}
                  onClick={() => setOpenScanDialog(true)}
                  sx={{ p: 2 }}
                >
                  掃描條碼
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<KeyboardIcon />}
                  onClick={() => setOpenManualDialog(true)}
                  sx={{ p: 2 }}
                >
                  手動輸入
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HistoryIcon />}
                  onClick={() => setActiveTab(2)}
                  sx={{ p: 2 }}
                >
                  盤點記錄
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<SettingsIcon />}
                  onClick={() => setActiveTab(3)}
                  sx={{ p: 2 }}
                >
                  設定
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* 盤點操作標籤頁 */}
      {activeTab === 1 && (
        <Box>
          {currentSession ? (
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {currentSession.name}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2">
                      進度: {currentSession.completedItems + getTodayInventoryCount()}/{currentSession.totalItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(((currentSession.completedItems + getTodayInventoryCount()) / currentSession.totalItems) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={((currentSession.completedItems + getTodayInventoryCount()) / currentSession.totalItems) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>

              {/* 快速掃描按鈕 */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 2, 
                mb: 3 
              }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ScannerIcon />}
                  onClick={() => setOpenScanDialog(true)}
                  sx={{ p: 3, fontSize: '1.1rem' }}
                >
                  掃描條碼
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<KeyboardIcon />}
                  onClick={() => setOpenManualDialog(true)}
                  sx={{ p: 3, fontSize: '1.1rem' }}
                >
                  手動輸入
                </Button>
              </Box>

              {/* 今日盤點列表 */}
              <Typography variant="h6" gutterBottom>今日盤點列表</Typography>
              {localInventoryData.length === 0 ? (
                <Alert severity="info">
                  <Typography>尚未開始盤點，請掃描條碼或手動輸入設備編號。</Typography>
                </Alert>
              ) : (
                <List>
                  {localInventoryData.slice().reverse().map((item, index) => (
                    <Card key={item.id} sx={{ mb: 1 }}>
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getDeviceIcon(item.device.type)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.device.name}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                條碼: {item.device.barcode}
                              </Typography>
                              <Typography variant="caption" display="block">
                                位置: {item.location}
                              </Typography>
                              <Typography variant="caption" display="block">
                                時間: {new Date(item.timestamp).toLocaleString('zh-TW')}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={getConditionText(item.condition)}
                            color={getConditionColor(item.condition)}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
          ) : (
            <Alert severity="info">
              <Typography>請先選擇一個盤點會話開始盤點。</Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* 盤點記錄標籤頁 */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>盤點記錄</Typography>
          <Alert severity="info">
            <Typography>盤點記錄功能開發中，敬請期待。</Typography>
          </Alert>
        </Box>
      )}

      {/* 設定標籤頁 */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>盤點設定</Typography>
          <Alert severity="info">
            <Typography>盤點設定功能開發中，敬請期待。</Typography>
          </Alert>
        </Box>
      )}

      {/* 底部導航 */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <BottomNavigation
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          showLabels
        >
          <BottomNavigationAction 
            label="首頁" 
            icon={<InventoryIcon />} 
          />
          <BottomNavigationAction 
            label="盤點" 
            icon={
              <Badge badgeContent={localInventoryData.length} color="warning">
                <ScannerIcon />
              </Badge>
            } 
          />
          <BottomNavigationAction 
            label="記錄" 
            icon={<HistoryIcon />} 
          />
          <BottomNavigationAction 
            label="設定" 
            icon={<SettingsIcon />} 
          />
        </BottomNavigation>
      </Paper>

      {/* 條碼掃描對話框 */}
      <Dialog 
        open={openScanDialog} 
        onClose={() => {
          setOpenScanDialog(false);
          stopCamera();
        }}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>掃描條碼</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {!scanning ? (
              <Box>
                <CameraIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  點擊下方按鈕啟動攝影機掃描條碼
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={startCamera}
                  sx={{ mt: 2 }}
                >
                  啟動攝影機
                </Button>
              </Box>
            ) : (
              <Box>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', maxWidth: 300, height: 200 }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={simulateScan}
                    sx={{ mr: 1 }}
                  >
                    模擬掃描
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={stopCamera}
                  >
                    停止
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenScanDialog(false);
            stopCamera();
          }}>
            取消
          </Button>
        </DialogActions>
      </Dialog>

      {/* 手動輸入對話框 */}
      <Dialog open={openManualDialog} onClose={() => setOpenManualDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>手動輸入條碼</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="設備條碼或編號"
            fullWidth
            variant="outlined"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleManualInput();
              }
            }}
            placeholder="請輸入設備條碼或編號"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManualDialog(false)}>取消</Button>
          <Button onClick={handleManualInput} variant="contained">確認</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobileInventory;

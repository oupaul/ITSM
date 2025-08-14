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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Stepper,
  Step,
  StepLabel,

  Divider,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Assignment as TicketIcon,
  BugReport as BugIcon,
  Build as ServiceIcon,
  Priority as PriorityIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingIcon,
  PlayArrow as InProgressIcon,
  Comment as CommentIcon,
  Visibility as ViewIcon,
  AttachFile as AttachIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { showSnackbar } from '../../store/slices/uiSlice';
import DataTable from '../../components/common/DataTable';
import SearchFilter from '../../components/common/SearchFilter';
import TicketStatistics from '../../components/tickets/TicketStatistics';
import { exportToCSV, exportToXLSX, exportToPDF } from '../../utils/exportUtils';
import { updateTechnician } from '../../store/slices/technicianSlice';

const ServiceTickets = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((s) => s.auth);
  const currentUser = auth?.user;
  const isCustomer = currentUser?.role === 'customer';
  const customerIdOfUser = currentUser?.customerId || currentUser?.id; // 視實際資料源調整
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all',
    customerId: 'all',
  });

  // 統計時間範圍篩選
  const [statisticsTimeRange, setStatisticsTimeRange] = useState('all');

  // 工單表單資料
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'hardware',
    priority: 'medium',
    customerId: '',
    customerName: '',
    deviceId: '',
    deviceName: '',
    assignedTo: '',
    contactPhone: '',
    contactEmail: '',
    location: '',
    expectedResolution: '',
    status: 'open',
  });

  // 工單回覆表單
  const [replyData, setReplyData] = useState({
    message: '',
    status: '',
    timeSpent: '',
    attachments: [],
  });

  // 模擬客戶資料
  const mockCustomers = [
    { id: 1, name: '群兆科技股份有限公司', phone: '02-1234-5678', email: 'contact@example1.com' },
    { id: 2, name: '創新軟體有限公司', phone: '02-2345-6789', email: 'contact@example2.com' },
    { id: 3, name: '未來科技公司', phone: '02-3456-7890', email: 'contact@example3.com' },
    { id: 4, name: '智慧解決方案股份有限公司', phone: '02-4567-8901', email: 'contact@example4.com' },
  ];

  // 模擬設備資料
  const mockDevices = [
    { id: 1, name: '主伺服器-01', type: 'server', customerId: 1, location: '機房A-01' },
    { id: 2, name: '備份儲存設備', type: 'storage', customerId: 1, location: '機房A-02' },
    { id: 3, name: '核心路由器', type: 'network', customerId: 2, location: '網路機房' },
    { id: 4, name: '彩色印表機-01', type: 'printer', customerId: 3, location: '辦公室3F' },
    { id: 5, name: '資安防火牆', type: 'security', customerId: 1, location: '機房A-03' },
    { id: 6, name: '工作站電腦-A01', type: 'computer', customerId: 2, location: '辦公室2F-A區' },
    { id: 7, name: '網路交換器', type: 'network', customerId: 3, location: '網路機房' },
    { id: 8, name: 'NAS儲存系統', type: 'storage', customerId: 4, location: '機房B-01' },
  ];

  // 模擬技術員資料
  const mockTechnicians = [
    { id: 1, name: '張工程師', speciality: 'hardware', workload: 3 },
    { id: 2, name: '李工程師', speciality: 'software', workload: 2 },
    { id: 3, name: '王技術員', speciality: 'network', workload: 4 },
    { id: 4, name: '陳技術員', speciality: 'hardware', workload: 1 },
    { id: 5, name: '林工程師', speciality: 'software', workload: 2 },
    { id: 6, name: '吳工程師', speciality: 'network', workload: 3 },
  ];

  // 模擬服務工單資料
  const mockTickets = [
    {
      id: 'TK-2024-001',
      title: '主伺服器無法啟動',
      description: '伺服器在昨晚突然當機，重新啟動後無法正常開機，顯示藍色錯誤畫面。',
      category: 'hardware',
      priority: 'high',
      status: 'open',
      customerId: 1,
      customerName: '群兆科技股份有限公司',
      deviceId: 1,
      deviceName: '主伺服器-01',
      assignedTo: '張工程師',
      contactPhone: '02-1234-5678',
      contactEmail: 'it@example1.com',
      location: '機房A-01',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
      expectedResolution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      actualResolution: null,
      timeSpent: 3.5,
      satisfaction: null,
      comments: [
        {
          id: 1,
          author: '張工程師',
          message: '已到現場檢查，初步判斷是硬碟故障，正在進行詳細診斷。',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          type: 'technician'
        },
        {
          id: 2,
          author: '客戶',
          message: '請盡快處理，這台伺服器很重要。',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          type: 'customer'
        },
        {
          id: 3,
          author: '張工程師',
          message: '已確認是主硬碟故障，需要更換硬碟並從備份恢復資料。預計明天下午完成。',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
          type: 'technician'
        }
      ]
    },
    {
      id: 'TK-2024-002',
      title: '印表機列印品質異常',
      description: '彩色印表機列印出來的文件有條紋，色彩不均勻。',
      category: 'hardware',
      priority: 'medium',
      status: 'in_progress',
      customerId: 3,
      customerName: '未來科技公司',
      deviceId: 4,
      deviceName: '彩色印表機-01',
      assignedTo: '陳技術員',
      contactPhone: '02-3456-7890',
      contactEmail: 'admin@example3.com',
      location: '辦公室3F',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      expectedResolution: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      actualResolution: null,
      timeSpent: 1.5,
      satisfaction: null,
      comments: [
        {
          id: 1,
          author: '陳技術員',
          message: '已清潔印字頭，正在校正色彩設定。',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'technician'
        }
      ]
    },
    {
      id: 'TK-2024-003',
      title: '網路連線不穩定',
      description: '辦公室網路經常斷線，影響員工工作效率。',
      category: 'network',
      priority: 'high',
      status: 'resolved',
      customerId: 2,
      customerName: '創新軟體有限公司',
      deviceId: 3,
      deviceName: '核心路由器',
      assignedTo: '王技術員',
      contactPhone: '02-2345-6789',
      contactEmail: 'tech@example2.com',
      location: '網路機房',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      expectedResolution: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      actualResolution: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      timeSpent: 4.0,
      satisfaction: 5,
      comments: [
        {
          id: 1,
          author: '王技術員',
          message: '已更新路由器韌體並重新配置，問題已解決。',
          timestamp: '2024-03-14T16:30:00Z',
          type: 'technician'
        },
        {
          id: 2,
          author: '客戶',
          message: '網路現在很穩定，謝謝！',
          timestamp: '2024-03-14T17:00:00Z',
          type: 'customer'
        }
      ]
    },
    {
      id: 'TK-2024-004',
      title: '軟體授權過期',
      description: 'Office 365 授權即將過期，需要續約。',
      category: 'software',
      priority: 'low',
      status: 'pending',
      customerId: 4,
      customerName: '智慧解決方案股份有限公司',
      deviceId: null,
      deviceName: null,
      assignedTo: '李工程師',
      contactPhone: '02-4567-8901',
      contactEmail: 'info@example4.com',
      location: '總公司',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45天前
      updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      expectedResolution: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      actualResolution: null,
      timeSpent: 0,
      satisfaction: null,
      comments: []
    }
  ];

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers] = useState(mockCustomers);
  const [devices, setDevices] = useState([]);
  // 以Redux工程師清單取代mock
  const technicians = useSelector((s) => s.technicians?.technicians || []);
  const [filteredDevices, setFilteredDevices] = useState([]);

  useEffect(() => {
    // 模擬載入數據
    setTimeout(() => {
      setTickets(mockTickets);
      setDevices(mockDevices);
      setLoading(false);
    }, 500);
  }, []);

  // 解析 Portal/Email 傳入的 newTicket 參數，預填並開啟新增工單
  useEffect(() => {
    if (loading) return;
    try {
      const params = new URLSearchParams(location.search || '');
      const raw = params.get('newTicket');
      if (!raw) return;
      const payload = JSON.parse(raw);
      const allowedCategories = ['hardware','software','network','security','other'];
      const allowedPriorities = ['low','medium','high','urgent'];
      const cid = Number.isNaN(parseInt(payload.customerId)) ? payload.customerId : parseInt(payload.customerId);
      const devList = devices.filter(d => String(d.customerId) === String(cid));
      setFilteredDevices(devList);
      setEditingTicket(null);
      setFormData({
        title: payload.title || '',
        description: payload.description || '',
        category: allowedCategories.includes(payload.category) ? payload.category : 'other',
        priority: allowedPriorities.includes(payload.priority) ? payload.priority : 'medium',
        customerId: cid || '',
        customerName: payload.customerName || '',
        deviceId: payload.deviceId || '',
        deviceName: payload.deviceName || '',
        assignedTo: payload.assignedTo || '',
        contactPhone: payload.contactPhone || '',
        contactEmail: payload.contactEmail || '',
        location: payload.location || '',
        expectedResolution: '',
        status: payload.status || 'open',
      });
      setOpenDialog(true);
      // 清除參數避免重複觸發
      navigate('/tickets', { replace: true });
    } catch (e) {
      console.error('Failed to parse newTicket payload', e);
    }
  }, [loading, location.search, devices, navigate]);

  // 狀態相關函數
  const getStatusText = (status) => {
    switch (status) {
      case 'open': return '待處理';
      case 'pending': return '等待中';
      case 'in_progress': return '處理中';
      case 'resolved': return '已解決';
      case 'closed': return '已關閉';
      default: return '未知';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <ErrorIcon />;
      case 'pending': return <PendingIcon />;
      case 'in_progress': return <InProgressIcon />;
      case 'resolved': return <CheckCircleIcon />;
      case 'closed': return <CancelIcon />;
      default: return <TicketIcon />;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'urgent': return '緊急';
      default: return '未知';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'hardware': return '硬體';
      case 'software': return '軟體';
      case 'network': return '網路';
      case 'security': return '資安';
      case 'other': return '其他';
      default: return '未知';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hardware': return <BugIcon />;
      case 'software': return <ServiceIcon />;
      case 'network': return <ScheduleIcon />;
      case 'security': return <WarningIcon />;
      case 'other': return <TicketIcon />;
      default: return <TicketIcon />;
    }
  };

  // 篩選工單
  const filteredTickets = tickets.filter(ticket => {
    // 角色限制：客戶只能看到自己的工單
    if (isCustomer && ticket.customerId !== parseInt(customerIdOfUser) && String(ticket.customerId) !== String(customerIdOfUser)) {
      return false;
    }
    const matchesSearch = !filters.search || 
      ticket.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.assignedTo?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || ticket.status === filters.status;
    const matchesPriority = filters.priority === 'all' || ticket.priority === filters.priority;
    const matchesAssignedTo = filters.assignedTo === 'all' || ticket.assignedTo === filters.assignedTo;
    const matchesCategory = filters.category === 'all' || ticket.category === filters.category;
    const matchesCustomer = filters.customerId === 'all' || ticket.customerId === parseInt(filters.customerId) || ticket.customerId === filters.customerId;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesCategory && matchesCustomer;
  });

  // 依據狀態分組
  const groupTicketsByStatus = () => {
    const groups = {
      open: [],
      pending: [],
      in_progress: [],
      resolved: [],
      closed: [],
    };

    tickets.forEach(ticket => {
      if (groups[ticket.status]) {
        groups[ticket.status].push(ticket);
      }
    });

    return groups;
  };

  const ticketGroups = groupTicketsByStatus();

  // 根據時間範圍篩選工單用於統計
  const getFilteredTicketsForStatistics = () => {
    if (statisticsTimeRange === 'all') {
      return tickets;
    }

    const now = new Date();
    const timeRanges = {
      week: 7,
      month: 30,
      quarter: 90,
    };

    const daysToFilter = timeRanges[statisticsTimeRange];
    if (!daysToFilter) return tickets;

    const filterDate = new Date();
    filterDate.setDate(now.getDate() - daysToFilter);

    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= filterDate;
    });
  };

  const statisticsTickets = getFilteredTicketsForStatistics();

  // 為統計計算重新分組
  const getStatisticsTicketGroups = () => {
    const groups = {
      open: [],
      pending: [],
      in_progress: [],
      resolved: [],
      closed: [],
    };

    statisticsTickets.forEach(ticket => {
      if (groups[ticket.status]) {
        groups[ticket.status].push(ticket);
      }
    });

    return groups;
  };

  const statisticsTicketGroups = getStatisticsTicketGroups();

  // 事件處理函數
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // 處理客戶選擇變化
  const handleCustomerChange = (customerId) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    const customerDevices = devices.filter(d => d.customerId === customerId);
    
    setFormData({
      ...formData,
      customerId,
      customerName: selectedCustomer?.name || '',
      contactPhone: selectedCustomer?.phone || '',
      contactEmail: selectedCustomer?.email || '',
      deviceId: '',
      deviceName: '',
      location: '',
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
      location: selectedDevice?.location || '',
    });
  };

  const handleOpenDialog = (ticket = null) => {
    if (ticket) {
      setEditingTicket(ticket);
      const customer = customers.find(c => c.id === ticket.customerId);
      const customerDevices = devices.filter(d => d.customerId === ticket.customerId);
      
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        customerId: ticket.customerId,
        customerName: ticket.customerName,
        deviceId: ticket.deviceId || '',
        deviceName: ticket.deviceName || '',
        assignedTo: ticket.assignedTo,
        contactPhone: ticket.contactPhone,
        contactEmail: ticket.contactEmail,
        location: ticket.location,
        expectedResolution: ticket.expectedResolution ? new Date(ticket.expectedResolution).toISOString().slice(0, 16) : '',
        status: ticket.status || 'open',
      });
      
      setFilteredDevices(customerDevices);
    } else {
      setEditingTicket(null);
      setFormData({
        title: '',
        description: '',
        category: 'hardware',
        priority: 'medium',
        customerId: '',
        customerName: '',
        deviceId: '',
        deviceName: '',
        assignedTo: '',
        contactPhone: '',
        contactEmail: '',
        location: '',
        expectedResolution: '',
        status: 'open',
      });
      
      setFilteredDevices([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTicket(null);
  };

  const handleViewTicket = (ticket) => {
    setViewingTicket(ticket);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewingTicket(null);
    setReplyData({
      message: '',
      status: '',
      timeSpent: '',
      attachments: [],
    });
  };

  // 判定某狀態是否計入工程師工作量
  const isCountingStatus = (status) => ['open', 'pending', 'in_progress'].includes(status);
  const findTechnicianByName = (name) => technicians.find(t => t.name === name);
  const adjustTechnicianWorkload = (techName, delta) => {
    if (!techName) return;
    const tech = findTechnicianByName(techName);
    if (!tech) return;
    const newLoad = Math.max(0, (tech.workload || 0) + delta);
    dispatch(updateTechnician({ id: tech.id, changes: { workload: newLoad } }));
  };

  const handleSubmit = () => {
    // 驗證必要欄位
    if (!formData.title || !formData.description || !formData.customerId) {
      dispatch(showSnackbar({ 
        message: '請填寫所有必要欄位（標題、描述、客戶）', 
        severity: 'error' 
      }));
      return;
    }

    if (editingTicket) {
      // 更新工單
      const prev = editingTicket;
      const updated = { 
        ...prev,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // 調整工程師工作量：
      // 1) 若負責人變更
      if (prev.assignedTo !== updated.assignedTo) {
        if (isCountingStatus(prev.status)) adjustTechnicianWorkload(prev.assignedTo, -1);
        if (isCountingStatus(updated.status)) adjustTechnicianWorkload(updated.assignedTo, +1);
      } else {
        // 2) 若狀態變更影響計數
        if (isCountingStatus(prev.status) && !isCountingStatus(updated.status)) {
          adjustTechnicianWorkload(updated.assignedTo, -1);
        } else if (!isCountingStatus(prev.status) && isCountingStatus(updated.status)) {
          adjustTechnicianWorkload(updated.assignedTo, +1);
        }
      }

      const updatedTickets = tickets.map(ticket =>
        ticket.id === editingTicket.id ? updated : ticket
      );
      setTickets(updatedTickets);
      dispatch(showSnackbar({ message: '工單更新成功', severity: 'success' }));
    } else {
      // 新增工單
      const newTicket = {
        id: `TK-2024-${String(tickets.length + 1).padStart(3, '0')}`,
        ...formData,
        status: formData.status || 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        actualResolution: null,
        timeSpent: 0,
        satisfaction: null,
        comments: [],
      };
      setTickets([...tickets, newTicket]);
      // 計入工程師工作量
      if (isCountingStatus(newTicket.status)) adjustTechnicianWorkload(newTicket.assignedTo, +1);
      dispatch(showSnackbar({ message: '工單建立成功', severity: 'success' }));
    }
    handleCloseDialog();
  };

  const handleAddReply = () => {
    if (!replyData.message.trim()) {
      dispatch(showSnackbar({ 
        message: '請輸入回覆內容', 
        severity: 'error' 
      }));
      return;
    }

    const newComment = {
      id: (viewingTicket.comments?.length || 0) + 1,
      author: '系統管理員',
      message: replyData.message,
      timestamp: new Date().toISOString(),
      type: 'technician'
    };

    const nextStatus = replyData.status || viewingTicket.status;
    const updatedTicket = {
      ...viewingTicket,
      comments: [...(viewingTicket.comments || []), newComment],
      updatedAt: new Date().toISOString(),
      status: nextStatus,
      timeSpent: (viewingTicket.timeSpent || 0) + (parseFloat(replyData.timeSpent) || 0),
      actualResolution: nextStatus === 'resolved' ? new Date().toISOString() : viewingTicket.actualResolution,
    };

    // 若狀態由計數→非計數，或反之，調整負責人工時
    if (isCountingStatus(viewingTicket.status) && !isCountingStatus(nextStatus)) {
      adjustTechnicianWorkload(viewingTicket.assignedTo, -1);
    } else if (!isCountingStatus(viewingTicket.status) && isCountingStatus(nextStatus)) {
      adjustTechnicianWorkload(viewingTicket.assignedTo, +1);
    }

    const updatedTickets = tickets.map(ticket =>
      ticket.id === viewingTicket.id ? updatedTicket : ticket
    );

    setTickets(updatedTickets);
    setViewingTicket(updatedTicket);
    
    setReplyData({
      message: '',
      status: '',
      timeSpent: '',
      attachments: [],
    });

    dispatch(showSnackbar({ message: '回覆新增成功', severity: 'success' }));
  };

  // 篩選選項
  const filterOptions = [
    {
      field: 'status',
      label: '狀態',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部狀態' },
        { value: 'open', label: '待處理' },
        { value: 'pending', label: '等待中' },
        { value: 'in_progress', label: '處理中' },
        { value: 'resolved', label: '已解決' },
        { value: 'closed', label: '已關閉' },
      ],
    },
    {
      field: 'priority',
      label: '優先級',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部優先級' },
        { value: 'low', label: '低' },
        { value: 'medium', label: '中' },
        { value: 'high', label: '高' },
        { value: 'urgent', label: '緊急' },
      ],
    },
    {
      field: 'category',
      label: '類別',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部類別' },
        { value: 'hardware', label: '硬體' },
        { value: 'software', label: '軟體' },
        { value: 'network', label: '網路' },
        { value: 'security', label: '資安' },
        { value: 'other', label: '其他' },
      ],
    },
    // 僅管理員/工程師可篩選客戶
    ...(!isCustomer ? [
      {
        field: 'customerId',
        label: '客戶',
        defaultValue: 'all',
        options: [
          { value: 'all', label: '全部客戶' },
          ...customers.map(c => ({ value: String(c.id), label: c.name })),
        ],
      },
    ] : []),
    {
      field: 'assignedTo',
      label: '負責人',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部負責人' },
        ...technicians.map(tech => ({ value: tech.name, label: tech.name })),
      ],
    },
  ];

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '剛剛';
    if (diffInHours < 24) return `${diffInHours} 小時前`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} 天前`;
  };

  // 匯出輔助：只匯出最後更新狀態為已解決的工單
  const getLastComment = (ticket) => {
    const comments = ticket?.comments || [];
    if (comments.length === 0) return null;
    return comments[comments.length - 1];
  };

  const buildResolvedExportRows = () => {
    const base = filteredTickets.filter(t => t.status === 'resolved');
    return base.map(t => {
      const lastComment = getLastComment(t);
      return {
        工單編號: t.id,
        標題: t.title,
        客戶: t.customerName,
        類別: getCategoryText(t.category),
        優先級: getPriorityText(t.priority),
        狀態: getStatusText(t.status),
        最後更新時間: t.updatedAt ? new Date(t.updatedAt).toLocaleString('zh-TW') : '',
        解決時間: t.actualResolution ? new Date(t.actualResolution).toLocaleString('zh-TW') : '',
        最後留言: lastComment ? lastComment.message : '',
      };
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">服務工單系統</Typography>
        <Box display="flex" gap={1}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} style={{ display: isCustomer ? 'none' : 'inline-flex' }}>
            新增工單
          </Button>
          <Button variant="outlined" onClick={() => exportToCSV(buildResolvedExportRows(), 'tickets_resolved.csv')}>匯出 CSV（已解決）</Button>
          <Button variant="outlined" onClick={() => exportToXLSX(buildResolvedExportRows(), 'tickets_resolved.xlsx')}>匯出 Excel（已解決）</Button>
          <Button variant="contained" onClick={() => exportToPDF(
            filteredTickets.filter(t => t.status === 'resolved').map(t => ({
              id: t.id,
              title: t.title,
              customerName: t.customerName,
              category: getCategoryText(t.category),
              priority: getPriorityText(t.priority),
              status: getStatusText(t.status),
              updatedAt: t.updatedAt ? new Date(t.updatedAt).toLocaleString('zh-TW') : '',
              actualResolution: t.actualResolution ? new Date(t.actualResolution).toLocaleString('zh-TW') : '',
              lastComment: (t.comments && t.comments.length > 0) ? t.comments[t.comments.length - 1].message : ''
            })),
            [
              { field: 'id', header: '工單編號' },
              { field: 'title', header: '標題' },
              { field: 'customerName', header: '客戶' },
              { field: 'category', header: '類別' },
              { field: 'priority', header: '優先級' },
              { field: 'status', header: '狀態' },
              { field: 'updatedAt', header: '最後更新時間' },
              { field: 'actualResolution', header: '解決時間' },
              { field: 'lastComment', header: '最後留言' },
            ],
            'tickets_resolved.pdf',
            '服務工單報告（已解決）'
          )}>匯出 PDF（已解決）</Button>
        </Box>
      </Box>

      {/* 警告提示 */}
      {(ticketGroups.open.length > 0 || ticketGroups.pending.length > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>工單提醒</AlertTitle>
          {ticketGroups.open.length > 0 && (
            <Typography>有 {ticketGroups.open.length} 個工單待處理。</Typography>
          )}
          {ticketGroups.pending.length > 0 && (
            <Typography>有 {ticketGroups.pending.length} 個工單等待回應。</Typography>
          )}
        </Alert>
      )}

      {/* 統計卡片 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, 
        gap: 3, 
        mb: 3 
      }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ErrorIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="error.main">
                  {ticketGroups.open.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  待處理
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PendingIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="warning.main">
                  {ticketGroups.pending.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  等待中
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <InProgressIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="info.main">
                  {ticketGroups.in_progress.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  處理中
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
                  {ticketGroups.resolved.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  已解決
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TicketIcon color="action" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="text.primary">
                  {tickets.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  總工單數
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
            label="工單列表" 
            icon={<TicketIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="工單統計" 
            icon={<InfoIcon />} 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      {/* 工單列表 */}
      {activeTab === 0 && (
        <Box>
          <SearchFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            searchPlaceholder="搜尋工單標題、描述、客戶、負責人..."
            filterOptions={filterOptions}
          />

          <DataTable
            columns={[
              {
                field: 'id',
                header: '工單編號',
                render: (value) => (
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {value}
                  </Typography>
                ),
              },
              {
                field: 'title',
                header: '標題',
                render: (value, row) => (
                  <Box>
                    <Typography variant="subtitle2">{value}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.customerName}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: 'category',
                header: '類別',
                render: (value) => (
                  <Chip
                    icon={getCategoryIcon(value)}
                    label={getCategoryText(value)}
                    size="small"
                    variant="outlined"
                  />
                ),
              },
              {
                field: 'priority',
                header: '優先級',
                render: (value) => (
                  <Chip
                    label={getPriorityText(value)}
                    color={getPriorityColor(value)}
                    size="small"
                  />
                ),
              },
              {
                field: 'status',
                header: '狀態',
                render: (value) => (
                  <Chip
                    icon={getStatusIcon(value)}
                    label={getStatusText(value)}
                    color={getStatusColor(value)}
                    size="small"
                  />
                ),
              },
              {
                field: 'assignedTo',
                header: '負責人',
                render: (value) => (
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: 12 }}>
                      {value ? value.charAt(0) : '?'}
                    </Avatar>
                    <Typography variant="body2">{value || '未指派'}</Typography>
                  </Box>
                ),
              },
              {
                field: 'createdAt',
                header: '建立時間',
                render: (value) => (
                  <Box>
                    <Typography variant="body2">
                      {new Date(value).toLocaleDateString('zh-TW')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getTimeDifference(value)}
                    </Typography>
                  </Box>
                ),
              },
            ]}
            data={filteredTickets}
            loading={loading}
            emptyMessage="沒有找到服務工單"
            actions={(row) => (
              <Box>
                <Tooltip title="查看詳情">
                  <IconButton
                    size="small"
                    onClick={() => handleViewTicket(row)}
                    color="primary"
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {!isCustomer && (
                  <Tooltip title="編輯工單">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(row)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          />
        </Box>
      )}

      {/* 工單統計標籤頁 */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>工單統計分析</Typography>
          
          {/* 時間範圍選擇 */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body1">統計範圍：</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select 
                value={statisticsTimeRange} 
                onChange={(e) => setStatisticsTimeRange(e.target.value)}
              >
                <MenuItem value="all">全部時間</MenuItem>
                <MenuItem value="week">最近一週</MenuItem>
                <MenuItem value="month">最近一月</MenuItem>
                <MenuItem value="quarter">最近三個月</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {statisticsTimeRange === 'all' 
                ? `共 ${statisticsTickets.length} 個工單` 
                : `${statisticsTimeRange === 'week' ? '7' : statisticsTimeRange === 'month' ? '30' : '90'} 天內共 ${statisticsTickets.length} 個工單`
              }
            </Typography>
            {statisticsTickets.length !== tickets.length && (
              <Chip 
                label={`已篩選 ${tickets.length - statisticsTickets.length} 個工單`} 
                size="small" 
                variant="outlined" 
                color="info" 
              />
            )}
          </Box>

          <TicketStatistics
            tickets={statisticsTickets}
            ticketGroups={statisticsTicketGroups}
            customers={customers}
            technicians={technicians}
            getStatusText={getStatusText}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getPriorityText={getPriorityText}
            getPriorityColor={getPriorityColor}
            getCategoryText={getCategoryText}
            getCategoryIcon={getCategoryIcon}
          />
        </Box>
      )}

      {/* 新增/編輯工單對話框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTicket ? '編輯工單' : '新增工單'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            mt: 1, 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 2 
          }}>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                label="工單標題"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                label="問題描述"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>類別</InputLabel>
              <Select
                value={formData.category}
                label="類別"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="hardware">硬體</MenuItem>
                <MenuItem value="software">軟體</MenuItem>
                <MenuItem value="network">網路</MenuItem>
                <MenuItem value="security">資安</MenuItem>
                <MenuItem value="other">其他</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>優先級</InputLabel>
              <Select
                value={formData.priority}
                label="優先級"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">低</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="high">高</MenuItem>
                <MenuItem value="urgent">緊急</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>客戶</InputLabel>
              <Select
                value={formData.customerId}
                label="客戶"
                onChange={(e) => handleCustomerChange(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>請選擇客戶</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!formData.customerId}>
              <InputLabel>相關設備</InputLabel>
              <Select
                value={formData.deviceId}
                label="相關設備"
                onChange={(e) => handleDeviceChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>無特定設備</em>
                </MenuItem>
                {filteredDevices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name} ({device.location})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>指派給</InputLabel>
              <Select
                value={formData.assignedTo}
                label="指派給"
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                <MenuItem value="">
                  <em>稍後指派</em>
                </MenuItem>
                {technicians.map((tech) => (
                  <MenuItem key={tech.id} value={tech.name}>
                    {tech.name} ({tech.speciality}, 負載: {tech.workload})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="聯絡電話"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
            <TextField
              fullWidth
              label="聯絡信箱"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
            <TextField
              fullWidth
              label="地點"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="預期完成時間"
              value={formData.expectedResolution}
              onChange={(e) => setFormData({ ...formData, expectedResolution: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTicket ? '更新' : '建立'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 工單詳情對話框 */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">{viewingTicket?.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                工單編號: {viewingTicket?.id}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Chip
                icon={getCategoryIcon(viewingTicket?.category)}
                label={getCategoryText(viewingTicket?.category)}
                size="small"
                variant="outlined"
              />
              <Chip
                label={getPriorityText(viewingTicket?.priority)}
                color={getPriorityColor(viewingTicket?.priority)}
                size="small"
              />
              <Chip
                icon={getStatusIcon(viewingTicket?.status)}
                label={getStatusText(viewingTicket?.status)}
                color={getStatusColor(viewingTicket?.status)}
                size="small"
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>問題描述</Typography>
              <Typography variant="body1" paragraph>
                {viewingTicket?.description}
              </Typography>

              <Typography variant="h6" gutterBottom>工單歷史</Typography>
              <List>
                {viewingTicket?.comments?.map((comment, index) => (
                  <Box key={comment.id}>
                    <ListItem sx={{ alignItems: 'flex-start', pl: 0 }}>
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: comment.type === 'customer' ? 'primary.main' : 'secondary.main' 
                          }}
                        >
                          {comment.type === 'customer' ? <PersonIcon /> : <CommentIcon />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" component="span">
                              {comment.author}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.timestamp).toLocaleString('zh-TW')}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {comment.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < (viewingTicket?.comments?.length || 0) - 1 && <Divider />}
                  </Box>
                ))}
                {(!viewingTicket?.comments || viewingTicket.comments.length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary="目前沒有工單歷史記錄"
                      secondary="工單建立後的所有更新和回覆都會顯示在這裡"
                    />
                  </ListItem>
                )}
              </List>

              {/* 新增回覆 */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>新增回覆</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="回覆內容"
                  value={replyData.message}
                  onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                  <FormControl size="small">
                    <InputLabel>更新狀態</InputLabel>
                    <Select
                      value={replyData.status}
                      label="更新狀態"
                      onChange={(e) => setReplyData({ ...replyData, status: e.target.value })}
                    >
                      <MenuItem value="">保持不變</MenuItem>
                      <MenuItem value="in_progress">處理中</MenuItem>
                      <MenuItem value="pending">等待回應</MenuItem>
                      <MenuItem value="resolved">已解決</MenuItem>
                      <MenuItem value="closed">關閉</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    type="number"
                    label="花費時間(小時)"
                    value={replyData.timeSpent}
                    onChange={(e) => setReplyData({ ...replyData, timeSpent: e.target.value })}
                  />
                  <Button variant="contained" onClick={handleAddReply}>
                    新增回覆
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>工單資訊</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">客戶</Typography>
                  <Typography variant="body1">{viewingTicket?.customerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">相關設備</Typography>
                  <Typography variant="body1">{viewingTicket?.deviceName || '無特定設備'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">負責人</Typography>
                  <Typography variant="body1">{viewingTicket?.assignedTo || '未指派'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">地點</Typography>
                  <Typography variant="body1">{viewingTicket?.location}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">聯絡方式</Typography>
                  <Box>
                    <Typography variant="body2">{viewingTicket?.contactPhone}</Typography>
                    <Typography variant="body2">{viewingTicket?.contactEmail}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">建立時間</Typography>
                  <Typography variant="body1">
                    {viewingTicket && new Date(viewingTicket.createdAt).toLocaleString('zh-TW')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">預期完成</Typography>
                  <Typography variant="body1">
                    {viewingTicket?.expectedResolution ? 
                      new Date(viewingTicket.expectedResolution).toLocaleString('zh-TW') : 
                      '未設定'
                    }
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">累計花費時間</Typography>
                  <Typography variant="body1">{viewingTicket?.timeSpent || 0} 小時</Typography>
                </Box>
                {viewingTicket?.satisfaction && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">客戶滿意度</Typography>
                    <Rating value={viewingTicket.satisfaction} readOnly size="small" />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceTickets;

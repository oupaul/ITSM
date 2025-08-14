import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  Router as RouterIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Email as EmailIcon,
  Brush as BrushIcon,
  Architecture as ArchitectureIcon,
  Language as LanguageIcon,
  NetworkCheck as NetworkIcon,
  Print as PrintIcon,
  Code as CodeIcon,
  Wifi as WifiIcon,
  QrCode2 as QrCode2Icon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { showSnackbar } from '../../store/slices/uiSlice';
import { setDevices } from '../../store/slices/deviceSlice';
import DataTable from '../../components/common/DataTable';
import SearchFilter from '../../components/common/SearchFilter';
import FormDialog from '../../components/common/FormDialog';
import QRCodeDialog from '../../components/common/QRCodeDialog';
import { exportToCSV, exportToXLSX, exportToPDF } from '../../utils/exportUtils';

const DeviceManagement = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { customers } = useSelector((state) => state.customers);
  const auth = useSelector((state) => state.auth);
  const devices = useSelector((state) => state.devices.devices);
  const currentUser = auth?.user;
  const isCustomer = currentUser?.role === 'customer';
  const customerIdOfUser = currentUser?.customerId || currentUser?.id;
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [openQR, setOpenQR] = useState(false);
  const [qrValue, setQrValue] = useState('');
  
  // 自動生成條碼函數
  const generateBarcode = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DEV${timestamp.slice(-8)}${random}`;
  };

  const [localFilters, setLocalFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    customerId: 'all',
    warrantyStatus: 'all',
    page: 1,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    name: '',
    type: 'server',
    model: '',
    serialNumber: '',
    customerId: '',
    status: 'active',
    location: '',
    ipAddress: '',
    macAddress: '',
    specifications: '',
    purchaseDate: '',
    warrantyExpiry: '',
    notes: '',
    barcode: '',
    serviceProvider: '',
    subscriptionType: '',
    licenseCount: '',
    renewalDate: '',
    adminEmail: '',
    serviceUrl: '',
    subnet: '',
    gateway: '',
    computerName: '',
    administrator: '',
    website: '',
    tvOrAnydesk: '',
    printerType: '',
    account: '',
    productKey: '',
    softwareType: '',
    installDate: '',
    client: '',
  });

  // 模擬設備和服務資料
  const mockDevices = [
    { id: 1, name: '主伺服器-01', type: 'server', model: 'Dell PowerEdge R740', serialNumber: 'DELL-2024-001', barcode: 'DEV240115001SRV', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '台北市信義區', ipAddress: '192.168.1.100', macAddress: '00:1B:44:11:3A:B7', specifications: 'Intel Xeon E5-2680, 32GB RAM, 2TB SSD', purchaseDate: '2024-01-15', warrantyExpiry: '2027-01-15', notes: '主要業務伺服器', createdAt: '2024-01-15', administrator: '張工程師' },
    { id: 2, name: '備份儲存設備', type: 'storage', model: 'Synology DS1821+', serialNumber: 'SYN-2024-002', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '台北市信義區', ipAddress: '192.168.1.101', macAddress: '00:1B:44:11:3A:B8', specifications: '8 Bay NAS, 16TB x 4', purchaseDate: '2024-02-01', warrantyExpiry: '2027-02-01', notes: '資料備份專用', createdAt: '2024-02-01', administrator: '李工程師' },
    { id: 3, name: '核心路由器', type: 'network', model: 'Cisco ISR 4321', serialNumber: 'CISCO-2024-003', customerId: 2, customerName: '創新軟體有限公司', status: 'active', location: '台北市大安區', ipAddress: '192.168.1.1', macAddress: '00:1B:44:11:3A:B9', specifications: 'Gigabit Ethernet, VPN Support', purchaseDate: '2024-01-20', warrantyExpiry: '2027-01-20', notes: '主要網路設備', createdAt: '2024-01-20', administrator: '王網路工程師', subnet: '255.255.255.0', gateway: '192.168.1.1' },
    { id: 4, name: '資安防火牆', type: 'security', model: 'Fortinet FortiGate 60F', serialNumber: 'FORT-2024-004', customerId: 2, customerName: '創新軟體有限公司', status: 'maintenance', location: '台北市大安區', ipAddress: '192.168.1.2', macAddress: '00:1B:44:11:3A:BA', specifications: 'Next-Gen Firewall, IPS/IDS', purchaseDate: '2024-02-10', warrantyExpiry: '2027-02-10', notes: '正在進行維護', createdAt: '2024-02-10', administrator: '陳資安工程師' },
    { id: 5, name: '總經理電腦', type: 'computer', model: 'Dell OptiPlex 7090', serialNumber: 'DELL-PC-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '台北市信義區', ipAddress: '192.168.1.10', macAddress: '00:1B:44:11:3A:BB', specifications: 'Intel i7-11700, 16GB RAM, 512GB SSD', purchaseDate: '2024-01-01', warrantyExpiry: '2027-01-01', notes: '總經理專用電腦', createdAt: '2024-01-01', computerName: 'GM-PC-001', administrator: '總經理', website: 'https://qunzhao.com', tvOrAnydesk: 'AnyDesk: 123456789' },
    { id: 6, name: '會計部電腦', type: 'computer', model: 'HP ProDesk 600 G5', serialNumber: 'HP-PC-2024-002', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '台北市信義區', ipAddress: '192.168.1.11', macAddress: '00:1B:44:11:3A:BC', specifications: 'Intel i5-10500, 8GB RAM, 256GB SSD', purchaseDate: '2024-01-15', warrantyExpiry: '2027-01-15', notes: '會計部門使用', createdAt: '2024-01-15', computerName: 'ACCT-PC-001', administrator: '會計主管', tvOrAnydesk: 'TeamViewer: 987654321' },
    { id: 7, name: '多功能事務機', type: 'printer', model: 'HP LaserJet Pro M404n', serialNumber: 'HP-PRT-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '台北市信義區', ipAddress: '192.168.1.20', macAddress: '00:1B:44:11:3A:BD', specifications: '黑白雷射印表機，掃描，影印', purchaseDate: '2024-01-10', warrantyExpiry: '2027-01-10', notes: '主要列印設備', createdAt: '2024-01-10', administrator: '行政助理', website: 'http://192.168.1.20', printerType: '雷射印表機' },
    { id: 8, name: 'Microsoft 365 企業版', type: 'm365', model: 'Microsoft 365 Business Premium', serialNumber: 'M365-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '雲端', ipAddress: 'N/A', macAddress: 'N/A', specifications: 'Exchange Online, SharePoint, Teams, Office Apps', purchaseDate: '2024-01-01', warrantyExpiry: '2025-01-01', notes: '企業郵件和協作平台', createdAt: '2024-01-01', serviceProvider: 'Microsoft', subscriptionType: 'Business Premium', licenseCount: '50', renewalDate: '2025-01-01', adminEmail: 'admin@qunzhao.com', serviceUrl: 'https://portal.office.com' },
    { id: 9, name: 'Adobe Creative Cloud', type: 'adobe', model: 'Adobe Creative Cloud for Teams', serialNumber: 'ADOBE-2024-001', customerId: 2, customerName: '創新軟體有限公司', status: 'active', location: '雲端', ipAddress: 'N/A', macAddress: 'N/A', specifications: 'Photoshop, Illustrator, InDesign, Premiere Pro', purchaseDate: '2024-02-01', warrantyExpiry: '2025-02-01', notes: '設計團隊使用', createdAt: '2024-02-01', serviceProvider: 'Adobe', subscriptionType: 'Creative Cloud for Teams', licenseCount: '10', renewalDate: '2025-02-01', adminEmail: 'design@innovate.com', serviceUrl: 'https://creative.adobe.com' },
    { id: 10, name: 'VPN 服務', type: 'network_service', model: 'Cisco AnyConnect', serialNumber: 'VPN-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '雲端', ipAddress: 'N/A', macAddress: 'N/A', specifications: '遠端存取 VPN 服務', purchaseDate: '2024-01-01', warrantyExpiry: '2025-01-01', notes: '員工遠端工作使用', createdAt: '2024-01-01', account: 'qunzhao_vpn', serviceUrl: 'https://vpn.qunzhao.com' },
    { id: 11, name: '備份服務', type: 'network_service', model: 'Acronis Backup', serialNumber: 'BACKUP-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '雲端', ipAddress: 'N/A', macAddress: 'N/A', specifications: '雲端備份服務', purchaseDate: '2024-01-01', warrantyExpiry: '2025-01-01', notes: '重要資料備份', createdAt: '2024-01-01', account: 'qunzhao_backup', serviceUrl: 'https://backup.acronis.com' },
    { id: 12, name: 'Windows 11 Pro', type: 'software', model: 'Microsoft Windows 11 Professional', serialNumber: 'WIN11-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '軟體授權', ipAddress: 'N/A', macAddress: 'N/A', specifications: '作業系統', purchaseDate: '2024-01-01', warrantyExpiry: '2025-01-01', notes: '企業版授權', createdAt: '2024-01-01', productKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', softwareType: '作業系統', licenseCount: '50', installDate: '2024-01-15', client: '全公司' },
    { id: 13, name: 'AutoCAD 2024', type: 'autocad', model: 'AutoCAD 2024', serialNumber: 'AUTOCAD-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '雲端', ipAddress: 'N/A', macAddress: 'N/A', specifications: '2D/3D CAD 設計軟體', purchaseDate: '2024-01-15', warrantyExpiry: '2025-01-15', notes: '工程部門使用', createdAt: '2024-01-15', serviceProvider: 'Autodesk', subscriptionType: 'AutoCAD 2024', licenseCount: '5', renewalDate: '2025-01-15', adminEmail: 'engineering@qunzhao.com', serviceUrl: 'https://www.autodesk.com/products/autocad', productKey: 'AUTOCAD-XXXXX-XXXXX', softwareType: 'CAD 軟體', installDate: '2024-01-20', client: '工程部門' },
    { id: 14, name: 'qunzhao.com 域名', type: 'domain', model: '域名註冊', serialNumber: 'DOMAIN-2024-001', customerId: 1, customerName: '群兆科技股份有限公司', status: 'active', location: '雲端', ipAddress: 'N/A', macAddress: 'N/A', specifications: '企業官方網站域名', purchaseDate: '2024-01-01', warrantyExpiry: '2025-01-01', notes: '官方網站域名', createdAt: '2024-01-01', serviceProvider: 'GoDaddy', subscriptionType: '域名註冊', licenseCount: '1', renewalDate: '2025-01-01', adminEmail: 'admin@qunzhao.com', serviceUrl: 'https://www.qunzhao.com' },
  ];

  // 模擬客戶資料（用於下拉選單）
  const mockCustomers = [
    { id: 1, name: '群兆科技股份有限公司' },
    { id: 2, name: '創新軟體有限公司' },
    { id: 3, name: '未來科技公司' },
  ];

  // 首次載入：若 Redux 無設備資料，注入 mock
  useEffect(() => {
    if (!devices || devices.length === 0) {
      dispatch(setDevices(mockDevices));
    }
  }, [devices, dispatch]);

  // 檢查 URL 參數，若有 editDevice 則自動開啟編輯
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editDeviceId = urlParams.get('editDevice');
    if (editDeviceId && devices && devices.length > 0) {
      const deviceToEdit = devices.find(d => d.id === parseInt(editDeviceId));
      if (deviceToEdit) {
        handleOpenDialog(deviceToEdit);
        navigate('/devices', { replace: true });
      }
    }
  }, [location.search, devices, navigate]);

  const handleOpenDialog = (device = null) => {
    if (device) {
      setEditingDevice(device);
      setFormData({
        ...device,
        customerId: device.customerId?.toString?.() || String(device.customerId || ''),
      });
    } else {
      setEditingDevice(null);
      setFormData({
        name: '',
        type: 'server',
        model: '',
        serialNumber: '',
        customerId: '',
        status: 'active',
        location: '',
        ipAddress: '',
        macAddress: '',
        specifications: '',
        purchaseDate: '',
        warrantyExpiry: '',
        notes: '',
        barcode: generateBarcode(),
        serviceProvider: '',
        subscriptionType: '',
        licenseCount: '',
        renewalDate: '',
        adminEmail: '',
        serviceUrl: '',
        subnet: '',
        gateway: '',
        computerName: '',
        administrator: '',
        website: '',
        tvOrAnydesk: '',
        printerType: '',
        account: '',
        productKey: '',
        softwareType: '',
        installDate: '',
        client: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDevice(null);
  };

  const effectiveCustomers = (customers && customers.length > 0) ? customers : mockCustomers;

  const handleSubmit = async () => {
    try {
      const currentDevices = devices && devices.length > 0 ? devices : mockDevices;
      if (editingDevice) {
        const updated = currentDevices.map(d => d.id === editingDevice.id ? {
          ...d,
          ...formData,
          id: d.id,
          customerId: parseInt(formData.customerId),
          customerName: effectiveCustomers.find(c => c.id === parseInt(formData.customerId))?.name || '',
        } : d);
        dispatch(setDevices(updated));
        dispatch(showSnackbar({ message: '設備更新成功', severity: 'success' }));
      } else {
        const newDevice = {
          ...formData,
          id: Math.max(...currentDevices.map(d => d.id), 0) + 1,
          customerId: parseInt(formData.customerId),
          customerName: effectiveCustomers.find(c => c.id === parseInt(formData.customerId))?.name || '',
          createdAt: new Date().toISOString().split('T')[0],
        };
        dispatch(setDevices([newDevice, ...currentDevices]));
        dispatch(showSnackbar({ message: '設備建立成功', severity: 'success' }));
      }
      handleCloseDialog();
    } catch (error) {
      dispatch(showSnackbar({ message: error || '操作失敗', severity: 'error' }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此設備嗎？')) {
      try {
        const currentDevices = devices && devices.length > 0 ? devices : mockDevices;
        const updated = currentDevices.filter(d => d.id !== id);
        dispatch(setDevices(updated));
        dispatch(showSnackbar({ message: '設備刪除成功', severity: 'success' }));
      } catch (error) {
        dispatch(showSnackbar({ message: error || '刪除失敗', severity: 'error' }));
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters, page: 1 };
    setLocalFilters(updatedFilters);
  };

  const handlePageChange = (event, newPage) => {
    setLocalFilters({ ...localFilters, page: newPage + 1 });
  };

  const handleRowsPerPageChange = (event) => {
    setLocalFilters({ 
      ...localFilters, 
      limit: parseInt(event.target.value, 10), 
      page: 1 
    });
  };

  const handleResetFilters = () => {
    setLocalFilters({
      search: '',
      type: 'all',
      status: 'all',
      customerId: 'all',
      warrantyStatus: 'all',
      page: 1,
      limit: 10,
    });
  };

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
  const getWarrantyStatusText = (status) => ({ active: '有效', expiring_within_3_months: '3個月內到期', expiring_soon: '即將到期', expired: '已過期', unknown: '未知' }[status] || '未知');
  const getWarrantyStatusColor = (status) => ({ active: 'success', expiring_within_3_months: 'warning', expiring_soon: 'error', expired: 'error', unknown: 'default' }[status] || 'default');
  const getWarrantyDaysRemaining = (warrantyExpiry) => {
    if (!warrantyExpiry) return null;
    const today = new Date();
    const expiryDate = new Date(warrantyExpiry);
    return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  };

  const filteredDevices = (devices || [])
    .filter(device => {
      if (isCustomer && device.customerId !== parseInt(customerIdOfUser) && String(device.customerId) !== String(customerIdOfUser)) return false;
      const q = (localFilters.search || '').toLowerCase();
      const cname = device.customerName || effectiveCustomers.find(c => String(c.id) === String(device.customerId))?.name || '';
      const matchesSearch = !q ||
        (device.name || '').toLowerCase().includes(q) ||
        (device.model || '').toLowerCase().includes(q) ||
        (device.serialNumber || '').toLowerCase().includes(q) ||
        cname.toLowerCase().includes(q) ||
        (device.computerName || '').toLowerCase().includes(q) ||
        (device.administrator || '').toLowerCase().includes(q) ||
        (device.location || '').toLowerCase().includes(q) ||
        (device.serviceProvider || '').toLowerCase().includes(q) ||
        (device.ipAddress || '').toLowerCase().includes(q);
      const matchesType = localFilters.type === 'all' || device.type === localFilters.type;
      const matchesStatus = localFilters.status === 'all' || device.status === localFilters.status;
      const matchesCustomer = localFilters.customerId === 'all' || String(device.customerId) === String(localFilters.customerId);
      const deviceWarrantyStatus = getWarrantyStatus(device.warrantyExpiry);
      const matchesWarranty = localFilters.warrantyStatus === 'all' || deviceWarrantyStatus === localFilters.warrantyStatus;
      return matchesSearch && matchesType && matchesStatus && matchesCustomer && matchesWarranty;
    });

  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case 'server': return <ComputerIcon />;
      case 'storage': return <StorageIcon />;
      case 'network': return <RouterIcon />;
      case 'security': return <SecurityIcon />;
      case 'computer': return <ComputerIcon />;
      case 'printer': return <PrintIcon />;
      case 'm365': return <EmailIcon />;
      case 'adobe': return <BrushIcon />;
      case 'autocad': return <ArchitectureIcon />;
      case 'domain': return <LanguageIcon />;
      case 'network_service': return <WifiIcon />;
      case 'software': return <CodeIcon />;
      default: return <CloudIcon />;
    }
  };

  const getDeviceTypeText = (type) => ({
    server: '伺服器', storage: '儲存設備', network: '網路設備', security: '資安設備', computer: '電腦設備', printer: '列印設備', m365: 'Microsoft 365', adobe: 'Adobe CC', autocad: 'AutoCAD', domain: '域名服務', network_service: '網路服務', software: '軟體資產',
  }[type] || '其他');

  const getStatusColor = (status) => ({ active: 'success', inactive: 'default', maintenance: 'warning', faulty: 'error' }[status] || 'default');
  const getStatusText = (status) => ({ active: '正常', inactive: '停用', maintenance: '維護中', faulty: '故障' }[status] || '未知');

  const isCloudService = (type) => ['m365', 'adobe', 'autocad', 'domain', 'network_service'].includes(type);
  const isSoftware = (type) => ['software', 'autocad'].includes(type);

  const columns = [
    {
      field: 'name', header: '設備/服務名稱',
      render: (value, row) => (
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2, bgcolor: isCloudService(row.type) ? 'secondary.main' : isSoftware(row.type) ? 'warning.main' : 'primary.main' }}>
            {getDeviceTypeIcon(row.type)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{row.name || ''}</Typography>
            <Typography variant="caption" color="text.secondary">{row.model || ''}</Typography>
            {row.computerName && (
              <Typography variant="caption" color="text.secondary" display="block">電腦名稱: {row.computerName}</Typography>
            )}
          </Box>
        </Box>
      )
    },
    {
      field: 'type', header: '類型',
      render: (value) => (
        <Chip label={getDeviceTypeText(value)} size="small" variant="outlined" color={isCloudService(value) ? 'secondary' : isSoftware(value) ? 'warning' : 'primary'} />
      )
    },
    { field: 'customerName', header: '所屬客戶' },
    { field: 'serialNumber', header: '序號/服務ID' },
    {
      field: 'barcode', header: '設備條碼',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" fontFamily="monospace">{value || '尚未生成'}</Typography>
          {value && (
            <Box sx={{ mt: 0.5 }}>
              <Button size="small" variant="outlined" onClick={() => { setQrValue(value); setOpenQR(true); }}>查看 QR</Button>
            </Box>
          )}
        </Box>
      )
    },
    {
      field: 'location', header: '位置/服務商',
      render: (value, row) => (
        <Box>
          <Typography variant="body2">{row.location || ''}</Typography>
          {isCloudService(row.type) && row.serviceProvider && (
            <Typography variant="caption" color="text.secondary">{row.serviceProvider}</Typography>
          )}
        </Box>
      )
    },
    {
      field: 'ipAddress', header: 'IP 位址',
      render: (value, row) => (row.ipAddress === 'N/A' ? 'N/A' : (
        <Box>
          <Typography variant="body2">{row.ipAddress || ''}</Typography>
          {row.subnet && <Typography variant="caption" color="text.secondary">Subnet: {row.subnet}</Typography>}
        </Box>
      ))
    },
    {
      field: 'administrator', header: '管理者',
      render: (value, row) => (row.administrator || row.adminEmail || 'N/A')
    },
    {
      field: 'status', header: '狀態',
      render: (value) => (<Chip label={getStatusText(value)} color={getStatusColor(value)} size="small" />)
    },
    {
      field: 'warranty', header: '保固狀態',
      render: (value, row) => {
        const s = getWarrantyStatus(row.warrantyExpiry);
        const days = getWarrantyDaysRemaining(row.warrantyExpiry);
        return (
          <Box>
            <Chip label={getWarrantyStatusText(s)} color={getWarrantyStatusColor(s)} size="small" sx={{ mb: 0.5 }} />
            <Typography variant="caption" display="block" color="text.secondary">到期日: {row.warrantyExpiry || '未設定'}</Typography>
            {days !== null && days >= 0 && (
              <Typography variant="caption" display="block" color="text.secondary">剩餘: {days} 天</Typography>
            )}
          </Box>
        );
      }
    },
    {
      field: 'licenseCount', header: '授權數量',
      render: (value, row) => (isCloudService(row.type) || isSoftware(row.type)) ? (row.licenseCount ? `${row.licenseCount} 個` : 'N/A') : 'N/A'
    },
  ];

  const filterOptions = [
    { field: 'type', label: '設備/服務類型', defaultValue: 'all', options: [
      { value: 'all', label: '全部類型' },
      { value: 'server', label: '伺服器' },
      { value: 'storage', label: '儲存設備' },
      { value: 'network', label: '網路設備' },
      { value: 'security', label: '資安設備' },
      { value: 'computer', label: '電腦設備' },
      { value: 'printer', label: '列印設備' },
      { value: 'm365', label: 'Microsoft 365' },
      { value: 'adobe', label: 'Adobe CC' },
      { value: 'autocad', label: 'AutoCAD' },
      { value: 'domain', label: '域名服務' },
      { value: 'network_service', label: '網路服務' },
      { value: 'software', label: '軟體資產' },
    ]},
    { field: 'status', label: '狀態', defaultValue: 'all', options: [
      { value: 'all', label: '全部狀態' },
      { value: 'active', label: '正常' },
      { value: 'inactive', label: '停用' },
      { value: 'maintenance', label: '維護中' },
      { value: 'faulty', label: '故障' },
    ]},
    ...(!isCustomer ? [{ field: 'customerId', label: '客戶', defaultValue: 'all', options: [
      { value: 'all', label: '全部客戶' },
      ...(effectiveCustomers || []).map(c => ({ value: String(c.id), label: c.name })),
    ]}] : []),
    { field: 'warrantyStatus', label: '保固狀態', defaultValue: 'all', options: [
      { value: 'all', label: '全部保固狀態' },
      { value: 'active', label: '有效' },
      { value: 'expiring_within_3_months', label: '3個月內到期' },
      { value: 'expiring_soon', label: '即將到期（30天內）' },
      { value: 'expired', label: '已過期' },
      { value: 'unknown', label: '未知' },
    ]},
  ];

  const renderActions = (row) => {
    try {
      if (isCustomer) return null;
      return (
        <Box>
          <Tooltip title="查看 QR">
            <IconButton size="small" onClick={() => { setQrValue(row?.barcode || ''); setOpenQR(true); }}>
              <QrCode2Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title="編輯">
            <IconButton size="small" onClick={() => handleOpenDialog(row)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={() => handleDelete(row?.id)} color="error" title="刪除設備">
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">設備與雲端服務管理</Typography>
        <Box display="flex" gap={1}>
          {!isCustomer && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              新增設備/服務
            </Button>
          )}
          <Button variant="outlined" onClick={() => exportToCSV(filteredDevices, 'devices.csv')}>匯出 CSV</Button>
          <Button variant="outlined" onClick={() => exportToXLSX(filteredDevices, 'devices.xlsx')}>匯出 Excel</Button>
          <Button variant="contained" onClick={() => exportToPDF(filteredDevices, [
            { field: 'name', header: '名稱' },
            { field: 'type', header: '類型' },
            { field: 'customerName', header: '客戶' },
            { field: 'serialNumber', header: '序號' },
            { field: 'barcode', header: '條碼' },
            { field: 'status', header: '狀態' },
          ], 'devices.pdf', '設備與雲端服務報告')}>匯出 PDF</Button>
        </Box>
      </Box>

      <SearchFilter
        filters={localFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        searchPlaceholder="搜尋設備/服務名稱、型號、序號、電腦名稱、管理者、位置、服務商、IP位址..."
        filterOptions={filterOptions}
      />

      <DataTable
        columns={columns}
        data={filteredDevices}
        loading={false}
        emptyMessage="沒有找到設備或服務資料"
        page={localFilters.page - 1}
        rowsPerPage={localFilters.limit}
        totalCount={filteredDevices.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        actions={renderActions}
      />

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingDevice ? '編輯設備/服務' : '新增設備/服務'}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={[
          { name: 'name', label: '設備/服務名稱', required: true, width: 6 },
          { name: 'type', label: '類型', type: 'select', required: true, width: 6, options: [
            { value: 'server', label: '伺服器' }, { value: 'storage', label: '儲存設備' }, { value: 'network', label: '網路設備' }, { value: 'security', label: '資安設備' }, { value: 'computer', label: '電腦設備' }, { value: 'printer', label: '列印設備' }, { value: 'm365', label: 'Microsoft 365' }, { value: 'adobe', label: 'Adobe CC' }, { value: 'autocad', label: 'AutoCAD' }, { value: 'domain', label: '域名服務' }, { value: 'network_service', label: '網路服務' }, { value: 'software', label: '軟體資產' },
          ] },
          { name: 'model', label: '型號/服務方案', required: true, width: 6 },
          { name: 'serialNumber', label: '序號/服務ID', required: true, width: 6 },
          { name: 'barcode', label: '設備條碼', required: true, width: 6, disabled: true, helperText: '系統自動生成，用於行動盤點掃描', endAdornment: (
            <Button size="small" onClick={() => setFormData({ ...formData, barcode: generateBarcode() })} variant="outlined">重新生成</Button>
          ) },
          { name: 'customerId', label: '所屬客戶', type: 'select', required: true, width: 8, options: (effectiveCustomers || []).map(c => ({ value: String(c.id), label: c.name })) },
          { name: 'status', label: '狀態', type: 'select', width: 4, options: [
            { value: 'active', label: '正常' }, { value: 'inactive', label: '停用' }, { value: 'maintenance', label: '維護中' }, { value: 'faulty', label: '故障' },
          ] },
          { name: 'location', label: '位置/服務商', width: 6 },
          { name: 'ipAddress', label: 'IP 位址', width: 6 },
          { name: 'macAddress', label: 'MAC 位址', width: 6 },
          { name: 'purchaseDate', label: '購買日期', type: 'date', width: 6 },
          { name: 'warrantyExpiry', label: '保固到期', type: 'date', width: 6 },
          { name: 'subnet', label: '子網路遮罩', width: 6 },
          { name: 'gateway', label: '預設閘道', width: 6 },
          { name: 'computerName', label: '電腦名稱', width: 6 },
          { name: 'administrator', label: '管理者', width: 6 },
          { name: 'website', label: '網址', type: 'url', width: 6 },
          { name: 'tvOrAnydesk', label: 'TV/AnyDesk', width: 6 },
          { name: 'printerType', label: '印表機類型', width: 6 },
          { name: 'serviceProvider', label: '服務提供商', width: 6 },
          { name: 'subscriptionType', label: '訂閱類型', width: 6 },
          { name: 'licenseCount', label: '授權數量', type: 'number', width: 6 },
          { name: 'renewalDate', label: '續約日期', type: 'date', width: 6 },
          { name: 'adminEmail', label: '管理員信箱', type: 'email', width: 6 },
          { name: 'serviceUrl', label: '服務網址', type: 'url', width: 6 },
          { name: 'account', label: '帳號', width: 6 },
          { name: 'productKey', label: '產品金鑰', width: 6 },
          { name: 'softwareType', label: '軟體類型', width: 6 },
          { name: 'installDate', label: '安裝日期', type: 'date', width: 6 },
          { name: 'client', label: '用戶端', width: 6 },
          { name: 'specifications', label: '規格/功能', multiline: true, rows: 3, width: 12 },
          { name: 'notes', label: '備註', multiline: true, rows: 3, width: 12 },
        ]}
        loading={false}
        submitText={editingDevice ? '更新' : '建立'}
      />

      <QRCodeDialog open={openQR} value={qrValue} onClose={() => setOpenQR(false)} title="設備 QR Code" />
    </Box>
  );
};

export default DeviceManagement;

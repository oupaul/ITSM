import React, { useMemo, useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, TextField, Chip, Checkbox } from '@mui/material';
import { useSelector } from 'react-redux';
import { exportToCSV, exportToXLSX, exportToPDFAdvancedCJK } from '../../utils/exportUtils';
import DataTable from '../../components/common/DataTable';

const Reports = () => {
  const devicesState = useSelector((s) => s.devices);
  const customersState = useSelector((s) => s.customers);
  const auth = useSelector((s) => s.auth);
  const role = auth?.user?.role;
  const currentUser = auth?.user;
  const isCustomer = role === 'customer';
  const customerIdOfUser = currentUser?.customerId || currentUser?.id;

  const [tab, setTab] = useState(0); // 0: 設備, 1: 工單, 2: 保固

  // 勾選狀態
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [selectedWarrantyIds, setSelectedWarrantyIds] = useState([]);

  useEffect(() => {
    // 切換分頁時清除選取，避免混淆
    setSelectedDeviceIds([]);
    setSelectedTicketIds([]);
    setSelectedWarrantyIds([]);
  }, [tab]);

  // 設備報表：若Redux沒有資料則使用fallback
  const deviceFallback = [
    { id: 1, name: '主伺服器-01', type: 'server', customerId: 1, customerName: '群兆科技股份有限公司', serialNumber: 'DELL-2024-001', status: 'active', model: 'Dell PowerEdge R740' },
    { id: 2, name: '備份儲存設備', type: 'storage', customerId: 1, customerName: '群兆科技股份有限公司', serialNumber: 'SYNO-DS1821', status: 'active', model: 'Synology DS1821+' },
    { id: 3, name: '核心路由器', type: 'network', customerId: 2, customerName: '創新軟體有限公司', serialNumber: 'CISCO-ISR4321', status: 'active', model: 'Cisco ISR 4321' },
    { id: 4, name: '彩色印表機-01', type: 'printer', customerId: 3, customerName: '未來科技公司', serialNumber: 'HP-M404N', status: 'active', model: 'HP LaserJet Pro M404n' },
    { id: 5, name: 'Microsoft 365 商務版', type: 'm365', customerId: 3, customerName: '未來科技公司', serialNumber: 'M365-BIZP', status: 'active', model: 'Business Premium' },
  ];

  // 以 Redux 客戶為主，若空則 fallback 由 deviceFallback 推導
  const reduxCustomers = customersState?.customers || [];
  const fallbackCustomers = deviceFallback
    .map(d => ({ id: d.customerId, name: d.customerName }))
    .filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i);
  const customerOptions = (reduxCustomers.length > 0 ? reduxCustomers : fallbackCustomers)
    .map(c => ({ id: c.id, name: c.name }));
  const customerIdToName = useMemo(() => {
    const map = {};
    customerOptions.forEach(c => { map[String(c.id)] = c.name; });
    return map;
  }, [customerOptions]);

  const [deviceFilters, setDeviceFilters] = useState({ search: '', type: 'all', status: 'all', customerId: 'all' });

  const deviceRows = useMemo(() => {
    const src = (devicesState?.devices && devicesState.devices.length > 0) ? devicesState.devices : deviceFallback;
    const filteredByRole = isCustomer
      ? src.filter(d => d.customerId === parseInt(customerIdOfUser) || String(d.customerId) === String(customerIdOfUser))
      : src;

    const q = deviceFilters.search.trim().toLowerCase();
    const filtered = filteredByRole.filter(d => {
      if (deviceFilters.type !== 'all' && d.type !== deviceFilters.type) return false;
      if (deviceFilters.status !== 'all' && d.status !== deviceFilters.status) return false;
      if (deviceFilters.customerId !== 'all' && !(d.customerId === parseInt(deviceFilters.customerId) || String(d.customerId) === String(deviceFilters.customerId))) return false;
      if (!q) return true;
      const cname = d.customerName || customerIdToName[String(d.customerId)] || '';
      return (
        (d.name || '').toLowerCase().includes(q) ||
        (d.model || '').toLowerCase().includes(q) ||
        (d.serialNumber || '').toLowerCase().includes(q) ||
        cname.toLowerCase().includes(q)
      );
    });

    return filtered.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      customerName: d.customerName || customerIdToName[String(d.customerId)] || '',
      serialNumber: d.serialNumber || '',
      status: d.status || '',
    }));
  }, [devicesState, isCustomer, customerIdOfUser, deviceFilters, customerIdToName]);

  const deviceColumns = [
    {
      field: 'select', header: '選擇', align: 'center',
      render: (v, row) => (
        <Checkbox size="small" checked={selectedDeviceIds.includes(row.id)} onChange={(e) => {
          setSelectedDeviceIds((prev) => e.target.checked ? [...new Set([...prev, row.id])] : prev.filter(id => id !== row.id));
        }} />
      )
    },
    { field: 'name', header: '名稱' },
    { field: 'type', header: '類型' },
    { field: 'customerName', header: '客戶' },
    { field: 'serialNumber', header: '序號' },
    { field: 'status', header: '狀態' },
  ];

  // ---- 工單與保固報表 ----
  const mockTechnicians = [
    { id: 1, name: '張工程師' },
    { id: 2, name: '李工程師' },
    { id: 3, name: '王技術員' },
    { id: 4, name: '陳技術員' },
  ];
  const mockTickets = [
    {
      id: 'TK-2024-001', title: '主伺服器無法啟動', description: '伺服器當機無法開機',
      category: 'hardware', priority: 'high', status: 'open', customerId: 1, customerName: '群兆科技股份有限公司',
      deviceId: 1, deviceName: '主伺服器-01', assignedTo: '張工程師',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000 + 5 * 3600000).toISOString(),
      history: [
        { timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'open', comment: '建立工單' },
        { timestamp: new Date(Date.now() - 2 * 86400000 + 2 * 3600000).toISOString(), status: 'in_progress', comment: '工程師已到場檢查' },
      ],
    },
    {
      id: 'TK-2024-002', title: '印表機列印品質異常', description: '列印出現條紋',
      category: 'hardware', priority: 'medium', status: 'in_progress', customerId: 3, customerName: '未來科技公司',
      deviceId: 4, deviceName: '彩色印表機-01', assignedTo: '陳技術員',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      history: [
        { timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'open', comment: '建立工單' },
        { timestamp: new Date(Date.now() - 4 * 86400000 + 1 * 3600000).toISOString(), status: 'in_progress', comment: '更換碳粉測試中' },
      ],
    },
    {
      id: 'TK-2024-003', title: '網路連線不穩定', description: '辦公室網路經常斷線',
      category: 'network', priority: 'high', status: 'resolved', customerId: 2, customerName: '創新軟體有限公司',
      deviceId: 3, deviceName: '核心路由器', assignedTo: '王技術員',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      history: [
        { timestamp: new Date(Date.now() - 10 * 86400000).toISOString(), status: 'open', comment: '建立工單' },
        { timestamp: new Date(Date.now() - 9 * 86400000).toISOString(), status: 'in_progress', comment: '檢測線路與交換器' },
        { timestamp: new Date(Date.now() - 8 * 86400000).toISOString(), status: 'resolved', comment: '更換路由器電源供應器，問題排除' },
      ],
    },
  ];

  const [ticketFilters, setTicketFilters] = useState({ startDate: '', endDate: '', status: 'all', customerId: 'all', assignedTo: 'all', search: '' });

  const filteredTickets = useMemo(() => {
    const q = (ticketFilters.search || '').trim().toLowerCase();
    return mockTickets.filter(t => {
      if (isCustomer && t.customerId !== parseInt(customerIdOfUser) && String(t.customerId) !== String(customerIdOfUser)) return false;
      if (ticketFilters.startDate && new Date(t.createdAt) < new Date(ticketFilters.startDate)) return false;
      if (ticketFilters.endDate) {
        const end = new Date(ticketFilters.endDate); end.setHours(23,59,59,999);
        if (new Date(t.createdAt) > end) return false;
      }
      if (ticketFilters.status !== 'all' && t.status !== ticketFilters.status) return false;
      if (ticketFilters.customerId !== 'all' && !(t.customerId === parseInt(ticketFilters.customerId) || String(t.customerId) === String(ticketFilters.customerId))) return false;
      if (ticketFilters.assignedTo !== 'all' && t.assignedTo !== ticketFilters.assignedTo) return false;
      if (!q) return true;
      const cname = t.customerName || customerIdToName[String(t.customerId)] || '';
      return (
        (t.id || '').toLowerCase().includes(q) ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.deviceName || '').toLowerCase().includes(q) ||
        (t.assignedTo || '').toLowerCase().includes(q) ||
        cname.toLowerCase().includes(q)
      );
    });
  }, [ticketFilters, isCustomer, customerIdOfUser, customerIdToName]);

  const ticketColumns = [
    {
      field: 'select', header: '選擇', align: 'center',
      render: (v, row) => (
        <Checkbox size="small" checked={selectedTicketIds.includes(row.id)} onChange={(e) => {
          setSelectedTicketIds((prev) => e.target.checked ? [...new Set([...prev, row.id])] : prev.filter(id => id !== row.id));
        }} />
      )
    },
    { field: 'id', header: '工單編號' },
    { field: 'title', header: '標題' },
    { field: 'customerName', header: '客戶' },
    { field: 'category', header: '類別' },
    { field: 'priority', header: '優先級' },
    { field: 'status', header: '狀態' },
    { field: 'assignedTo', header: '負責人' },
    { field: 'createdAt', header: '建立時間' },
    { field: 'updatedAt', header: '最後更新' },
  ];

  // 工單：已解決匯出建構
  const getLastResolvedRecord = (ticket) => {
    const hist = Array.isArray(ticket.history) ? ticket.history : [];
    const lastResolved = [...hist].reverse().find(h => h.status === 'resolved');
    if (lastResolved) {
      return { resolvedAt: lastResolved.timestamp, resolvedComment: lastResolved.comment || '' };
    }
    if (ticket.status === 'resolved') {
      return { resolvedAt: ticket.updatedAt || ticket.createdAt, resolvedComment: '' };
    }
    return null;
  };
  const buildResolvedExportRows = (tickets) => tickets
    .map(t => ({ t, last: getLastResolvedRecord(t) }))
    .filter(x => x.last !== null)
    .map(({ t, last }) => ({
      id: t.id,
      title: t.title,
      customerName: t.customerName || customerIdToName[String(t.customerId)] || '',
      assignedTo: t.assignedTo || '',
      resolvedAt: last.resolvedAt || '',
      resolvedComment: last.resolvedComment || '',
    }));
  const ticketResolvedColumns = [
    { field: 'id', header: '工單編號' },
    { field: 'title', header: '標題' },
    { field: 'customerName', header: '客戶' },
    { field: 'assignedTo', header: '負責人' },
    { field: 'resolvedAt', header: '解決時間' },
    { field: 'resolvedComment', header: '解決說明' },
  ];
  const onExportTicketsResolvedPDF = (rows) => exportToPDFAdvancedCJK({
    title: '服務工單報表（已解決）',
    subtitle: ticketFilters.startDate || ticketFilters.endDate ? `期間：${ticketFilters.startDate || '不限'} ~ ${ticketFilters.endDate || '不限'}` : '',
    columns: ticketResolvedColumns, rows, filename: 'tickets_resolved_report.pdf',
    meta: { company: '群兆科技股份有限公司', createdBy: currentUser?.name || '' }, fontUrl: '/fonts/NotoSansTC-Regular.ttf', fontName: 'NotoSansTC',
  });

  // 工單：全部匯出建構（避免 history 出現在 Excel/CSV 欄位）
  const mapTicketsForAllExport = (tickets) => tickets.map(t => ({
    id: t.id,
    title: t.title,
    customerName: t.customerName || customerIdToName[String(t.customerId)] || '',
    category: t.category,
    priority: t.priority,
    status: t.status,
    assignedTo: t.assignedTo || '',
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
  const onExportTicketsAllPDF = (rows) => exportToPDFAdvancedCJK({
    title: '服務工單報表（全部）',
    subtitle: ticketFilters.startDate || ticketFilters.endDate ? `期間：${ticketFilters.startDate || '不限'} ~ ${ticketFilters.endDate || '不限'}` : '',
    columns: ticketColumns.filter(c => c.field !== 'select'), rows, filename: 'tickets_report.pdf',
    meta: { company: '群兆科技股份有限公司', createdBy: currentUser?.name || '' }, fontUrl: '/fonts/NotoSansTC-Regular.ttf', fontName: 'NotoSansTC',
  });

  // 保固報表（使用與保固頁一致之示例資料）
  const mockWarrantyDevices = [
    { id: 1, name: '主伺服器-01', model: 'Dell PowerEdge R740', customerId: 1, customerName: '群兆科技股份有限公司', warrantyExpiry: '2025-02-15' },
    { id: 2, name: '核心路由器', model: 'Cisco ISR 4321', customerId: 2, customerName: '創新軟體有限公司', warrantyExpiry: '2025-01-20' },
    { id: 3, name: '工作站-005', model: 'HP EliteDesk 800 G9', customerId: 1, customerName: '群兆科技股份有限公司', warrantyExpiry: '2024-12-30' },
    { id: 4, name: 'Microsoft 365 商務版', model: 'Business Premium', customerId: 3, customerName: '未來科技公司', warrantyExpiry: '2024-12-01' },
    { id: 5, name: '備份儲存設備', model: 'Synology DS1821+', customerId: 1, customerName: '群兆科技股份有限公司', warrantyExpiry: '2024-11-15' },
  ];

  const getWarrantyStatus = (expiry) => {
    if (!expiry) return 'unknown';
    const today = new Date();
    const d = new Date(expiry);
    const diff = Math.ceil((d - today) / 86400000);
    if (diff < 0) return 'expired';
    if (diff <= 30) return 'expiring_soon';
    if (diff <= 90) return 'expiring_within_3_months';
    return 'active';
  };
  const getWarrantyStatusText = (s) => ({ active: '有效', expiring_within_3_months: '3個月內到期', expiring_soon: '30天內到期', expired: '已過期', unknown: '未知' }[s] || '未知');

  const [warrantyFilters, setWarrantyFilters] = useState({ startDate: '', endDate: '', status: 'all', customerId: 'all', search: '' });

  const filteredWarranty = useMemo(() => {
    const q = (warrantyFilters.search || '').trim().toLowerCase();
    return mockWarrantyDevices
      .filter(d => !isCustomer || d.customerId === parseInt(customerIdOfUser) || String(d.customerId) === String(customerIdOfUser))
      .filter(d => {
        if (warrantyFilters.startDate && new Date(d.warrantyExpiry) < new Date(warrantyFilters.startDate)) return false;
        if (warrantyFilters.endDate) {
          const end = new Date(warrantyFilters.endDate); end.setHours(23,59,59,999);
          if (new Date(d.warrantyExpiry) > end) return false;
        }
        const status = getWarrantyStatus(d.warrantyExpiry);
        if (warrantyFilters.status !== 'all' && status !== warrantyFilters.status) return false;
        if (warrantyFilters.customerId !== 'all' && !(d.customerId === parseInt(warrantyFilters.customerId) || String(d.customerId) === String(warrantyFilters.customerId))) return false;
        if (!q) return true;
        const cname = d.customerName || customerIdToName[String(d.customerId)] || '';
        return (
          (d.name || '').toLowerCase().includes(q) ||
          (d.model || '').toLowerCase().includes(q) ||
          cname.toLowerCase().includes(q)
        );
      })
      .map(d => {
        const status = getWarrantyStatus(d.warrantyExpiry);
        const daysRemaining = Math.ceil((new Date(d.warrantyExpiry) - new Date()) / 86400000);
        return { ...d, customerName: d.customerName || customerIdToName[String(d.customerId)] || '', warrantyStatus: getWarrantyStatusText(status), daysRemaining };
      });
  }, [warrantyFilters, isCustomer, customerIdOfUser, customerIdToName]);

  const warrantyColumns = [
    {
      field: 'select', header: '選擇', align: 'center',
      render: (v, row) => (
        <Checkbox size="small" checked={selectedWarrantyIds.includes(row.id)} onChange={(e) => {
          setSelectedWarrantyIds((prev) => e.target.checked ? [...new Set([...prev, row.id])] : prev.filter(id => id !== row.id));
        }} />
      )
    },
    { field: 'name', header: '設備/服務' },
    { field: 'model', header: '型號/方案' },
    { field: 'customerName', header: '客戶' },
    { field: 'warrantyExpiry', header: '到期日' },
    { field: 'daysRemaining', header: '剩餘天數' },
    { field: 'warrantyStatus', header: '保固狀態' },
  ];

  const onExportWarrantyPDF = (rows) => exportToPDFAdvancedCJK({
    title: '保固報表',
    subtitle: warrantyFilters.startDate || warrantyFilters.endDate ? `到期區間：${warrantyFilters.startDate || '不限'} ~ ${warrantyFilters.endDate || '不限'}` : '',
    columns: warrantyColumns.filter(c => c.field !== 'select'),
    rows, filename: 'warranty_report.pdf',
    meta: { company: '群兆科技股份有限公司', createdBy: currentUser?.name || '' }, fontUrl: '/fonts/NotoSansTC-Regular.ttf', fontName: 'NotoSansTC',
  });

  // 取得「勾選或全部」資料
  const getSelectedDeviceRows = () => selectedDeviceIds.length > 0 ? deviceRows.filter(r => selectedDeviceIds.includes(r.id)) : deviceRows;
  const getSelectedTicketRows = () => selectedTicketIds.length > 0 ? filteredTickets.filter(r => selectedTicketIds.includes(r.id)) : filteredTickets;
  const getSelectedWarrantyRows = () => selectedWarrantyIds.length > 0 ? filteredWarranty.filter(r => selectedWarrantyIds.includes(r.id)) : filteredWarranty;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        報告分析
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          若 PDF 出現亂碼，請於 public/fonts 放入字型檔：NotoSansTC-Regular.ttf。
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="設備報表" />
          <Tab label="工單報表" />
          <Tab label="保固報表" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              設備清單報表：支援篩選、勾選與匯出PDF/Excel/CSV。
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 2 }}>
              <TextField label="搜尋（名稱/型號/序號/客戶）" value={deviceFilters.search} onChange={(e) => setDeviceFilters({ ...deviceFilters, search: e.target.value })} />
              <FormControl>
                <InputLabel>類型</InputLabel>
                <Select value={deviceFilters.type} label="類型" onChange={(e) => setDeviceFilters({ ...deviceFilters, type: e.target.value })}>
                  <MenuItem value="all">全部</MenuItem>
                  <MenuItem value="server">伺服器</MenuItem>
                  <MenuItem value="storage">儲存設備</MenuItem>
                  <MenuItem value="network">網路設備</MenuItem>
                  <MenuItem value="security">資安設備</MenuItem>
                  <MenuItem value="computer">電腦設備</MenuItem>
                  <MenuItem value="printer">列印設備</MenuItem>
                  <MenuItem value="m365">Microsoft 365</MenuItem>
                  <MenuItem value="adobe">Adobe CC</MenuItem>
                  <MenuItem value="autocad">AutoCAD</MenuItem>
                  <MenuItem value="domain">域名服務</MenuItem>
                  <MenuItem value="network_service">網路服務</MenuItem>
                  <MenuItem value="software">軟體資產</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>狀態</InputLabel>
                <Select value={deviceFilters.status} label="狀態" onChange={(e) => setDeviceFilters({ ...deviceFilters, status: e.target.value })}>
                  <MenuItem value="all">全部</MenuItem>
                  <MenuItem value="active">正常</MenuItem>
                  <MenuItem value="inactive">停用</MenuItem>
                  <MenuItem value="maintenance">維護中</MenuItem>
                  <MenuItem value="faulty">故障</MenuItem>
                </Select>
              </FormControl>
              {!isCustomer && (
                <FormControl>
                  <InputLabel>客戶</InputLabel>
                  <Select value={deviceFilters.customerId} label="客戶" onChange={(e) => setDeviceFilters({ ...deviceFilters, customerId: e.target.value })}>
                    <MenuItem value="all">全部</MenuItem>
                    {customerOptions.map(c => (
                      <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`符合筆數：${deviceRows.length}`} size="small" />
              <Chip label={`已勾選：${selectedDeviceIds.length}`} size="small" />
              <Button size="small" onClick={() => setSelectedDeviceIds(deviceRows.map(r => r.id))}>全選</Button>
              <Button size="small" onClick={() => setSelectedDeviceIds([])}>清除選取</Button>
              <Button variant="contained" onClick={() => exportToPDFAdvancedCJK({ title: '設備清單報告', subtitle: '系統自動產生報表', columns: deviceColumns.filter(c => c.field !== 'select'), rows: getSelectedDeviceRows(), filename: 'devices_report.pdf', meta: { company: '群兆科技股份有限公司', createdBy: currentUser?.name || '' }, fontUrl: '/fonts/NotoSansTC-Regular.ttf', fontName: 'NotoSansTC' })}>匯出PDF（勾選或全部）</Button>
              <Button variant="outlined" onClick={() => exportToXLSX(getSelectedDeviceRows(), 'devices_report.xlsx')}>匯出Excel（勾選或全部）</Button>
              <Button variant="outlined" onClick={() => exportToCSV(getSelectedDeviceRows(), 'devices_report.csv')}>匯出CSV（勾選或全部）</Button>
            </Box>
            <DataTable columns={deviceColumns} data={deviceRows} emptyMessage="沒有符合的設備資料" />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              服務工單報表：支援勾選；可匯出「全部」或僅「已解決」並帶出解決紀錄。
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 2 }}>
              <TextField label="關鍵字（編號/標題/描述/設備/客戶/負責人）" value={ticketFilters.search} onChange={(e) => setTicketFilters({ ...ticketFilters, search: e.target.value })} />
              <TextField type="date" label="開始日期" InputLabelProps={{ shrink: true }} value={ticketFilters.startDate} onChange={(e) => setTicketFilters({ ...ticketFilters, startDate: e.target.value })} />
              <TextField type="date" label="結束日期" InputLabelProps={{ shrink: true }} value={ticketFilters.endDate} onChange={(e) => setTicketFilters({ ...ticketFilters, endDate: e.target.value })} />
              <FormControl>
                <InputLabel>狀態</InputLabel>
                <Select value={ticketFilters.status} label="狀態" onChange={(e) => setTicketFilters({ ...ticketFilters, status: e.target.value })}>
                  <MenuItem value="all">全部</MenuItem>
                  <MenuItem value="open">待處理</MenuItem>
                  <MenuItem value="pending">等待中</MenuItem>
                  <MenuItem value="in_progress">處理中</MenuItem>
                  <MenuItem value="resolved">已解決</MenuItem>
                  <MenuItem value="closed">已關閉</MenuItem>
                </Select>
              </FormControl>
              {!isCustomer && (
                <FormControl>
                  <InputLabel>客戶</InputLabel>
                  <Select value={ticketFilters.customerId} label="客戶" onChange={(e) => setTicketFilters({ ...ticketFilters, customerId: e.target.value })}>
                    <MenuItem value="all">全部</MenuItem>
                    {customerOptions.map(c => <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
              <FormControl>
                <InputLabel>負責人</InputLabel>
                <Select value={ticketFilters.assignedTo} label="負責人" onChange={(e) => setTicketFilters({ ...ticketFilters, assignedTo: e.target.value })}>
                  <MenuItem value="all">全部</MenuItem>
                  {mockTechnicians.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`符合筆數：${filteredTickets.length}`} size="small" />
              <Chip label={`已勾選：${selectedTicketIds.length}`} size="small" />
              <Button size="small" onClick={() => setSelectedTicketIds(filteredTickets.map(r => r.id))}>全選</Button>
              <Button size="small" onClick={() => setSelectedTicketIds([])}>清除選取</Button>
              {(() => {
                const sourceAll = getSelectedTicketRows();
                const mappedAll = mapTicketsForAllExport(sourceAll);
                const resolvedRows = buildResolvedExportRows(sourceAll);
                return (
                  <>
                    <Button variant="contained" onClick={() => onExportTicketsAllPDF(mappedAll)}>匯出PDF（全部，勾選或全部）</Button>
                    <Button variant="outlined" onClick={() => exportToXLSX(mappedAll, 'tickets_report.xlsx')}>匯出Excel（全部）</Button>
                    <Button variant="outlined" onClick={() => exportToCSV(mappedAll, 'tickets_report.csv')}>匯出CSV（全部）</Button>
                    <Button variant="contained" onClick={() => onExportTicketsResolvedPDF(resolvedRows)}>匯出PDF（已解決，勾選或全部）</Button>
                    <Button variant="outlined" onClick={() => exportToXLSX(resolvedRows, 'tickets_resolved_report.xlsx')}>匯出Excel（已解決）</Button>
                    <Button variant="outlined" onClick={() => exportToCSV(resolvedRows, 'tickets_resolved_report.csv')}>匯出CSV（已解決）</Button>
                  </>
                );
              })()}
            </Box>
            <DataTable columns={ticketColumns} data={filteredTickets} emptyMessage="沒有符合的工單資料" />
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              保固報表：支援勾選，匯出沿用目前查詢結果。
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 2 }}>
              <TextField label="關鍵字（設備/型號/客戶）" value={warrantyFilters.search} onChange={(e) => setWarrantyFilters({ ...warrantyFilters, search: e.target.value })} />
              <TextField type="date" label="到期起" InputLabelProps={{ shrink: true }} value={warrantyFilters.startDate} onChange={(e) => setWarrantyFilters({ ...warrantyFilters, startDate: e.target.value })} />
              <TextField type="date" label="到期迄" InputLabelProps={{ shrink: true }} value={warrantyFilters.endDate} onChange={(e) => setWarrantyFilters({ ...warrantyFilters, endDate: e.target.value })} />
              <FormControl>
                <InputLabel>保固狀態</InputLabel>
                <Select value={warrantyFilters.status} label="保固狀態" onChange={(e) => setWarrantyFilters({ ...warrantyFilters, status: e.target.value })}>
                  <MenuItem value="all">全部</MenuItem>
                  <MenuItem value="active">有效</MenuItem>
                  <MenuItem value="expiring_soon">30天內到期</MenuItem>
                  <MenuItem value="expiring_within_3_months">3個月內到期</MenuItem>
                  <MenuItem value="expired">已過期</MenuItem>
                </Select>
              </FormControl>
              {!isCustomer && (
                <FormControl>
                  <InputLabel>客戶</InputLabel>
                  <Select value={warrantyFilters.customerId} label="客戶" onChange={(e) => setWarrantyFilters({ ...warrantyFilters, customerId: e.target.value })}>
                    <MenuItem value="all">全部</MenuItem>
                    {customerOptions.map(c => <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`符合筆數：${filteredWarranty.length}`} size="small" />
              <Chip label={`已勾選：${selectedWarrantyIds.length}`} size="小" />
              <Button size="small" onClick={() => setSelectedWarrantyIds(filteredWarranty.map(r => r.id))}>全選</Button>
              <Button size="small" onClick={() => setSelectedWarrantyIds([])}>清除選取</Button>
              {(() => {
                const source = getSelectedWarrantyRows();
                return (
                  <>
                    <Button variant="contained" onClick={() => onExportWarrantyPDF(source)}>匯出PDF（勾選或全部）</Button>
                    <Button variant="outlined" onClick={() => exportToXLSX(source, 'warranty_report.xlsx')}>匯出Excel（勾選或全部）</Button>
                    <Button variant="outlined" onClick={() => exportToCSV(source, 'warranty_report.csv')}>匯出CSV（勾選或全部）</Button>
                  </>
                );
              })()}
            </Box>
            <DataTable columns={warrantyColumns} data={filteredWarranty} emptyMessage="沒有符合的保固資料" />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Reports;

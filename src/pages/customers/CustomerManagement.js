import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  setFilters,
  clearFilters 
} from '../../store/slices/customerSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import DataTable from '../../components/common/DataTable';
import SearchFilter from '../../components/common/SearchFilter';
import FormDialog from '../../components/common/FormDialog';

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const { customers, loading, error, totalCount, filters } = useSelector((state) => state.customers);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [localCustomers, setLocalCustomers] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    contactPerson: '',
    notes: '',
  });

  // 模擬客戶資料
  const mockCustomers = [
    {
      id: 1,
      name: '群兆科技股份有限公司',
      email: 'info@qunzhao.com',
      phone: '02-1234-5678',
      address: '台北市信義區信義路五段7號',
      status: 'active',
      contactPerson: '張經理',
      notes: '主要客戶，設備數量較多',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: '創新軟體有限公司',
      email: 'contact@innovate.com',
      phone: '02-2345-6789',
      address: '台北市大安區復興南路一段390號',
      status: 'active',
      contactPerson: '李小姐',
      notes: '新客戶，需要特別關注',
      createdAt: '2024-02-20',
    },
    {
      id: 3,
      name: '未來科技公司',
      email: 'service@future.com',
      phone: '02-3456-7890',
      address: '台北市松山區敦化北路201號',
      status: 'inactive',
      contactPerson: '王先生',
      notes: '暫停合作',
      createdAt: '2024-01-10',
    },
  ];

  useEffect(() => {
    // 初始化本地客戶資料
    setLocalCustomers(mockCustomers);
  }, []);

  // 篩選客戶資料
  const filteredCustomers = localCustomers.filter(customer => {
    const matchesSearch = !localFilters.search || 
      customer.name.toLowerCase().includes(localFilters.search.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(localFilters.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(localFilters.search.toLowerCase());
    
    const matchesStatus = localFilters.status === 'all' || customer.status === localFilters.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        contactPerson: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCustomer) {
        // 更新客戶
        const updatedCustomers = localCustomers.map(customer =>
          customer.id === editingCustomer.id
            ? { ...customer, ...formData, id: customer.id }
            : customer
        );
        setLocalCustomers(updatedCustomers);
        dispatch(showSnackbar({ message: '客戶更新成功', severity: 'success' }));
      } else {
        // 新增客戶
        const newCustomer = {
          ...formData,
          id: Math.max(...localCustomers.map(c => c.id), 0) + 1,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setLocalCustomers([newCustomer, ...localCustomers]);
        dispatch(showSnackbar({ message: '客戶建立成功', severity: 'success' }));
      }
      handleCloseDialog();
    } catch (error) {
      dispatch(showSnackbar({ message: error || '操作失敗', severity: 'error' }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此客戶嗎？')) {
      try {
        const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
        setLocalCustomers(updatedCustomers);
        dispatch(showSnackbar({ message: '客戶刪除成功', severity: 'success' }));
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
      status: 'all',
      page: 1,
      limit: 10,
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getStatusText = (status) => {
    return status === 'active' ? '啟用' : '停用';
  };

  // 表格欄位定義
  const columns = [
    {
      field: 'name',
      header: '客戶名稱',
      render: (value, row) => (
        <Box>
          <Typography variant="subtitle2">{value}</Typography>
          {row.notes && (
            <Typography variant="caption" color="text.secondary">
              {row.notes}
            </Typography>
          )}
        </Box>
      ),
    },
    { field: 'contactPerson', header: '聯絡人' },
    { field: 'email', header: '電子郵件' },
    { field: 'phone', header: '電話' },
    {
      field: 'status',
      header: '狀態',
      render: (value) => (
        <Chip
          label={getStatusText(value)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    { field: 'createdAt', header: '建立日期' },
  ];

  // 篩選選項
  const filterOptions = [
    {
      field: 'status',
      label: '狀態',
      defaultValue: 'all',
      options: [
        { value: 'all', label: '全部' },
        { value: 'active', label: '啟用' },
        { value: 'inactive', label: '停用' },
      ],
    },
  ];

  // 表單欄位定義
  const formFields = [
    { name: 'name', label: '客戶名稱', required: true, width: 6 },
    { name: 'contactPerson', label: '聯絡人', width: 6 },
    { name: 'email', label: '電子郵件', type: 'email', required: true, width: 6 },
    { name: 'phone', label: '電話', width: 6 },
    { name: 'address', label: '地址', multiline: true, rows: 2, width: 12 },
    {
      name: 'status',
      label: '狀態',
      type: 'select',
      width: 6,
      options: [
        { value: 'active', label: '啟用' },
        { value: 'inactive', label: '停用' },
      ],
    },
    { name: 'notes', label: '備註', multiline: true, rows: 3, width: 12 },
  ];

  // 操作按鈕
  const renderActions = (row) => (
    <Box>
      <IconButton
        size="small"
        onClick={() => handleOpenDialog(row)}
        color="primary"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleDelete(row.id)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">客戶管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          新增客戶
        </Button>
      </Box>

      {/* 搜尋和篩選 */}
      <SearchFilter
        filters={localFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        searchPlaceholder="搜尋客戶名稱、聯絡人..."
        filterOptions={filterOptions}
      />

      {/* 客戶列表 */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        loading={loading}
        emptyMessage="沒有找到客戶資料"
        page={localFilters.page - 1}
        rowsPerPage={localFilters.limit}
        totalCount={filteredCustomers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        actions={renderActions}
      />

      {/* 新增/編輯客戶對話框 */}
      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingCustomer ? '編輯客戶' : '新增客戶'}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={formFields}
        loading={loading}
        submitText={editingCustomer ? '更新' : '建立'}
      />
    </Box>
  );
};

export default CustomerManagement;

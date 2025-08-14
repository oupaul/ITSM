import React, { useState } from 'react';
import { Box, Card, CardContent, Tabs, Tab, TextField, Button, Typography, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const RoleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [role, setRole] = useState('admin');
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async () => {
    const result = await dispatch(login({ ...form, role }));
    if (login.fulfilled.match(result)) {
      if (role === 'admin') navigate('/dashboard');
      else if (role === 'technician') navigate('/tickets');
      else navigate('/customers');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" sx={{ bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>系統登入</Typography>
          <Tabs value={role} onChange={(_, v) => setRole(v)} sx={{ mb: 2 }}>
            <Tab value="admin" label="管理員" />
            <Tab value="technician" label="工程師" />
            <Tab value="customer" label="客戶" />
          </Tabs>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={onSubmit} disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </Button>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            提示：客戶登入僅需輸入Email，系統會自動依Email網域比對歸屬公司。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoleLogin;

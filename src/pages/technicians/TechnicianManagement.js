import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addTechnician, updateTechnician, deleteTechnician } from '../../store/slices/technicianSlice';
import DataTable from '../../components/common/DataTable';

const TechnicianManagement = () => {
  const dispatch = useDispatch();
  const technicians = useSelector((state) => state.technicians.technicians);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', speciality: 'hardware', phone: '', email: '', region: '', status: 'active', skills: '' });
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return technicians;
    return technicians.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      (t.region || '').toLowerCase().includes(q) ||
      (t.speciality || '').toLowerCase().includes(q)
    );
  }, [technicians, search]);

  const handleOpen = (t = null) => {
    setEditing(t);
    setForm(t ? { ...t, skills: (t.skills || []).join(', ') } : { name: '', speciality: 'hardware', phone: '', email: '', region: '', status: 'active', skills: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const payload = { ...form, skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [] };
    if (editing) {
      dispatch(updateTechnician({ id: editing.id, changes: payload }));
    } else {
      dispatch(addTechnician(payload));
    }
    setOpen(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">工程師管理</Typography>
        <Box display="flex" gap={1}>
          <TextField size="small" placeholder="搜尋姓名/專長/區域/Email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            新增工程師
          </Button>
        </Box>
      </Box>

      <DataTable
        columns={[
          { field: 'name', header: '姓名' },
          { field: 'speciality', header: '專長' },
          { field: 'region', header: '服務區域' },
          { field: 'phone', header: '電話' },
          { field: 'email', header: 'Email' },
          { field: 'workload', header: '目前工單量' },
          { field: 'status', header: '狀態', render: (v) => <Chip size="small" color={v === 'active' ? 'success' : 'default'} label={v === 'active' ? '啟用' : '停用'} /> },
          { field: 'skills', header: '技能', render: (v) => (v || []).map((s, idx) => <Chip key={idx} size="small" label={s} sx={{ mr: 0.5 }} />) },
        ]}
        data={filtered}
        actions={(row) => (
          <Box>
            <Tooltip title="編輯">
              <IconButton size="small" onClick={() => handleOpen(row)}><EditIcon /></IconButton>
            </Tooltip>
            <Tooltip title="刪除">
              <IconButton size="small" color="error" onClick={() => dispatch(deleteTechnician(row.id))}><DeleteIcon /></IconButton>
            </Tooltip>
          </Box>
        )}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? '編輯工程師' : '新增工程師'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField label="姓名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>專長</InputLabel>
              <Select value={form.speciality} label="專長" onChange={(e) => setForm({ ...form, speciality: e.target.value })}>
                <MenuItem value="hardware">硬體</MenuItem>
                <MenuItem value="software">軟體</MenuItem>
                <MenuItem value="network">網路</MenuItem>
                <MenuItem value="security">資安</MenuItem>
              </Select>
            </FormControl>
            <TextField label="電話" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
            <TextField label="服務區域" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>狀態</InputLabel>
              <Select value={form.status} label="狀態" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <MenuItem value="active">啟用</MenuItem>
                <MenuItem value="inactive">停用</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField label="技能(以逗號分隔)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} fullWidth />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TechnicianManagement;

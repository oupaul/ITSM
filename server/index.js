/* Express API skeleton with JWT auth and in-memory data (DEV only) */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// --- Mock data ---
const customers = [
  { id: 1, name: '群兆科技股份有限公司', email: 'contact@example1.com', phone: '02-1234-5678', status: 'active' },
  { id: 2, name: '創新軟體有限公司', email: 'contact@example2.com', phone: '02-2345-6789', status: 'active' },
  { id: 3, name: '未來科技公司', email: 'contact@example3.com', phone: '02-3456-7890', status: 'active' },
  { id: 4, name: '智慧解決方案股份有限公司', email: 'contact@example4.com', phone: '02-4567-8901', status: 'active' },
];

let devices = [
  { id: 1, name: '主伺服器-01', type: 'server', model: 'Dell PowerEdge R740', serialNumber: 'DELL-2024-001', customerId: 1, customerName: customers.find(c=>c.id===1).name, status: 'active', warrantyExpiry: '2027-01-15' },
  { id: 2, name: '備份儲存設備', type: 'storage', model: 'Synology DS1821+', serialNumber: 'SYN-2024-002', customerId: 1, customerName: customers.find(c=>c.id===1).name, status: 'active', warrantyExpiry: '2027-02-01' },
  { id: 3, name: '核心路由器', type: 'network', model: 'Cisco ISR 4321', serialNumber: 'CISCO-2024-003', customerId: 2, customerName: customers.find(c=>c.id===2).name, status: 'active', warrantyExpiry: '2027-01-20' },
];

let tickets = [
  { id: 'TK-2024-001', title: '主伺服器無法啟動', description: '伺服器無法開機', category: 'hardware', priority: 'high', status: 'open', customerId: 1, customerName: customers.find(c=>c.id===1).name, deviceId: 1, deviceName: '主伺服器-01', assignedTo: '張工程師', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), comments: [] },
];

// --- Helpers ---
const domainToCustomerId = {
  'qztech.com.tw': 1,
  'innovasoft.com.tw': 2,
  'futuretech.com.tw': 3,
  'smart-solutions.com.tw': 4,
  'example1.com': 1,
  'example2.com': 2,
  'example3.com': 3,
  'example4.com': 4,
};

function extractDomain(email) {
  if (!email || !email.includes('@')) return null;
  return email.split('@').pop().toLowerCase();
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// --- Routes ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body || {};
  // DEMO: 密碼不驗證，實務應比對雜湊
  let resolvedCustomerId;
  let resolvedRole = role || 'customer';
  if (resolvedRole === 'customer') {
    const domain = extractDomain(email);
    resolvedCustomerId = domain ? domainToCustomerId[domain] : undefined;
    if (!resolvedCustomerId) {
      return res.status(400).json({ message: '無法根據Email判定公司' });
    }
  }
  const user = {
    id: 'u-' + Math.random().toString(36).slice(2, 8),
    name: (resolvedRole === 'admin' ? '管理員' : resolvedRole === 'technician' ? '工程師' : '客戶') + '-' + (email || 'user'),
    email: email || `${resolvedRole}@example.com`,
    role: resolvedRole,
    customerId: resolvedRole === 'customer' ? resolvedCustomerId : undefined,
  };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '12h' });
  res.json({ user, token });
});

// Customers
app.get('/api/customers', authMiddleware, (req, res) => {
  const { role, customerId } = req.user;
  if (role === 'customer') {
    return res.json({ customers: customers.filter(c => String(c.id) === String(customerId)), totalCount: 1 });
  }
  res.json({ customers, totalCount: customers.length });
});

app.post('/api/customers', authMiddleware, (req, res) => {
  const { role } = req.user;
  if (role === 'customer') return res.status(403).json({ message: 'Forbidden' });
  const body = req.body || {};
  const id = Math.max(0, ...customers.map(c => c.id)) + 1;
  const created = { id, name: body.name, email: body.email || '', phone: body.phone || '', status: body.status || 'active' };
  customers.unshift(created);
  res.status(201).json(created);
});

app.put('/api/customers/:id', authMiddleware, (req, res) => {
  const { role } = req.user;
  if (role === 'customer') return res.status(403).json({ message: 'Forbidden' });
  const id = parseInt(req.params.id);
  const idx = customers.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  customers[idx] = { ...customers[idx], ...req.body };
  res.json(customers[idx]);
});

app.delete('/api/customers/:id', authMiddleware, (req, res) => {
  const { role } = req.user;
  if (role === 'customer') return res.status(403).json({ message: 'Forbidden' });
  const id = parseInt(req.params.id);
  const before = customers.length;
  for (let i = customers.length - 1; i >= 0; i--) {
    if (customers[i].id === id) customers.splice(i, 1);
  }
  res.json({ deleted: before - customers.length });
});

// Devices
app.get('/api/devices', authMiddleware, (req, res) => {
  const { role, customerId } = req.user;
  const list = role === 'customer' ? devices.filter(d => String(d.customerId) === String(customerId)) : devices;
  res.json({ devices: list, totalCount: list.length });
});

app.post('/api/devices', authMiddleware, (req, res) => {
  const body = req.body || {};
  const id = Math.max(0, ...devices.map(d => d.id)) + 1;
  const customerName = customers.find(c => String(c.id) === String(body.customerId))?.name || '';
  const created = { id, ...body, customerId: parseInt(body.customerId), customerName };
  devices.unshift(created);
  res.status(201).json(created);
});

app.put('/api/devices/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = devices.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const customerName = customers.find(c => String(c.id) === String(req.body.customerId || devices[idx].customerId))?.name || devices[idx].customerName;
  devices[idx] = { ...devices[idx], ...req.body, customerName };
  res.json(devices[idx]);
});

app.delete('/api/devices/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  devices = devices.filter(d => d.id !== id);
  res.json({ deleted: 1 });
});

// Tickets
app.get('/api/tickets', authMiddleware, (req, res) => {
  const { role, customerId } = req.user;
  const list = role === 'customer' ? tickets.filter(t => String(t.customerId) === String(customerId)) : tickets;
  res.json({ tickets: list, totalCount: list.length });
});

app.post('/api/tickets', authMiddleware, (req, res) => {
  const body = req.body || {};
  const seq = (tickets.length + 1).toString().padStart(3, '0');
  const id = body.id || `TK-${new Date().getFullYear()}-${seq}`;
  const customerName = customers.find(c => String(c.id) === String(body.customerId))?.name || body.customerName || '';
  const deviceName = devices.find(d => String(d.id) === String(body.deviceId))?.name || body.deviceName || '';
  const created = {
    id,
    title: body.title,
    description: body.description,
    category: body.category || 'other',
    priority: body.priority || 'medium',
    status: body.status || 'open',
    customerId: parseInt(body.customerId),
    customerName,
    deviceId: body.deviceId || null,
    deviceName,
    assignedTo: body.assignedTo || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  };
  tickets.push(created);
  res.status(201).json(created);
});

app.put('/api/tickets/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  tickets[idx] = { ...tickets[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(tickets[idx]);
});

app.delete('/api/tickets/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const before = tickets.length;
  tickets = tickets.filter(t => t.id !== id);
  res.json({ deleted: before - tickets.length });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});



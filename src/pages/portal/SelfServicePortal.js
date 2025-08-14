import React, { useMemo, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SelfServicePortal = () => {
	const navigate = useNavigate();
	const { articles } = useSelector(s => s.knowledgeBase);
	const auth = useSelector(s => s.auth);
	const user = auth?.user;
	const isCustomer = user?.role === 'customer';

	const [faqSearch, setFaqSearch] = useState('');
	const [ticketForm, setTicketForm] = useState({ title: '', description: '', priority: 'medium', category: 'general' });

	const results = useMemo(() => {
		const q = faqSearch.trim().toLowerCase();
		return articles
			.filter(a => !q || a.title.toLowerCase().includes(q) || (a.content || '').toLowerCase().includes(q) || (a.keywords || []).join(',').toLowerCase().includes(q))
			.slice(0, 10);
	}, [articles, faqSearch]);

	const submitTicket = () => {
		const payload = {
			id: `PORTAL-${Date.now()}`,
			title: ticketForm.title,
			description: ticketForm.description,
			category: ticketForm.category,
			priority: ticketForm.priority,
			status: 'open',
			customerId: user?.customerId || user?.id || 0,
			customerName: user?.name || 'Portal User',
			deviceId: null,
			deviceName: null,
			assignedTo: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			history: [{ timestamp: new Date().toISOString(), status: 'open', comment: '由自助入口建立' }],
		};
		navigate(`/tickets?newTicket=${encodeURIComponent(JSON.stringify(payload))}`);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>自助服務入口</Typography>
			<Paper sx={{ p: 2, mb: 2 }}>
				<Typography variant="h6">常見問題</Typography>
				<TextField fullWidth placeholder="搜尋 FAQ 關鍵字..." value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} sx={{ mt: 1, mb: 2 }} />
				<List>
					{results.map(a => (
						<ListItem key={a.id}>
							<ListItemText primary={a.title} secondary={(a.content || '').slice(0, 120)} />
						</ListItem>
					))}
					{results.length === 0 && (
						<ListItem>
							<ListItemText primary="找不到相關結果" />
						</ListItem>
					)}
				</List>
			</Paper>
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">提交問題</Typography>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
					<TextField label="主旨" value={ticketForm.title} onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })} />
					<TextField label="分類" value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })} />
					<TextField label="優先級" value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })} />
					<TextField label="問題描述" multiline rows={4} value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} sx={{ gridColumn: { md: '1 / span 2' }}} />
				</Box>
				<Box mt={2}>
					<Button variant="contained" onClick={submitTicket} disabled={!ticketForm.title || !ticketForm.description}>送出工單</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default SelfServicePortal;

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EmailIngestSimulator = () => {
	const navigate = useNavigate();
	const user = useSelector(s => s.auth?.user);
	const [raw, setRaw] = useState('Subject: 列印異常\nFrom: user@example.com\n\n內容：印表機列印出現條紋，請協助處理');

	const parseAndSend = () => {
		const subjectLine = (raw.split('\n').find(l => l.toLowerCase().startsWith('subject:')) || '').split(':').slice(1).join(':').trim();
		const body = raw.split('\n\n').slice(1).join('\n\n').trim();
		const payload = {
			id: `EMAIL-${Date.now()}`,
			title: subjectLine || '來信建立工單',
			description: body || raw,
			category: 'general',
			priority: 'medium',
			status: 'open',
			customerId: user?.customerId || user?.id || 0,
			customerName: user?.name || 'Email User',
			deviceId: null,
			deviceName: null,
			assignedTo: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			history: [{ timestamp: new Date().toISOString(), status: 'open', comment: '由郵件轉單建立' }],
		};
		navigate(`/tickets?newTicket=${encodeURIComponent(JSON.stringify(payload))}`);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>郵件轉單模擬</Typography>
			<Paper sx={{ p: 2 }}>
				<TextField multiline minRows={10} fullWidth value={raw} onChange={(e) => setRaw(e.target.value)} />
				<Box mt={2}>
					<Button variant="contained" onClick={parseAndSend}>轉成工單</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default EmailIngestSimulator;

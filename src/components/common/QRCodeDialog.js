import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon, Close as CloseIcon } from '@mui/icons-material';
import QRCode from 'react-qr-code';

const QRCodeDialog = ({ open, value, title = '設備 QR Code', onClose }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
    } catch (e) {
      // ignore
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={2}>
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
            <QRCode value={value || ''} size={180} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {value || '無條碼'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Tooltip title="複製內容">
          <IconButton onClick={handleCopy}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
        <Button onClick={onClose} variant="contained">關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeDialog;

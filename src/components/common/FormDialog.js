import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';

const FormDialog = ({
  open,
  onClose,
  title,
  formData,
  onFormChange,
  onSubmit,
  fields = [],
  loading = false,
  submitText = '確定',
  cancelText = '取消',
  maxWidth = 'md',
  fullWidth = true,
}) => {
  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { name, label, type = 'text', required = false, options = [], ...props } = field;

    if (type === 'select') {
      return (
        <FormControl fullWidth required={required}>
          <InputLabel>{label}</InputLabel>
          <Select
            name={name}
            value={formData[name] || ''}
            label={label}
            onChange={(e) => handleInputChange(name, e.target.value)}
            sx={{
              '& .MuiSelect-select': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
            {...props}
          >
            {options.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (type === 'switch') {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={formData[name] || false}
              onChange={(e) => handleInputChange(name, e.target.checked)}
              {...props}
            />
          }
          label={label}
        />
      );
    }

    // 為日期欄位添加特殊樣式
    const isDateField = type === 'date';
    const isNumberField = type === 'number';
    const textFieldProps = {
      fullWidth: true,
      label: label,
      name: name,
      type: type,
      value: formData[name] || '',
      onChange: (e) => {
        const value = isNumberField ? e.target.value === '' ? '' : Number(e.target.value) : e.target.value;
        handleInputChange(name, value);
      },
      required: required,
      ...props,
    };

    // 為日期欄位添加特殊樣式
    if (isDateField) {
      textFieldProps.InputLabelProps = {
        shrink: true,
      };
      textFieldProps.sx = {
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
        },
        '& .MuiInputBase-input': {
          fontSize: '0.875rem',
        },
      };
    }

    return (
      <TextField
        {...textFieldProps}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>
        {title}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' } }}>
            {fields.map((field) => (
              <Box
                key={field.name}
                sx={{ gridColumn: { xs: 'span 12', md: `span ${field.width || 6}` } }}
              >
                {renderField(field)}
              </Box>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;

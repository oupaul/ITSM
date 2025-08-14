import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const SearchFilter = ({
  filters = {},
  onFilterChange,
  onReset,
  searchPlaceholder = '搜尋...',
  filterOptions = [],
  showResetButton = true,
  showFilterButton = false,
  onFilterClick,
}) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto auto auto 1fr' } }}>
        {/* 搜尋欄位 */}
        <Grid>
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>

        {/* 篩選選項 */}
        {filterOptions.map((option) => (
          <Grid key={option.field}>
            <FormControl fullWidth>
              <InputLabel>{option.label}</InputLabel>
              <Select
                value={filters[option.field] || option.defaultValue || ''}
                label={option.label}
                onChange={(e) => handleInputChange(option.field, e.target.value)}
              >
                {option.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        {/* 按鈕區域 */}
        <Grid>
          <Box display="flex" gap={1}>
            {showFilterButton && onFilterClick && (
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={onFilterClick}
              >
                篩選
              </Button>
            )}
            
            {showResetButton && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
              >
                重置
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchFilter;

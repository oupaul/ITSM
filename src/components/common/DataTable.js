import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = '沒有資料',
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  sortBy = null,
  sortOrder = 'asc',
  onSort,
  actions = null,
}) => {
  // 調試信息
  console.log('DataTable props:', { columns, data, loading });
  
  // 驗證 columns 陣列
  if (!Array.isArray(columns)) {
    console.error('DataTable: columns is not an array:', columns);
    return <div>Error: Invalid columns configuration</div>;
  }
  
  // 過濾掉無效的欄位
  const validColumns = columns.filter(column => column && typeof column === 'object' && column.field);
  if (validColumns.length !== columns.length) {
    console.warn('DataTable: Some columns are invalid:', columns);
  }
  const handleSort = (columnId) => {
    if (onSort) {
      const isAsc = sortBy === columnId && sortOrder === 'asc';
      onSort(columnId, isAsc ? 'desc' : 'asc');
    }
  };

  const renderCell = (row, column) => {
    if (!row || !column) return null;
    
    if (column.render) {
      try {
        return column.render(row[column.field], row);
      } catch (error) {
        console.error('Error rendering cell:', error, { row, column });
        return 'Error';
      }
    }
    return row[column.field];
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {validColumns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sortDirection={sortBy === column.field ? sortOrder : false}
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: 'grey.50',
                    ...column.headerStyle 
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                  操作
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={validColumns.length + (actions ? 1 : 0)} align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" py={3}>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography>載入中...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={validColumns.length + (actions ? 1 : 0)} align="center">
                  <Box py={3}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.filter(row => row).map((row, index) => (
                <TableRow key={row.id || index} hover>
                  {validColumns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                      sx={column.cellStyle}
                    >
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="center">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalCount > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="每頁顯示："
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} / ${count !== -1 ? count : `超過 ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default DataTable;

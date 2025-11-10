import { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, TablePagination, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useFetchData from '../../lib/useFetchData';

const headCells = [
  { id: 'voucherId', label: 'Voucher ID' },
  { id: 'date', label: 'Date' },
  { id: 'type', label: 'Type' },
  { id: 'description', label: 'Description' },
  { id: 'amount', label: 'Amount' },
];

const vouchers_data = [
  { id: 'VOU001', date: '2025-11-02', type: 'Payment', description: 'Salary payout', amount: '$10,000' },
  { id: 'VOU002', date: '2025-10-28', type: 'Expense', description: 'Office supplies', amount: '$500' },
  { id: 'VOU003', date: '2025-10-20', type: 'Payment', description: 'Client refund', amount: '$200' },
];

export default function VouchersTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vouchers, loading, error } = [] /*useFetchData(
    '/api/accounts/vouchers',
    { page, rowsPerPage, searchTerm }
  );*/

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Vouchers</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>{headCell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers_data.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>{voucher.id}</TableCell>
                <TableCell>{voucher.date}</TableCell>
                <TableCell>{voucher.type}</TableCell>
                <TableCell>{voucher.description}</TableCell>
                <TableCell>{voucher.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={-1} // Implement total count from API
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

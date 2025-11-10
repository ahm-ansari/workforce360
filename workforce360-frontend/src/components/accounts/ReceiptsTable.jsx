import { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, TablePagination, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useFetchData from '@/lib/useFetchData';

const headCells = [
  { id: 'receiptId', label: 'Receipt ID' },
  { id: 'date', label: 'Date' },
  { id: 'client', label: 'Client' },
  { id: 'amount', label: 'Amount' },
];

const receipts_data = [
  { id: 'REC001', date: '2025-11-01', client: 'Client A', amount: '$5,000' },
  { id: 'REC002', date: '2025-10-25', client: 'Client B', amount: '$1,200' },
  { id: 'REC003', date: '2025-10-15', client: 'Client C', amount: '$3,500' },
];

export default function ReceiptsTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  /*const { data: receipts, loading, error } = useFetchData(
    '/api/accounts/receipts',
    { page, rowsPerPage, searchTerm }
  ); */

  const handleChangePage = (event, newPage) => {
    //setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 /* if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>; */

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Receipts</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by client..."
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
            {receipts_data.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>{receipt.id}</TableCell>
                <TableCell>{receipt.date}</TableCell>
                <TableCell>{receipt.client}</TableCell>
                <TableCell>{receipt.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={-1} // Implement total count from API for proper pagination
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

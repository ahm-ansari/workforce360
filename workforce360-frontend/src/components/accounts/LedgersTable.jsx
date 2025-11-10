import { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, TablePagination, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useFetchData from '../../lib/useFetchData';

const headCells = [
  { id: 'entryDate', label: 'Date' },
  { id: 'account', label: 'Account' },
  { id: 'description', label: 'Description' },
  { id: 'debit', label: 'Debit' },
  { id: 'credit', label: 'Credit' },
];

const ledgers_data = [
  { id: 'LED001', entryDate: '2025-11-01', account: 'Cash', description: 'Receipt from Client A', debit: '$5,000', credit: '$0' },
  { id: 'LED002', entryDate: '2025-11-02', account: 'Expenses', description: 'Voucher for salary', debit: '$10,000', credit: '$0' },
];

export default function LedgersTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: ledgers, loading, error } = [] /*useFetchData(
    '/api/accounts/ledgers',
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
      <Typography variant="h6" sx={{ mb: 2 }}>General Ledger</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by description or account..."
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
            {ledgers_data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.entryDate}</TableCell>
                <TableCell>{entry.account}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.debit}</TableCell>
                <TableCell>{entry.credit}</TableCell>
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

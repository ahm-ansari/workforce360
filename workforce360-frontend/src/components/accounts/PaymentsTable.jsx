import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip, Typography } from '@mui/material';

const payments = [
  { id: 1, date: '2025-11-01', amount: '$5,000', status: 'Paid' },
  { id: 2, date: '2025-10-25', amount: '$1,200', status: 'Outstanding' },
  { id: 3, date: '2025-10-15', amount: '$3,500', status: 'Paid' },
];

export default function PaymentsTable() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Outstanding': return 'warning';
      default: return 'default';
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Recent Payments</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip } from '@mui/material';

export default function InvoicingTable() {
  // Sample data for the invoices. In a real application, you would fetch this data from an API.
  const invoices = [
    { id: 101, date: '2025-10-31', amount: '$1,200', status: 'Paid' },
    { id: 102, date: '2025-11-30', amount: '$1,500', status: 'Outstanding' },
    { id: 103, date: '2025-12-31', amount: '$1,500', status: 'Upcoming' },
  ];

  // Helper function to return the correct color for the Chip based on invoice status.
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Outstanding':
        return 'warning';
      case 'Upcoming':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Invoices
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={getStatusColor(invoice.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

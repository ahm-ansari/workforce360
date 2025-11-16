// app/payroll/payruns/[id]/page.js
'use client';

import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress // Import CircularProgress for loading state
} from '@mui/material';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { payRuns, employees } from '@/lib/mockData';
import AdminLayout from '@/components/layout/AdminLayout';
import { Are_You_Serious } from 'next/font/google';


export default function PayRunDetails() {
  const params = useParams();

  // Add a check to handle the case where params is not yet available
  if (!params || !params.id) {
    return (
        <AdminLayout title="Payrun">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
      </AdminLayout>
    );
  }

  const { id } = params;
  const payRun = payRuns.find((run) => run.id === parseInt(id));

  if (!payRun) {
    return (
        <AdminLayout title="Payrun">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5">Pay run not found.</Typography>
      </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Payrun">
      <Button component={Link} href="/payrolls/payruns" sx={{ mb: 2 }}>
        &larr; Back to Pay Runs
      </Button>
      <Typography variant="h4" gutterBottom>
        Pay Run Details: {payRun.period}
      </Typography>
      <Box mb={4}>
        <Typography>
          <Typography component="span" fontWeight="bold">Status:</Typography>
          <Chip
            label={payRun.status}
            color={payRun.status === 'Processed' ? 'success' : 'warning'}
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Typography>
        <Typography>
          <Typography component="span" fontWeight="bold">Total Amount:</Typography> ${payRun.totalAmount.toLocaleString()}
        </Typography>
        <Typography>
          <Typography component="span" fontWeight="bold">Processed On:</Typography> {payRun.processedOn || 'N/A'}
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Employee Salaries
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Gross Pay</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>${employee.grossPay.toLocaleString()}</TableCell>
                <TableCell>${employee.netPay.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Button component={Link} href={`/payrolls/records/${employee.id}`} size="small">
                    View Record
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer></AdminLayout>
  );
}
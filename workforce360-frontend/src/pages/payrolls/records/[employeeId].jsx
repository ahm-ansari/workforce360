// app/payroll/records/[employeeId]/page.js
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
  Button,
  CircularProgress // Import CircularProgress for loading state
} from '@mui/material';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { employees, employeePayrolls } from '@/lib/mockData';
import AdminLayout from '@/components/layout/AdminLayout';

export default function EmployeePayrollRecords() {
  const params = useParams();

  // Add a check to handle the case where params is not yet available
  if (!params || !params.employeeId) {
    return (
        <AdminLayout title="Payroll Dashboard">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
      </AdminLayout>
    );
  }

  const { employeeId } = params;
  const employee = employees.find((emp) => emp.id === parseInt(employeeId));
  const payrollRecords = employeePayrolls[employeeId] || [];

  if (!employee) {
    return (
        <AdminLayout title="Payroll Dashboard">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5">Employee not found.</Typography>
      </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Payroll Detail">
      <Button component={Link} href="/payrolls/payruns" sx={{ mb: 2 }}>
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Payroll Records for {employee.name}
      </Typography>
      <Box mb={4}>
        <Typography>
          <Typography component="span" fontWeight="bold">Department:</Typography> {employee.department}
        </Typography>
        <Typography>
          <Typography component="span" fontWeight="bold">Annual Salary:</Typography> ${employee.salary.toLocaleString()}
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Payment History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pay Period</TableCell>
              <TableCell>Gross Pay</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollRecords.length > 0 ? (
              payrollRecords.map((record) => (
                <TableRow key={record.payrunId}>
                  <TableCell>{record.period}</TableCell>
                  <TableCell>${record.gross.toLocaleString()}</TableCell>
                  <TableCell>${record.net.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined">
                      Download Payslip
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No payroll records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
}

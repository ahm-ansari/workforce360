// app/payroll/payruns/page.js
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
} from '@mui/material';
import Link from 'next/link';
import { payRuns } from '@/lib/mockData';
import AdminLayout from '@/components/layout/AdminLayout';


export default function AllPayRuns() {
  return (
    <AdminLayout title="All Pay Runs">
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Pay Runs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Processed On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payRuns.map((run) => (
              <TableRow key={run.id}>
                <TableCell>{run.period}</TableCell>
                <TableCell>
                  <Chip
                    label={run.status}
                    color={run.status === 'Processed' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>${run.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{run.processedOn || 'N/A'}</TableCell>
                <TableCell align="right">
                  <Button component={Link} href={`/payrolls/payruns/${run.id}`} size="small">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </AdminLayout>
  );
}

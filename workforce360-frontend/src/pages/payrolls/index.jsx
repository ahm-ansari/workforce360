// app/payroll/page.js
'use client';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Box,
  Grid,
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
import { payrollDashboardData, payRuns } from '@/lib/mockData';
import {CardUX} from "@/components/ui/card";
import ArrowIcon from '@mui/icons-material/ArrowForward';

function KpiCard({ title, value, link }) {
  return (
    <CardUX title={title} value={value} icon=
        {link && (
          <Button component={Link} href={link} sx={{ mt: 2 }}>
            <ArrowIcon />
          </Button>
        )}  />
  );
}

export default function PayrollDashboard() {
  return (
    <AdminLayout title="Payroll Dashboard">
      <Typography variant="h4" gutterBottom>
        Payroll Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}> 
          <KpiCard
            title="Total Monthly Payroll"
            value={`$${payrollDashboardData.totalMonthlyPayroll.toLocaleString()}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Upcoming Pay Date" value={payrollDashboardData.upcomingPayDate} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="New Hires (This Month)" value={payrollDashboardData.newHiresThisMonth} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Pending Approvals"
            value={payrollDashboardData.pendingApprovals}
            link="/payroll/payruns"
          />
        </Grid>
      </Grid>

      {/* Recent Pay Runs Table */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Recent Pay Runs
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
              {payRuns.slice(0, 3).map((run) => (
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
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}

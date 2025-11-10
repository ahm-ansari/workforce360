import { Paper, Typography } from '@mui/material';
import PaymentsTable from '@/components/accounts/PaymentsTable';
import AdminLayout from '@/components/layout/AdminLayout';

export default function PaymentsPage() {
  return (
    <AdminLayout>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Tracking
      </Typography>
      <PaymentsTable />
    </Paper>
    </AdminLayout>
  );
}

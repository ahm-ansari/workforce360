import { Paper, Typography } from '@mui/material';
import VouchersTable from '@/components/accounts/VouchersTable';
import AdminLayout from '@/components/layout/AdminLayout';


export default function VouchersPage() {
  return (
    <AdminLayout>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vouchers
      </Typography>
      <VouchersTable />
    </Paper>
    </AdminLayout>
  );
}

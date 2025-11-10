import { Paper, Typography } from '@mui/material';
import LedgersTable from '@/components/accounts/LedgersTable';
import AdminLayout from '@/components/layout/AdminLayout';

export default function LedgersPage() {
  return (
    <AdminLayout>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        General Ledger
      </Typography>
      <LedgersTable />
    </Paper>
    </AdminLayout>
  );
}

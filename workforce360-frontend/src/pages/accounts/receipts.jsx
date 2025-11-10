import { Paper, Typography } from '@mui/material';
import ReceiptsTable from '@/components/accounts/ReceiptsTable';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ReceiptsPage() {
  return (
    <AdminLayout>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Receipts
      </Typography>
      <ReceiptsTable />
    </Paper>
    </AdminLayout>
  );
}

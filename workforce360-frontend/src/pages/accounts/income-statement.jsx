import { Paper, Typography } from '@mui/material';
import IncomeStatementChart from '@/components/accounts/IncomeStatementChart';
import AdminLayout from '@/components/layout/AdminLayout';

export default function IncomeStatementPage() {
  return (
    <AdminLayout>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Income Statement
      </Typography>
      <IncomeStatementChart />
    </Paper>
    </AdminLayout>
  );
}

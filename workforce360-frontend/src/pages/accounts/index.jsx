import { Typography, Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import { Grid, Paper } from '@mui/material';
import AccountsKPIs from '@/components/accounts/AccountsKPIs';
import IncomeStatementChart from '@/components/accounts/IncomeStatementChart';
import PaymentsTable from '@/components/accounts/PaymentsTable';
import ReceiptsTable from '@/components/accounts/ReceiptsTable';
import VouchersTable from '../../components/accounts/VouchersTable';
import LedgersTable from '../../components/accounts/LedgersTable';


export default function Page() {

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Accounts Overview
      </Typography>
      <Grid container spacing={3}>
        <AccountsKPIs />
        
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2, height: 400 }}>
            <IncomeStatementChart />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <ReceiptsTable />
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <VouchersTable />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <PaymentsTable />
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <LedgersTable />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

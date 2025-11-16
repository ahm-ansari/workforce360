import { Typography, Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import BillingKPIs from '@/components/billing/BillingKPIs';
import InvoiceTable from '@/components/billing/InvoiceTable';
import { Grid } from '@mui/material';


export default function Page() {

  return (
    <AdminLayout>
      <Box className="flex">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12}}>
            <BillingKPIs />
          </Grid>
          <Grid size={{ xs:12}}>
            <InvoiceTable />
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}

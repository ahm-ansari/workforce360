import {Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import UtilitiesKPIs from '@/components/utilities/UtilitiesKPIs';
import UtilitiesTools from '@/components/utilities/UtilitiesTools';
import UtilitiesStatusChart from '@/components/utilities/UtilitiesStatusChart';
import UtilitiesLogs from '@/components/utilities/UtilitiesLogs';
import {Grid} from '@mui/material';


export default function Page() {

  return (
    <AdminLayout>
      <Box className="flex">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12}} >
            <UtilitiesKPIs />
          </Grid>
          <Grid size={{ xs: 12}}>
            <UtilitiesTools />
          </Grid>
          <Grid size={{ xs: 6}}>
            <UtilitiesStatusChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6}}>
            <UtilitiesLogs />
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}

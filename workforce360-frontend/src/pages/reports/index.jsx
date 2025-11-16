import { Typography, Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import ReportKPIs from '@/components/reports/ReportKPIs';
import ReportCharts from '@/components/reports/ReportCharts';
import ReportHeatmap from '@/components/reports/ReportHeatmap';
import RecentActivityTable from '@/components/reports/RecentActivityTable';
import { Grid } from '@mui/material';

export default function Page() {

  return (
    <AdminLayout>
      <Box className="flex">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12}}>
            <ReportKPIs />
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 8}}>
            <ReportCharts />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4}}>
            <ReportHeatmap />
          </Grid>
          <Grid size={{ xs: 12}}>
            <RecentActivityTable />
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}

import AdminLayout from '@/components/layout/AdminLayout';

import { Grid, Paper, Typography } from '@mui/material';
import ProjectsKPIs from '@/components/projects/ProjectsKPIs';
import ProjectSummaryChart from '@/components/projects/ProjectSummaryChart';
import ProjectsList from '@/components/projects/ProjectsList';

export default function Page() {

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Projects Overview
      </Typography>
      <Grid container spacing={3}>
        {/* KPIs Section */}
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}><ProjectsKPIs />
        </Grid>
        
        {/* Charts Section */}
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2, height: 400 }}>
            <ProjectSummaryChart />
          </Paper>
        </Grid>
        
        {/* Projects List Table */}
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <ProjectsList />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

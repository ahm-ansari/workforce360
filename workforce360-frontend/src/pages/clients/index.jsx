// pages/clients/index.js
import { Grid, Paper, Tab } from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import ClientOverviewCards from '@/components/clients/ClientOverviewCards';
import StaffListTable from '@/components/clients/StaffListTable';
import InvoicingTable from '@/components/clients/InvoicingTable';
import DashboardLayout from '@/components/clients/DashboardLayout';
import TabLayout from '@/components/clients/TabLayout';


export default function ClientDashboardPage() {
  return (
    <AdminLayout title="Client Dashboard">
      <TabLayout />
        <Grid container spacing={3}>
          <ClientOverviewCards />
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Paper sx={{ p: 2 }}>
              <StaffListTable />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Paper sx={{ p: 2 }}>
              <InvoicingTable />
            </Paper>
          </Grid>
        </Grid>
    </AdminLayout>
  );
}

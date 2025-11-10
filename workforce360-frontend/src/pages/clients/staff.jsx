// pages/clients/staff.js
import { Paper } from '@mui/material';
import StaffListTable from '@/components/clients/StaffListTable';
import AdminLayout from '@/components/layout/AdminLayout';
import TabLayout from '@/components/clients/TabLayout';

export default function StaffPage() {
  return (
    
        <AdminLayout title="Client Dashboard">
          <TabLayout />
    <Paper sx={{ p: 2 }}>
      <StaffListTable />
    </Paper>
    </AdminLayout>
  );
}

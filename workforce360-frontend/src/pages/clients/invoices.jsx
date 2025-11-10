// pages/clients/invoices.js
import { Paper } from '@mui/material';
import InvoicingTable from '@/components/clients/InvoicingTable';
import AdminLayout from '@/components/layout/AdminLayout';
import TabLayout from '@/components/clients/TabLayout';


export default function InvoicesPage() {
  return (
    
        <AdminLayout title="Client Dashboard">
          <TabLayout />
    <Paper sx={{ p: 2 }}>
      <InvoicingTable />
    </Paper>
    </AdminLayout>
  );
}

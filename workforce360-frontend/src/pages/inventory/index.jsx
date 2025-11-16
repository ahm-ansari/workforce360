import { Typography, Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import InventoryKPIs from '@/components/inventory/InventoryKPIs';
import InventoryTable from '@/components/inventory/InventoryTable';
import { Grid } from '@mui/material';

export default function Page() {

  return (
    <AdminLayout>
      <Box className="flex">
        <Grid container spacing={2}>
          <Grid size={{xs: 12}}>
            <InventoryKPIs />
          </Grid>
          <Grid size={{xs: 12}}>
            <InventoryTable />
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}

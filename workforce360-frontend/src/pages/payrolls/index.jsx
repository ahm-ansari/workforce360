import { Typography, Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';

export default function Page() {

  return (
    <AdminLayout>
      <Box className="flex">
        <Typography variant="h4" gutterBottom>
          Page Under Development
        </Typography>
      </Box>
    </AdminLayout>
  );
}

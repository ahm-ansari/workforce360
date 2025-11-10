import '@/app/globals.css';
import { Roboto } from 'next/font/google';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Grid, Paper, Button, Card } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CircularProgress, Alert} from '@mui/material';
import axiosInstance from "../utils/axiosInstance";
import AdminLayout from '@/components/layout/AdminLayout';

import { usePathname } from 'next/navigation'; // Import to track active page

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});



// Example of a reusable Stat Card component
function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
           {icon} {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}



export default function DashboardPage() {
  const pathname = usePathname(); // Get the current URL path
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [keypis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
    } else if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchKPIs = async () => {
      try {
        const res = await axiosInstance.get("/kpi/summary/");
        setKpis(res.data);
      } catch (err) {
        console.error("Failed to fetch KPI data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading)
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      );
  
    if (error)
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Alert severity="error">{error}</Alert>
        </Box>
      );

  return (
    <AdminLayout title="Dashboard" user={user}>
      <Typography variant="h5" gutterBottom>Overview</Typography>
      <Grid container spacing={2}>  {/* Grid container from MUI styles  with full width and grid items are evenly distrubuted */}
        {/* Example Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard title="Total Employees" value={keypis?.total_employees ?? "N/A"} icon={<i className="fa fa-user"></i>} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard title="Active Employees" value={keypis?.active_employees ?? "N/A"} icon={<i className="fa fa-user"></i>} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard title="Total Clients" value={keypis?.total_clients ?? "N/A"} icon={<i className="fa fa-user"></i>} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard title="Total Projects" value={keypis?.total_projects ?? "N/A"} icon={<i className="fa fa-user"></i>} />
        </Grid>
      </Grid>

      <Box sx={{display: 'flex', flexDirection: 'row', flexGrow: 1, bgcolor: 'background.paper', p: 2 ,  
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', mb: 2, mt: 2}}>

        <Grid container spacing={3} sx={{ width: '60%', p: 2 }} >
          {/* Main Content Area */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 5 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
              elevation={2}
            >
              <Typography variant="h6">Incident Hotspots (Map)</Typography>
              {/* Placeholder for a map component */}
              <div className="flex-grow flex items-center justify-center text-gray-400">
                [Map Component Placeholder]
              </div>
            </Paper>
          </Grid>

          {/* Side Panel */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 5 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
              elevation={2}
            >
              <Typography variant="h6">Recent Activity</Typography>
              {/* Placeholder for an activity feed */}
              <ul className="mt-4 space-y-2">
                <li className="text-sm">Guard J. Doe started patrol at Site A.</li>
                <li className="text-sm">Incident #1024 reported at Site B.</li>
                <li className="text-sm">Guard A. Smith completed shift.</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout >
  );
}
import '@/app/globals.css';
import { Roboto } from 'next/font/google';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Grid, Paper, Button, Card } from "@mui/material";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

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
            {title}
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  };


  return (
    <DashboardLayout>
      <Box className="flex" >
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, p: 2 , 
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', mb: 2, mt: 2}}>      
        <Grid container sx={{
           justifyContent: 'space-evenly', gap: 1

        }}>  {/* Grid container from MUI styles  with full width and grid items are evenly distrubuted */}

          {/* Example Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140}}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Employees
              </Typography>
              <Typography component="p" variant="h4">
                150
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Projects
              </Typography>
              <Typography component="p" variant="h4">
                25
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140}}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Clients
              </Typography>
              <Typography component="p" variant="h4">
                50
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140}}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Revenue
              </Typography>
              <Typography component="p" variant="h4">
                $12,500
              </Typography>
            </Paper>
          </Grid>
        </Grid>

      </Box>

      <Box sx={{display: 'flex', flexDirection: 'row', flexGrow: 1, bgcolor: 'background.paper', p: 2 ,  
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', mb: 2, mt: 2}}>

        {/* Grid container from MUI */}
        <Grid container sx={{
           justifyContent: 'space-evenly', gap: 1,  width: '30%', p: 2

        }}>
          {/* Grid items */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 5 }}>
            <StatCard title="Active Guards" value="42" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 5 }}>
            <StatCard title="Total Incidents" value="500" />
          </Grid> 
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 5}}>
            <StatCard title="Open Incidents" value="3" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 5 }}>
            <StatCard title="Sites Patrolled" value="12" />
          </Grid>
        </Grid>
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
    </DashboardLayout >
  );
}
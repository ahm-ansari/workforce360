// app/jobs/page.tsx
import React from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { JobOpening} from '@/types';
import Grid from '@mui/material/Grid';
import AdminLayout from '@/components/layout/AdminLayout';
import DashboardCards from '@/components/jobs/DashboardCards';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/types/user';
import RecruitmentFunnelChart from '@/components/jobs/RecruitmentFunnelChart';
import TimeToFillTrend from '@/components/jobs/TimeToFillTrend';
import JobListingTable from '@/components/jobs/JobListingTable';
import Paper from '@mui/material/Paper';



const fetcher = (url: string) => api.get(url).then(r => r.data);

export default function JobsPage() {
  
  const router = useRouter();
  const [user_data, setUser] = useState(null);
  const { data, error } = useSWR<JobOpening[]>('/jobs/', fetcher);
  const user = useSWR<User[]>('/login/', fetcher)

  useEffect(() => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token) {
        router.push("/login");
      } else if (userData) {
        setUser(JSON.parse(userData));
      }
    }, []);

  if (error) {
    return (
      <AdminLayout title="Job Applications" user={user_data}>
        <Box className="flex justify-center items-center h-screen" color="error.main">Failed to load jobs</Box>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout title="Job Applications" user={user_data}>
        <Box className="flex justify-center items-center h-screen" color="info.main">Loading...</Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Job Applications" user={user_data}>
      <Grid container spacing={3}>
      {/* KPI Cards */}
      <DashboardCards />
      {/* Charts */}
      <Grid size={{xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <RecruitmentFunnelChart />
        </Paper>
      </Grid>
      <Grid size={{xs: 12, md: 6 }}>
          <TimeToFillTrend />
      </Grid>

      {/* Job Listing Table */}
      <Grid size={{xs: 12 }}>
          <JobListingTable />
      </Grid>
    </Grid>
    </AdminLayout>
  );
}

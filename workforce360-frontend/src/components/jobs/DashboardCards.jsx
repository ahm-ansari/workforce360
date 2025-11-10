import { Grid, Card, CardContent, Typography } from '@mui/material';
import { CardUX } from "@/components/ui/card";
import EngineeringIcon from '@mui/icons-material/Engineering';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function DashboardCards() {
  const kpis = [
    { title: 'Total Open Jobs', value: 45, icon: <EngineeringIcon sx={{fontSize:'48px'}}/>, color: '#e0f7fa' },
    { title: 'Average Time-to-Fill', value: '32 days', icon: <UpdateIcon sx={{fontSize:'48px'}}/> ,  color: '#ffecb3'},
    { title: 'Offer Acceptance Rate', value: '91%', icon: <TrendingUpIcon sx={{fontSize:'48px'}} /> ,  color: '#e8f5e9'},
    { title: 'Last Month Hires', value: 8, icon: <CalendarMonthIcon sx={{fontSize:'48px'}}/>,  color: '#f3e5f5' },
  ];
  
  return (
    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
      <Grid container spacing={4}>
        {kpis.map((kpi) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={kpi.title}>
            <CardUX title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color}/>
          </Grid>        
        ))}
      </Grid>
    </Grid>
  );
}
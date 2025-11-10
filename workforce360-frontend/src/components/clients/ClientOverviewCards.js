// components/ClientOverviewCards.js
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { CardUX } from "@/components/ui/card";
import { CalendarMonthTwoTone, InvertColorsOffOutlined, MoneyOff, PeopleOutline } from '@mui/icons-material';

export default function ClientOverviewCards() {
  // Sample data for the KPI cards. In a real app, this would be fetched dynamically.
  const kpis = [
    { title: 'Active Staff', value: 12 , icon: <PeopleOutline/>, color: '#e0f7fa'},
    { title: 'Total Invoices', value: 3, icon: <InvertColorsOffOutlined/>, color: '#ffecb3'},
    { title: 'Outstanding Balance', value: '$ 1,500', icon: <MoneyOff/>, color: '#e8f5e9'},
    { title: 'Hours This Month', value: 160 , icon: <CalendarMonthTwoTone/>, color: '#ffe082'},
  ];
  return (
    <Grid size={{xs: 12, sm: 12, md: 12}}>
      <Grid container spacing={3}>
        {kpis.map((kpi) => (
          <Grid size={{xs: 12, sm: 6, md: 3}} key={kpi.title}>
            <CardUX title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color}/>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

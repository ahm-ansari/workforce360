// components/projects/ProjectsKPIs.js
import { Grid, Card, CardContent, Typography } from '@mui/material';

const kpis = [
  { title: 'Total Projects', value: 50 },
  { title: 'Active Projects', value: 35 },
  { title: 'Completion Rate', value: '85%' },
  { title: 'Overdue Projects', value: 5 },
];

export default function ProjectsKPIs() {
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        {kpis.map((kpi) => (
          <Grid size={{xs: 12, sm: 6, md: 3}} item xs={12} sm={6} md={3} key={kpi.title}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {kpi.title}
                </Typography>
                <Typography variant="h4">{kpi.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

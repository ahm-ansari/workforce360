import { Grid, Card, CardContent, Typography } from '@mui/material';
import {CardUX} from "@/components/ui/card";

const kpis = [
  { title: 'Total Revenue', value: '$250,000' },
  { title: 'Outstanding Payables', value: '$12,000' },
  { title: 'Receivables Due', value: '$8,500' },
  { title: 'Net Profit', value: '$50,000' },
];

export default function AccountsKPIs() {
  return (
    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
      <Grid container spacing={3}>
        {kpis.map((kpi) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={kpi.title}>
            <CardUX title={kpi.title} value={kpi.value} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

// /components/reports/ReportHeatmap.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { reportsMock } from '@/utils/mockReportsData';


export default function ReportHeatmap() {
return (
<Card>
<CardContent>
<Typography variant="h6">Monthly Activity Heatmap (2025)</Typography>
<div style={{ marginTop: 12 }}>
<CalendarHeatmap startDate={new Date('2025-01-01')} endDate={new Date('2025-12-31')} values={reportsMock.heatmapValues} />
</div>
</CardContent>
</Card>
);
}
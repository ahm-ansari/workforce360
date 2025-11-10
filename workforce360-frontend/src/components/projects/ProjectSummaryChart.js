// components/projects/ProjectSummaryChart.js
'use client';
import { Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', completed: 10, overdue: 2 },
  { month: 'Feb', completed: 15, overdue: 1 },
  { month: 'Mar', completed: 8, overdue: 3 },
  { month: 'Apr', completed: 20, overdue: 4 },
];

export default function ProjectSummaryChart() {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Project Summary
      </Typography>
      <Box sx={{ height: '100%' }}>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill={theme.palette.success.main} />
            <Bar dataKey="overdue" fill={theme.palette.error.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
}

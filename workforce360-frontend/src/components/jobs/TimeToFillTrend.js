'use client';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', 'Time to Fill': 35 },
  { name: 'Feb', 'Time to Fill': 32 },
  { name: 'Mar', 'Time to Fill': 28 },
  { name: 'Apr', 'Time to Fill': 30 },
  { name: 'May', 'Time to Fill': 26 },
  { name: 'Jun', 'Time to Fill': 25 },
];

export default function TimeToFillTrend() {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Time to Fill Trend
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Time to Fill"
              stroke={theme.palette.primary.main}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
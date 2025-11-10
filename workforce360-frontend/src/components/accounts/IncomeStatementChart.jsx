'use client';
import { Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
];

export default function IncomeStatementChart() {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h6" gutterBottom>Income vs Expenses</Typography>
      <Box sx={{ height: '100%' }}>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill={theme.palette.success.main} />
            <Bar dataKey="expenses" fill={theme.palette.error.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
}

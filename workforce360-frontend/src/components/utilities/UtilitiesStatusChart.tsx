// /components/utilities/UtilitiesStatusChart.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { utilitiesMock } from '../../utils/mockUtilitiesData';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function UtilitiesStatusChart() {
return (
<Card>
<CardContent>
<Typography variant="h6" gutterBottom>System Status</Typography>
<div style={{ width: '100%', height: 300 }}>
<ResponsiveContainer>
<PieChart>
<Pie data={utilitiesMock.statusChart} dataKey="value" nameKey="name" outerRadius={100} label>
{utilitiesMock.statusChart.map((entry, index) => (
<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
</Pie>
<Legend />
</PieChart>
</ResponsiveContainer>
</div>
</CardContent>
</Card>
);
}
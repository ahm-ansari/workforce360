// /components/ChartSection.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';


const lineData = [
    { date: '2025-01', employees: 240 },
    { date: '2025-02', employees: 255 },
    { date: '2025-03', employees: 262 },
    { date: '2025-04', employees: 275 },
    { date: '2025-05', employees: 290 },
    { date: '2025-06', employees: 300 },
    { date: '2025-07', employees: 312 },
    { date: '2025-08', employees: 320 },
    { date: '2025-09', employees: 325 },
    { date: '2025-10', employees: 328 },
];


const barData = [
    { name: 'Engineering', value: 120 },
    { name: 'Sales', value: 60 },
    { name: 'Design', value: 25 },
    { name: 'HR', value: 18 },
    { name: 'QA', value: 35 },
];

const pieData = [
    { name: 'Full-time', value: 260 },
    { name: 'Contract', value: 40 },
    { name: 'Intern', value: 28 },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];


export default function ChartSection() {
    return (
        <div style={{ display: 'grid', gap: 16 }}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Employee Growth (monthly)</Typography>
                    <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="employees" stroke="#1976d2" strokeWidth={3} dot />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>


            <div style={{ display: 'flex', gap: 16 }}>
                <Card style={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6">Department Distribution</Typography>
                        <div style={{ width: '100%', height: 220 }}>
                            <ResponsiveContainer>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#1976d2" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>


                <Card style={{ width: 320 }}>
                    <CardContent>
                        <Typography variant="h6">Contract Type</Typography>
                        <div style={{ width: '100%', height: 180 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} label>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
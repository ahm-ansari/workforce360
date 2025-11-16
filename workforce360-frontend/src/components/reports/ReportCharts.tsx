// /components/reports/ReportCharts.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { reportsMock } from '../../utils/mockReportsData';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function ReportCharts() {
const { revenueTrend, jobsByDept, contractTypes } = reportsMock;
return (
    <div style={{ display: 'grid', gap: 16 }}>
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Revenue Trend (Monthly)</Typography>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} dot />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>


        <div style={{ display: 'flex', gap: 16 }}>
            <Card style={{ flex: 1 }}>
                <CardContent>
                    <Typography variant="h6">Jobs by Department</Typography>
                    <div style={{ width: '100%', height: 240 }}>
                        <ResponsiveContainer>
                            <BarChart data={jobsByDept}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="department" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#1976d2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>


            <Card style={{ width: 320 }}>
                <CardContent>
                    <Typography variant="h6">Contract Types</Typography>
                    <div style={{ width: '100%', height: 240 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={contractTypes} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                                    {contractTypes.map((entry, index) => (
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
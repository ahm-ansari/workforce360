'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider,
    IconButton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ConstructionIcon from '@mui/icons-material/Construction';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '@/lib/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recentTasks, setRecentTasks] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dashRes, tasksRes] = await Promise.all([
                api.get('users/dashboard/'),
                api.get('tasks/tasks/'),
            ]);
            setData(dashRes.data);
            setRecentTasks(tasksRes.data?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && !data) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const statCards = [
        { title: 'Total Employees', value: data?.employees?.total || 0, icon: <PeopleIcon />, color: '#1976d2' },
        { title: 'Revenue', value: `$${data?.sales?.total_revenue?.toLocaleString() || 0}`, icon: <AttachMoneyIcon />, color: '#2e7d32' },
        { title: 'Pending Tasks', value: data?.tasks?.pending || 0, icon: <TaskIcon />, color: '#ed6c02' },
        { title: 'Active Jobs', value: data?.recruitment?.active || 0, icon: <WorkIcon />, color: '#9c27b0' },
        { title: 'Maintenance', value: data?.cafm?.open_requests || 0, icon: <ConstructionIcon />, color: '#d32f2f' },
        { title: 'Active Projects', value: data?.projects?.active || 0, icon: <BusinessCenterIcon />, color: '#0288d1' },
    ];

    const deptData = data?.employees?.by_department?.map((d: any) => ({
        name: d.name,
        value: d.employee_count
    })) || [];

    const taskChartData = [
        { name: 'Pending', count: data?.tasks?.pending || 0 },
        { name: 'Completed', count: data?.tasks?.completed || 0 },
    ];

    return (
        <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="600" color="primary">
                    Executive Dashboard
                </Typography>
                <IconButton onClick={fetchData} color="primary">
                    <RefreshIcon />
                </IconButton>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Box sx={{
                                            p: 1,
                                            borderRadius: '8px',
                                            bgcolor: `${stat.color}15`,
                                            color: stat.color,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {stat.icon}
                                        </Box>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.title}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Task Performance
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#3f51b5" radius={[4, 4, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Department Distribution
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deptData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deptData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Detailed Info Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Recent Tasks
                        </Typography>
                        <List>
                            {recentTasks.map((task, i) => (
                                <Box key={task.id}>
                                    <ListItem disableGutters>
                                        <ListItemText
                                            primary={task.title}
                                            secondary={`Status: ${task.status}`}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            color={task.priority === 'HIGH' ? 'error' : 'default'}
                                            variant="outlined"
                                        />
                                    </ListItem>
                                    {i < recentTasks.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Sales Pipeline
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Sent Quotations</Typography>
                                <Typography fontWeight="bold">{data?.sales?.quotations?.pending}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Accepted Quotations</Typography>
                                <Typography fontWeight="bold" color="success.main">{data?.sales?.quotations?.accepted}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total Revenue</Typography>
                                <Typography variant="h6" color="primary">${data?.sales?.total_revenue?.toLocaleString()}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Facility Management
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {data?.cafm?.by_priority?.map((p: any) => (
                                <Box key={p.priority} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography>{p.priority} Priority</Typography>
                                    <Chip label={p.count} size="small" />
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Total Open Requests</Typography>
                                <Typography fontWeight="bold">{data?.cafm?.open_requests}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

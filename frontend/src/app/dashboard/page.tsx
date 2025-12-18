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
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '@/lib/axios';

interface DashboardStats {
    totalEmployees: number;
    activeTasks: number;
    pendingLeaves: number;
    activeJobs: number;
    activeVisitors: number;
    pendingReimbursements: number;
}

interface RecentActivity {
    id: number;
    type: string;
    title: string;
    description: string;
    timestamp: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalEmployees: 0,
        activeTasks: 0,
        pendingLeaves: 0,
        activeJobs: 0,
        activeVisitors: 0,
        pendingReimbursements: 0,
    });
    const [recentTasks, setRecentTasks] = useState<any[]>([]);
    const [recentLeaves, setRecentLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, tasksRes, leavesRes, jobsRes, visitorsRes, reimbursementsRes] = await Promise.all([
                    api.get('employees/stats/').catch(() => ({ data: { total_employees: 0, by_department: {} } })),
                    api.get('tasks/tasks/').catch(() => ({ data: [] })),
                    api.get('hr/leaves/').catch(() => ({ data: [] })),
                    api.get('recruitment/jobs/').catch(() => ({ data: [] })),
                    api.get('visitors/visitors/?checked_in=true').catch(() => ({ data: [] })),
                    api.get('finance/reimbursements/').catch(() => ({ data: [] })),
                ]);

                setStats({
                    totalEmployees: statsRes.data?.total_employees || 0,
                    activeTasks: tasksRes.data?.filter((t: any) => t.status !== 'COMPLETED').length || 0,
                    pendingLeaves: leavesRes.data?.filter((l: any) => l.status === 'PENDING').length || 0,
                    activeJobs: jobsRes.data?.filter((j: any) => j.status === 'PUBLISHED').length || 0,
                    activeVisitors: visitorsRes.data?.length || 0,
                    pendingReimbursements: reimbursementsRes.data?.filter((r: any) => r.status === 'PENDING').length || 0,
                });

                setDepartmentStats(statsRes.data?.by_department || {});
                setRecentTasks(tasksRes.data?.slice(0, 5) || []);
                setRecentLeaves(leavesRes.data?.slice(0, 5) || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const statCards = [
        { title: 'Total Employees', value: stats.totalEmployees, icon: <PeopleIcon />, color: '#1976d2' },
        { title: 'Active Tasks', value: stats.activeTasks, icon: <TaskIcon />, color: '#2e7d32' },
        { title: 'Pending Leaves', value: stats.pendingLeaves, icon: <EventIcon />, color: '#ed6c02' },
        { title: 'Active Jobs', value: stats.activeJobs, icon: <WorkIcon />, color: '#9c27b0' },
        { title: 'Active Visitors', value: stats.activeVisitors, icon: <PersonAddIcon />, color: '#d32f2f' },
        { title: 'Pending Reimbursements', value: stats.pendingReimbursements, icon: <AttachMoneyIcon />, color: '#0288d1' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'success';
            case 'REJECTED':
                return 'error';
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard Overview
            </Typography>
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 2 }} key={index}>
                        <Card sx={{ height: '100%', bgcolor: stat.color, color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold">
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ fontSize: 60, opacity: 0.3 }}>{stat.icon}</Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* Recent Activities */}
            <Grid container spacing={3}>
                {/* Recent Tasks */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Tasks
                        </Typography>
                        <List>
                            {recentTasks.length === 0 ? (
                                <ListItem>
                                    <ListItemText primary="No tasks available" />
                                </ListItem>
                            ) : (
                                recentTasks.map((task) => (
                                    <ListItem key={task.id} sx={{ borderBottom: '1px solid #eee' }}>
                                        <ListItemText
                                            primary={task.title}
                                            secondary={
                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                    <Chip label={task.status} size="small" color={getStatusColor(task.status) as any} />
                                                    <Chip label={task.priority} size="small" variant="outlined" />
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Paper>
                </Grid>
                {/* Recent Leave Requests */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Leave Requests
                        </Typography>
                        <List>
                            {recentLeaves.length === 0 ? (
                                <ListItem>
                                    <ListItemText primary="No leave requests" />
                                </ListItem>
                            ) : (
                                recentLeaves.map((leave) => (
                                    <ListItem key={leave.id} sx={{ borderBottom: '1px solid #eee' }}>
                                        <ListItemText
                                            primary={`${leave.employee_name || 'Employee'} - ${leave.leave_type_name || 'Leave'}`}
                                            secondary={
                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                    <Chip label={leave.status} size="small" color={getStatusColor(leave.status) as any} />
                                                    <Typography variant="caption">
                                                        {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Department Distribution */}
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Employees by Department
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(departmentStats).map(([dept, count]) => (
                        <Grid size={{ xs: 6, md: 3 }} key={dept}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: '#f5f5f5',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h4" color="primary">
                                    {count}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {dept}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                    {Object.keys(departmentStats).length === 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                                No department data available
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
}

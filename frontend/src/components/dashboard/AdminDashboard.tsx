'use client';

import { Grid } from '@mui/material';
import StatCard from '@/components/dashboard/StatCard';
import ListWidget from '@/components/dashboard/ListWidget';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function AdminDashboard() {
    // Mock data - will be replaced with API calls later
    const stats = {
        totalEmployees: 156,
        activeTasks: 42,
        pendingLeaves: 8,
        monthlyPayroll: '₹12,45,000',
    };

    const recentActivities = [
        { id: 1, primary: 'New employee onboarded', secondary: 'John Doe - Software Engineer', status: 'New', statusColor: 'success' as const },
        { id: 2, primary: 'Leave approved', secondary: 'Jane Smith - 3 days', status: 'Approved', statusColor: 'info' as const },
        { id: 3, primary: 'Task completed', secondary: 'Project Alpha - Phase 1', status: 'Done', statusColor: 'success' as const },
    ];

    const departmentStats = [
        { id: 1, primary: 'Engineering', secondary: '45 employees' },
        { id: 2, primary: 'Sales', secondary: '32 employees' },
        { id: 3, primary: 'HR', secondary: '12 employees' },
        { id: 4, primary: 'Finance', secondary: '18 employees' },
    ];

    return (
        <Grid container spacing={3}>
            {/* Stats Row */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                    color="primary.main"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    title="Active Tasks"
                    value={stats.activeTasks}
                    icon={<TaskIcon sx={{ fontSize: 40 }} />}
                    color="info.main"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    title="Pending Leaves"
                    value={stats.pendingLeaves}
                    icon={<EventNoteIcon sx={{ fontSize: 40 }} />}
                    color="warning.main"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    title="Monthly Payroll"
                    value={stats.monthlyPayroll}
                    icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
                    color="success.main"
                />
            </Grid>

            {/* Lists Row */}
            <Grid size={{ xs: 12, md: 6 }}>
                <ListWidget
                    title="Recent Activities"
                    items={recentActivities}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <ListWidget
                    title="Department Overview"
                    items={departmentStats}
                />
            </Grid>
        </Grid>
    );
}

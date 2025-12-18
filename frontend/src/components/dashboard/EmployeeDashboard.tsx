'use client';

import { Grid } from '@mui/material';
import StatCard from '@/components/dashboard/StatCard';
import ListWidget from '@/components/dashboard/ListWidget';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function EmployeeDashboard() {
    const stats = {
        myTasks: 8,
        completedTasks: 24,
        leaveBalance: 12,
    };

    const myTasks = [
        { id: 1, primary: 'Complete project documentation', secondary: 'Due: Tomorrow', status: 'High', statusColor: 'error' as const },
        { id: 2, primary: 'Review pull request #123', secondary: 'Due: Today', status: 'Medium', statusColor: 'warning' as const },
        { id: 3, primary: 'Team meeting preparation', secondary: 'Due: Next week', status: 'Low', statusColor: 'info' as const },
    ];

    const recentAnnouncements = [
        { id: 1, primary: 'Company Holiday', secondary: 'Dec 25 - Christmas Day' },
        { id: 2, primary: 'Team Building Event', secondary: 'Jan 15 - Annual Outing' },
        { id: 3, primary: 'Performance Reviews', secondary: 'Starting next month' },
    ];

    return (
        <Grid container spacing={3}>
            {/* Stats Row */}
            <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                    title="My Tasks"
                    value={stats.myTasks}
                    icon={<TaskIcon sx={{ fontSize: 40 }} />}
                    color="primary.main"
                    subtitle="Active assignments"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                    title="Completed"
                    value={stats.completedTasks}
                    icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
                    color="success.main"
                    subtitle="This month"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                    title="Leave Balance"
                    value={stats.leaveBalance}
                    icon={<EventAvailableIcon sx={{ fontSize: 40 }} />}
                    color="info.main"
                    subtitle="Days remaining"
                />
            </Grid>

            {/* Lists Row */}
            <Grid size={{ xs: 12, md: 6 }}>
                <ListWidget
                    title="My Tasks"
                    items={myTasks}
                    emptyMessage="No tasks assigned"
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <ListWidget
                    title="Announcements"
                    items={recentAnnouncements}
                    emptyMessage="No announcements"
                />
            </Grid>
        </Grid>
    );
}

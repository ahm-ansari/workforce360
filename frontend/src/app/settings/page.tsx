'use client';

import { Box, Typography, Grid, Card, CardContent, CardActionArea, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';

interface NavCard {
    title: string;
    description: string;
    icon: React.ReactElement;
    path: string;
    color: string;
}

const navCards: NavCard[] = [
    {
        title: 'Roles',
        description: 'Manage user roles and permissions',
        icon: <AdminPanelSettingsIcon sx={{ fontSize: 48 }} />,
        path: '/roles',
        color: '#1976d2',
    },
    {
        title: 'Departments',
        description: 'Manage organizational departments',
        icon: <BusinessIcon sx={{ fontSize: 48 }} />,
        path: '/departments',
        color: '#2e7d32',
    },
    {
        title: 'Designations',
        description: 'Manage job designations and titles',
        icon: <BadgeIcon sx={{ fontSize: 48 }} />,
        path: '/designations',
        color: '#ed6c02',
    },
    {
        title: 'Employees',
        description: 'Manage employee records and profiles',
        icon: <PeopleIcon sx={{ fontSize: 48 }} />,
        path: '/employees',
        color: '#9c27b0',
    },
    {
        title: 'Tasks',
        description: 'Manage tasks and assignments',
        icon: <WorkIcon sx={{ fontSize: 48 }} />,
        path: '/tasks',
        color: '#0288d1',
    },
    {
        title: 'Leave Management',
        description: 'Manage leave requests and approvals',
        icon: <EventIcon sx={{ fontSize: 48 }} />,
        path: '/leave',
        color: '#d32f2f',
    },
    {
        title: 'Payroll',
        description: 'Manage payroll and compensation',
        icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />,
        path: '/payroll',
        color: '#388e3c',
    },
    {
        title: 'Documents',
        description: 'Manage company documents and files',
        icon: <DescriptionIcon sx={{ fontSize: 48 }} />,
        path: '/documents',
        color: '#f57c00',
    },
];

export default function SettingsPage() {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    System Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Centralized hub for managing all system configurations and master data
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {navCards.map((card) => (
                    <Grid key={card.path} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => handleNavigate(card.path)}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    p: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: card.color,
                                        color: 'white',
                                        mb: 2,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                                <CardContent sx={{ p: 0, width: '100%' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                    Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    • Use the search functionality in each module to quickly find records
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    • Click the edit icon to modify existing records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • All changes are saved immediately and reflected across the system
                </Typography>
            </Paper>
        </Box>
    );
}

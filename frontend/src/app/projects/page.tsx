'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import api from '@/services/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`project-tabpanel-${index}`}
            aria-labelledby={`project-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function ProjectsPage() {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [solutions, setSolutions] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projectsRes, servicesRes, solutionsRes] = await Promise.all([
                api.get('projects/projects/'),
                api.get('projects/services/'),
                api.get('projects/solutions/'),
            ]);
            setProjects(projectsRes.data);
            setServices(servicesRes.data);
            setSolutions(solutionsRes.data);
        } catch (error) {
            console.error('Error fetching project data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLANNING': return 'info';
            case 'IN_PROGRESS': return 'primary';
            case 'ON_HOLD': return 'warning';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Projects & Services
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        background: 'linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)',
                        color: 'white',
                        px: 3
                    }}
                >
                    Create New
                </Button>
            </Box>

            <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafc' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="project management tabs"
                        sx={{
                            '& .MuiTab-root': { fontWeight: 600 },
                        }}
                    >
                        <Tab icon={<WorkIcon sx={{ mr: 1 }} />} iconPosition="start" label="Projects" />
                        <Tab icon={<BusinessIcon sx={{ mr: 1 }} />} iconPosition="start" label="Services" />
                        <Tab icon={<LightbulbIcon sx={{ mr: 1 }} />} iconPosition="start" label="Solutions" />
                    </Tabs>
                </Box>

                <Box sx={{ p: 3 }}>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            {projects.map((project) => (
                                <Grid xs={12} md={6} lg={4} key={project.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {project.name}
                                                </Typography>
                                                <Chip
                                                    label={project.status}
                                                    size="small"
                                                    color={getStatusColor(project.status) as any}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Company: <strong>{project.company_name}</strong>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                Service: {project.service_name || 'N/A'}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Budget: ₹{Number(project.budget).toLocaleString()}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Timeline: {project.start_date} to {project.end_date || 'Ongoing'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                                            <Tooltip title="Edit">
                                                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                            </Tooltip>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                            {projects.length === 0 && (
                                <Grid xs={12}>
                                    <Box sx={{ textAlign: 'center', py: 5 }}>
                                        <Typography color="text.secondary">No projects found.</Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CustomTabPanel>

                    <CustomTabPanel value={tabValue} index={1}>
                        <Grid container spacing={3}>
                            {services.map((service) => (
                                <Grid xs={12} md={6} lg={4} key={service.id}>
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {service.name}
                                            </Typography>
                                            <Chip label={service.category} size="small" sx={{ mb: 2 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {service.description}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle2" color="primary">
                                                    Pricing: {service.pricing_type}
                                                </Typography>
                                                {service.base_price && (
                                                    <Typography variant="body2">
                                                        Base Price: ₹{Number(service.base_price).toLocaleString()}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CustomTabPanel>

                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid container spacing={3}>
                            {solutions.map((solution) => (
                                <Grid xs={12} md={6} lg={4} key={solution.id}>
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {solution.name}
                                            </Typography>
                                            <Chip label={solution.category} size="small" sx={{ mb: 2, color: 'white', bgcolor: '#6366f1' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {solution.description}
                                            </Typography>
                                            {solution.technology_stack && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="caption" fontWeight="bold">Tech Stack:</Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                        {solution.technology_stack.split(',').map((tech: string, i: number) => (
                                                            <Chip key={i} label={tech.trim()} size="small" variant="outlined" />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CustomTabPanel>
                </Box>
            </Paper>
        </Box>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Chip,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
    AutoAwesome as MATCH_ICON
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function StaffingRequestDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [matching, setMatching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`outsourcing/requests/${id}/`);
                setRequest(response.data);
            } catch (err) {
                console.error('Error fetching request details:', err);
                setError('Failed to load request details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleAImatch = async () => {
        setMatching(true);
        // Simulating AI matching logic
        // In a real app, this would call a specialized endpoint using NLP/Embedding search
        setTimeout(() => {
            const mockMatches = [
                { id: 1, name: 'John Doe', matching_score: 95, skills: 'Java, Spring, SQL', experience: '5 years' },
                { id: 2, name: 'Jane Smith', matching_score: 88, skills: 'Java, Microservices, AWS', experience: '4 years' },
                { id: 3, name: 'Robert Brown', matching_score: 75, skills: 'Java, React, PostgreSQL', experience: '3 years' },
            ];
            setMatches(mockMatches);
            setMatching(false);
        }, 1500);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!request) return <Alert severity="info">Request not found.</Alert>;

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>Back</Button>
                <Typography variant="h4" fontWeight={700}>{request.title}</Typography>
                <Chip label={request.status} color="primary" variant="outlined" />
            </Stack>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
                                {request.description}
                            </Typography>

                            <Typography variant="h6" fontWeight={600} gutterBottom>Required Skills</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                                {request.required_skills.split(',').map((skill: string) => (
                                    <Chip key={skill} label={skill.trim()} size="small" variant="outlined" />
                                ))}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Positions</Typography>
                                    <Typography variant="subtitle1" fontWeight={600}>{request.number_of_positions}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Experience</Typography>
                                    <Typography variant="subtitle1" fontWeight={600}>{request.experience_years} Years</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Proposed Rate</Typography>
                                    <Typography variant="subtitle1" fontWeight={600}>${request.proposed_rate}/hr</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Priority</Typography>
                                    <Typography variant="subtitle1" fontWeight={600}>{request.priority}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>AI Candidate Matching</Typography>
                                <Button
                                    startIcon={matching ? <CircularProgress size={16} /> : <MATCH_ICON />}
                                    variant="contained"
                                    size="small"
                                    onClick={handleAImatch}
                                    disabled={matching}
                                    sx={{
                                        backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                    }}
                                >
                                    {matching ? 'Matching...' : 'Find Matches'}
                                </Button>
                            </Stack>

                            {matches.length > 0 ? (
                                <List>
                                    {matches.map((match) => (
                                        <Paper key={match.id} sx={{ mb: 2, p: 1, border: '1px solid #eee' }} elevation={0}>
                                            <ListItem
                                                secondaryAction={
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<PersonAddIcon />}
                                                        onClick={() => router.push(`/outsourcing/staff/new?requestId=${id}&employeeId=${match.id}`)}
                                                    >
                                                        Assign
                                                    </Button>
                                                }
                                            >
                                                <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>{match.name[0]}</Avatar>
                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Typography variant="subtitle1" fontWeight={600}>{match.name}</Typography>
                                                            <Chip label={`${match.matching_score}% Match`} color="success" size="small" variant="outlined" />
                                                        </Stack>
                                                    }
                                                    secondary={`${match.experience} exp • Skills: ${match.skills}`}
                                                />
                                            </ListItem>
                                        </Paper>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
                                    <Typography variant="body2">Click "Find Matches" to use the AI engine to suggest candidates from your existing employee pool.</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 2, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Client Detail</Typography>
                            <Typography variant="subtitle1" fontWeight={700}>{request.client_name}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1}>
                                <Typography variant="body2"><strong>Status:</strong> {request.status}</Typography>
                                <Typography variant="body2"><strong>Requested by:</strong> {request.created_by_name}</Typography>
                                <Typography variant="body2"><strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}</Typography>
                                <Typography variant="body2"><strong>End Date:</strong> {request.end_date ? new Date(request.end_date).toLocaleDateString() : 'N/A'}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ mb: 2, borderRadius: 2 }}
                    >
                        Edit Request
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => router.push(`/outsourcing/staff/new?requestId=${id}`)}
                        sx={{ borderRadius: 2 }}
                    >
                        Manual Assignment
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

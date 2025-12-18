'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Job {
    id: number;
    title: string;
    status: string;
    candidates_count: number;
}

interface Candidate {
    id: number;
    name: string;
    job_title: string;
    status: string;
}

export default function RecruitmentDashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, candidatesRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recruitment/jobs/`).catch(() => ({ data: [] })),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recruitment/candidates/`).catch(() => ({ data: [] })),
                ]);
                setJobs(jobsRes.data || []);
                setCandidates(candidatesRes.data || []);
            } catch (err) {
                console.error('Recruitment dashboard fetch error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Recruitment Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Active Jobs */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Active Jobs</Typography>
                            <Button
                                variant="contained"
                                sx={{ mb: 2 }}
                                onClick={() => router.push('/recruitment/jobs/create')}
                            >
                                Create Job
                            </Button>
                            {jobs.filter(j => j.status === 'PUBLISHED').slice(0, 5).map((job) => (
                                <Box key={job.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography>{job.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {job.candidates_count} candidates
                                    </Typography>
                                </Box>
                            ))}
                            <Button sx={{ mt: 2 }} onClick={() => router.push('/recruitment/jobs')}>
                                View All Jobs
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Candidates */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Recent Candidates</Typography>
                            {candidates.slice(0, 5).map((candidate) => (
                                <Box key={candidate.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography>{candidate.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {candidate.job_title} - {candidate.status}
                                    </Typography>
                                </Box>
                            ))}
                            <Button sx={{ mt: 2 }} onClick={() => router.push('/recruitment/candidates')}>
                                View All Candidates
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Candidate {
    id: number;
    name: string;
    email: string;
    job_title: string;
    status: string;
    applied_date: string;
}

const STATUS_COLUMNS = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'];

export default function CandidatesPipeline() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/recruitment/candidates/`)
            .then((res) => setCandidates(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const getCandidatesByStatus = (status: string) => {
        return candidates.filter((c) => c.status === status);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Candidate Pipeline
            </Typography>

            <Grid container spacing={2}>
                {STATUS_COLUMNS.map((status) => (
                    <Grid size={{ xs: 12, md: 2 }} key={status}>
                        <Card sx={{ minHeight: 400, bgcolor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {status}
                                </Typography>
                                <Chip label={getCandidatesByStatus(status).length} size="small" sx={{ mb: 2 }} />
                                {getCandidatesByStatus(status).map((candidate) => (
                                    <Card key={candidate.id} sx={{ mb: 1, p: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {candidate.name}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            {candidate.job_title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(candidate.applied_date).toLocaleDateString()}
                                        </Typography>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

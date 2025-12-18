'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Chip,
    CircularProgress,
    Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Job {
    id: number;
    title: string;
    department_details: { name: string };
    status: string;
    posted_date: string;
    candidates_count: number;
}

export default function JobsList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/recruitment/jobs/`)
            .then((res) => setJobs(res.data))
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

    const statusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'success';
            case 'CLOSED':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Job Postings</Typography>
                <Button variant="contained" onClick={() => router.push('/recruitment/jobs/create')}>
                    Create Job
                </Button>
            </Box>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Posted Date</TableCell>
                            <TableCell>Candidates</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{job.department_details?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip label={job.status} color={statusColor(job.status) as any} />
                                </TableCell>
                                <TableCell>{new Date(job.posted_date).toLocaleDateString()}</TableCell>
                                <TableCell>{job.candidates_count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

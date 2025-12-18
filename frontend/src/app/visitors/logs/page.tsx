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
import api from '@/lib/axios';

interface Visitor {
    id: number;
    name: string;
    company: string;
    host_employee_name: string;
    check_in_time: string;
    check_out_time: string | null;
    is_checked_out: boolean;
}

export default function VisitorLogs() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVisitors = () => {
        api
            .get('visitors/visitors/')
            .then((res) => setVisitors(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleCheckOut = async (id: number) => {
        try {
            await api.post(`visitors/visitors/${id}/check_out/`);
            fetchVisitors();
        } catch (err) {
            console.error('Error checking out visitor:', err);
        }
    };

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
                Visitor Logs
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Host</TableCell>
                            <TableCell>Check-In</TableCell>
                            <TableCell>Check-Out</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visitors.map((visitor) => (
                            <TableRow key={visitor.id}>
                                <TableCell>{visitor.name}</TableCell>
                                <TableCell>{visitor.company}</TableCell>
                                <TableCell>{visitor.host_employee_name}</TableCell>
                                <TableCell>{new Date(visitor.check_in_time).toLocaleString()}</TableCell>
                                <TableCell>
                                    {visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={visitor.is_checked_out ? 'Checked Out' : 'Active'}
                                        color={visitor.is_checked_out ? 'default' : 'success'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {!visitor.is_checked_out && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleCheckOut(visitor.id)}
                                        >
                                            Check-Out
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

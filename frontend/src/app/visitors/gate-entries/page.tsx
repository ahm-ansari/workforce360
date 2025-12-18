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
} from '@mui/material';
import api from '@/lib/axios';

interface GateEntry {
    id: number;
    entry_type: string;
    visitor_name: string;
    employee_name: string;
    entry_time: string;
    exit_time: string | null;
    gate_number: string;
}

export default function GateEntries() {
    const [entries, setEntries] = useState<GateEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get('visitors/gate-entries/')
            .then((res) => setEntries(res.data))
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

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'VISITOR':
                return 'primary';
            case 'EMPLOYEE':
                return 'success';
            case 'VENDOR':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gate Entry Logs
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Gate</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Entry Time</TableCell>
                            <TableCell>Exit Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>Gate {entry.gate_number}</TableCell>
                                <TableCell>
                                    <Chip label={entry.entry_type} color={getTypeColor(entry.entry_type) as any} size="small" />
                                </TableCell>
                                <TableCell>{entry.visitor_name || entry.employee_name}</TableCell>
                                <TableCell>{new Date(entry.entry_time).toLocaleString()}</TableCell>
                                <TableCell>
                                    {entry.exit_time ? new Date(entry.exit_time).toLocaleString() : 'Active'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

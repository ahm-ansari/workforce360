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
import axios from 'axios';

interface Reimbursement {
    id: number;
    employee: { first_name: string; last_name: string };
    amount: string;
    description: string;
    status: string;
}

export default function ReimbursementList() {
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/reimbursements/`)
            .then((res) => setReimbursements(res.data))
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
            case 'APPROVED':
                return 'success';
            case 'REJECTED':
                return 'error';
            case 'PAID':
                return 'primary';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Reimbursements
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reimbursements.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>
                                    {r.employee.first_name} {r.employee.last_name}
                                </TableCell>
                                <TableCell>${r.amount}</TableCell>
                                <TableCell>{r.description}</TableCell>
                                <TableCell>
                                    <Chip label={r.status} color={statusColor(r.status) as any} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

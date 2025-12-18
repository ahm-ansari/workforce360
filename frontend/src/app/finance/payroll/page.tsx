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
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Payroll {
    id: number;
    employee: { first_name: string; last_name: string };
    month: number;
    year: number;
    net_salary: string;
    status: string;
}

export default function PayrollList() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/payrolls/`)
            .then((res) => setPayrolls(res.data))
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Payrolls
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Month / Year</TableCell>
                            <TableCell>Net Salary</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payrolls.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    {p.employee.first_name} {p.employee.last_name}
                                </TableCell>
                                <TableCell>
                                    {p.month}/{p.year}
                                </TableCell>
                                <TableCell>${p.net_salary}</TableCell>
                                <TableCell>{p.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

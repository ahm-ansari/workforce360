'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Transaction {
    id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
}

interface Payroll {
    id: number;
    employee: { first_name: string; last_name: string };
    month: number;
    year: number;
    net_salary: string;
    status: string;
}

interface Reimbursement {
    id: number;
    employee: { first_name: string; last_name: string };
    amount: string;
    status: string;
    description: string;
}

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txRes, payrollRes, reimbRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/transactions/`).catch(() => ({ data: [] })),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/payrolls/`).catch(() => ({ data: [] })),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/reimbursements/`).catch(() => ({ data: [] })),
                ]);
                setTransactions(txRes.data || []);
                setPayrolls(payrollRes.data || []);
                setReimbursements(reimbRes.data || []);
            } catch (err) {
                console.error('Finance dashboard fetch error', err);
                setError('Failed to load finance data');
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
                Finance Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Transactions */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Recent Transactions</Typography>
                            {transactions.slice(0, 5).map((tx) => (
                                <Box key={tx.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography>
                                        {tx.type} - ${tx.amount} ({new Date(tx.date).toLocaleDateString()})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {tx.description}
                                    </Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Payrolls */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Payrolls (Current Month)</Typography>
                            {payrolls.slice(0, 5).map((p) => (
                                <Box key={p.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography>
                                        {p.employee.first_name} {p.employee.last_name} - ${p.net_salary}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {p.month}/{p.year} – {p.status}
                                    </Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reimbursements */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Pending Reimbursements</Typography>
                            {reimbursements
                                .filter((r) => r.status === 'PENDING')
                                .slice(0, 5)
                                .map((r) => (
                                    <Box key={r.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                        <Typography>
                                            {r.employee.first_name} {r.employee.last_name} - ${r.amount}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {r.description}
                                        </Typography>
                                    </Box>
                                ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

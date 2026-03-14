'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Button, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Visitor {
    id: number;
    name: string;
    company: string;
    host_employee_name: string;
    check_in_time: string;
    is_checked_out: boolean;
}

interface GateEntry {
    id: number;
    entry_type: string;
    visitor_name: string;
    employee_name: string;
    entry_time: string;
    gate_number: string;
}

export default function VisitorsDashboard() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [gateEntries, setGateEntries] = useState<GateEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [visitorsRes, gateRes] = await Promise.all([
                    api.get('visitors/visitors/?checked_in=true').catch(() => ({ data: [] })),
                    api.get('visitors/gate-entries/').catch(() => ({ data: [] })),
                ]);
                setVisitors(visitorsRes.data || []);
                setGateEntries(gateRes.data || []);
            } catch (err) {
                console.error('Visitors dashboard fetch error', err);
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
                Visitor & Security Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Active Visitors */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Active Visitors</Typography>
                            <Button
                                variant="contained"
                                sx={{ mb: 2 }}
                                onClick={() => router.push('/visitors/check-in')}
                            >
                                Check-In Visitor
                            </Button>
                            <Chip label={`${visitors.length} Active`} color="primary" sx={{ mb: 2, ml: 2 }} />
                            {visitors.slice(0, 5).map((visitor) => (
                                <Box key={visitor.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography fontWeight="bold">{visitor.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {visitor.company} - Host: {visitor.host_employee_name}
                                    </Typography>
                                    <Typography variant="caption">
                                        Checked in: {new Date(visitor.check_in_time).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                            <Button sx={{ mt: 2 }} onClick={() => router.push('/visitors/logs')}>
                                View All Logs
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Gate Entries */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Recent Gate Entries</Typography>
                            {gateEntries.slice(0, 5).map((entry) => (
                                <Box key={entry.id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography>
                                        Gate {entry.gate_number} - {entry.entry_type}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {entry.visitor_name || entry.employee_name}
                                    </Typography>
                                    <Typography variant="caption">
                                        {new Date(entry.entry_time).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                            <Button sx={{ mt: 2 }} onClick={() => router.push('/visitors/gate-entries')}>
                                View All Entries
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Stack, Chip, Avatar,
    CircularProgress, Alert, Divider, TextField, InputAdornment,
    IconButton, Tabs, Tab, Badge, Tooltip
} from '@mui/material';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    EscalatorWarning as EscalationIcon,
    Groups as DeptIcon,
    Badge as BadgeIcon,
    Warning as Level1Icon,
    Report as Level2Icon,
    GppBad as Level3Icon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

const LEVEL_CONFIG: Record<number, { label: string; color: string; bg: string; gradient: string; icon: React.ReactNode }> = {
    1: {
        label: 'Level 1 — Support Executive',
        color: '#16a34a',
        bg: '#f0fdf4',
        gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
        icon: <Level1Icon sx={{ color: '#16a34a' }} />
    },
    2: {
        label: 'Level 2 — Supervisor',
        color: '#d97706',
        bg: '#fffbeb',
        gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)',
        icon: <Level2Icon sx={{ color: '#d97706' }} />
    },
    3: {
        label: 'Level 3 — HOD / Manager',
        color: '#dc2626',
        bg: '#fef2f2',
        gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)',
        icon: <Level3Icon sx={{ color: '#dc2626' }} />
    },
};

const DEPT_COLORS = [
    '#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'
];

export default function EscalationMatrixPage() {
    const router = useRouter();
    const [departments, setDepartments] = useState<any[]>([]);
    const [matrixData, setMatrixData] = useState<Record<number, any[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptsRes, matrixRes] = await Promise.all([
                    axios.get('employees/departments/'),
                    axios.get('support/escalation-matrix/')
                ]);

                const depts = deptsRes.data;
                setDepartments(depts);

                // Group escalation contacts by department
                const grouped: Record<number, any[]> = {};
                depts.forEach((d: any) => { grouped[d.id] = []; });
                matrixRes.data.forEach((item: any) => {
                    if (grouped[item.department]) {
                        grouped[item.department].push(item);
                    } else {
                        grouped[item.department] = [item];
                    }
                });
                setMatrixData(grouped);
            } catch (err) {
                setError('Failed to load escalation matrix.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredDepts = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const activeDept = filteredDepts[activeTab] || null;
    const contacts = activeDept ? (matrixData[activeDept.id] || []) : [];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={48} sx={{ color: '#6366f1' }} />
                <Typography color="text.secondary">Loading escalation matrix...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{
                            width: 44, height: 44, borderRadius: 2,
                            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <EscalationIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={900} color="#1e293b">
                                Escalation Matrix
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Department-wise contact directory for Issue Escalation
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Stack>

            {/* How it works banner */}
            <Card sx={{
                mb: 4, borderRadius: 3,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                boxShadow: '0 8px 32px rgba(30,41,59,0.2)'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="white" gutterBottom>
                        📋 How Escalation Works
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        {[
                            { level: 1, desc: 'Contact the Level-1 Support Executive first. They handle most issues within 4 hours.', color: '#4ade80' },
                            { level: 2, desc: 'If unresolved after 4h, escalate to the Supervisor / Area Lead for priority handling.', color: '#fbbf24' },
                            { level: 3, desc: 'Critical or unresolved issues beyond 24h go to the Department Head / Manager.', color: '#f87171' },
                        ].map(item => (
                            <Grid key={item.level} size={{ xs: 12, sm: 4 }}>
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Box sx={{
                                        minWidth: 32, height: 32, borderRadius: '50%',
                                        bgcolor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Typography variant="caption" fontWeight={900} color="#1e293b">L{item.level}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ lineHeight: 1.6 }}>
                                        {item.desc}
                                    </Typography>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Left: Department Tabs */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'sticky', top: 24 }}>
                        <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#64748b" sx={{ mb: 2 }}>
                                DEPARTMENTS
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search department..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setActiveTab(0); }}
                                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                                slotProps={{
                                    input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> }
                                }}
                            />
                            <Tabs
                                orientation="vertical"
                                value={Math.min(activeTab, filteredDepts.length - 1)}
                                onChange={(_, v) => setActiveTab(v)}
                                sx={{
                                    '& .MuiTab-root': {
                                        alignItems: 'flex-start', textAlign: 'left', borderRadius: 2,
                                        minHeight: 52, px: 1.5, fontWeight: 700, fontSize: '0.8rem',
                                        color: '#64748b', textTransform: 'none',
                                        '&.Mui-selected': { color: '#4f46e5', bgcolor: '#eef2ff' }
                                    },
                                    '& .MuiTabs-indicator': { left: 0, borderRadius: 4, width: 3, bgcolor: '#4f46e5' }
                                }}
                            >
                                {filteredDepts.map((dept, idx) => {
                                    const deptContacts = matrixData[dept.id] || [];
                                    return (
                                        <Tab
                                            key={dept.id}
                                            label={
                                                <Stack direction="row" spacing={1} alignItems="center" width="100%">
                                                    <Box sx={{
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        bgcolor: DEPT_COLORS[idx % DEPT_COLORS.length], flexShrink: 0
                                                    }} />
                                                    <Typography fontWeight={700} variant="body2" sx={{ flex: 1, lineHeight: 1.3 }}>{dept.name}</Typography>
                                                    <Badge
                                                        badgeContent={deptContacts.length}
                                                        color="primary"
                                                        sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                                                    />
                                                </Stack>
                                            }
                                        />
                                    );
                                })}
                            </Tabs>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Contact Cards */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {activeDept ? (
                        <>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Avatar sx={{
                                    width: 48, height: 48,
                                    bgcolor: DEPT_COLORS[filteredDepts.indexOf(activeDept) % DEPT_COLORS.length],
                                    fontWeight: 900, fontSize: '1.1rem'
                                }}>
                                    {activeDept.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={900} color="#1e293b">{activeDept.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {contacts.length} escalation contact{contacts.length !== 1 ? 's' : ''} defined
                                    </Typography>
                                </Box>
                            </Stack>

                            {contacts.length === 0 ? (
                                <Card sx={{ borderRadius: 3, p: 5, textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                                    <EscalationIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                                    <Typography color="text.secondary">No escalation contacts defined for this department.</Typography>
                                </Card>
                            ) : (
                                <Stack spacing={3}>
                                    {[1, 2, 3].map(level => {
                                        const levelContacts = contacts.filter(c => c.level === level);
                                        if (levelContacts.length === 0) return null;
                                        const cfg = LEVEL_CONFIG[level];
                                        return (
                                            <Card key={level} sx={{
                                                borderRadius: 3,
                                                border: `2px solid ${cfg.color}30`,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                                overflow: 'visible'
                                            }}>
                                                {/* Level Header */}
                                                <Box sx={{
                                                    background: cfg.gradient,
                                                    px: 3, py: 2,
                                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                                    borderRadius: '12px 12px 0 0'
                                                }}>
                                                    {cfg.icon}
                                                    <Typography variant="subtitle1" fontWeight={900} sx={{ color: cfg.color }}>
                                                        {cfg.label}
                                                    </Typography>
                                                    <Chip
                                                        label={level === 1 ? '⏱ Response: 4h' : level === 2 ? '⏱ Response: 8h' : '⏱ Response: 24h'}
                                                        size="small"
                                                        sx={{ ml: 'auto', fontWeight: 700, bgcolor: 'white', color: cfg.color, fontSize: '0.7rem' }}
                                                    />
                                                </Box>

                                                <CardContent sx={{ p: 3 }}>
                                                    <Grid container spacing={2}>
                                                        {levelContacts.map(contact => (
                                                            <Grid key={contact.id} size={{ xs: 12, sm: 6 }}>
                                                                <Card sx={{
                                                                    borderRadius: 3,
                                                                    border: '1px solid #f1f5f9',
                                                                    bgcolor: '#fafbfc',
                                                                    boxShadow: 'none',
                                                                    transition: 'all 0.2s',
                                                                    '&:hover': {
                                                                        boxShadow: `0 4px 16px ${cfg.color}25`,
                                                                        borderColor: `${cfg.color}50`,
                                                                        transform: 'translateY(-2px)'
                                                                    }
                                                                }}>
                                                                    <CardContent sx={{ p: 2.5 }}>
                                                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                                                            <Avatar sx={{
                                                                                width: 44, height: 44,
                                                                                background: cfg.gradient,
                                                                                color: cfg.color,
                                                                                fontWeight: 900,
                                                                                border: `2px solid ${cfg.color}40`
                                                                            }}>
                                                                                {contact.name.charAt(0)}
                                                                            </Avatar>
                                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                                <Typography variant="subtitle2" fontWeight={800} color="#1e293b" noWrap>
                                                                                    {contact.name}
                                                                                </Typography>
                                                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                                                    <BadgeIcon sx={{ fontSize: 12, color: '#94a3b8' }} />
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        {contact.designation}
                                                                                    </Typography>
                                                                                </Stack>
                                                                            </Box>
                                                                        </Stack>

                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Stack spacing={1.5}>
                                                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                                                <Box sx={{
                                                                                    width: 32, height: 32, borderRadius: 2,
                                                                                    bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                                }}>
                                                                                    <PhoneIcon sx={{ fontSize: 16, color: cfg.color }} />
                                                                                </Box>
                                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                                    <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                                                                                    <Tooltip title="Click to call">
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            fontWeight={700}
                                                                                            color={cfg.color}
                                                                                            noWrap
                                                                                            component="a"
                                                                                            href={`tel:${contact.phone}`}
                                                                                            sx={{ textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                                                                        >
                                                                                            {contact.phone}
                                                                                        </Typography>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            </Stack>

                                                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                                                <Box sx={{
                                                                                    width: 32, height: 32, borderRadius: 2,
                                                                                    bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                                }}>
                                                                                    <EmailIcon sx={{ fontSize: 16, color: cfg.color }} />
                                                                                </Box>
                                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                                    <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                                                                                    <Tooltip title="Click to email">
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            fontWeight={700}
                                                                                            color="text.secondary"
                                                                                            noWrap
                                                                                            component="a"
                                                                                            href={`mailto:${contact.email}`}
                                                                                            sx={{ textDecoration: 'none', cursor: 'pointer', '&:hover': { color: cfg.color } }}
                                                                                        >
                                                                                            {contact.email}
                                                                                        </Typography>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            </Stack>
                                                                        </Stack>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            )}
                        </>
                    ) : (
                        <Card sx={{ borderRadius: 3, p: 5, textAlign: 'center' }}>
                            <DeptIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                            <Typography color="text.secondary">Select a department to view its escalation contacts.</Typography>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

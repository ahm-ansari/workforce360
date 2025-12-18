'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Divider,
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    AutoGraph as AnalysisIcon,
    History as HistoryIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function MarketingAnalysis() {
    const [mounted, setMounted] = useState(false);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: '',
        market_trends: '',
        competitor_analysis: ''
    });

    useEffect(() => {
        setMounted(true);
        fetchAnalyses();
    }, []);

    const fetchAnalyses = async () => {
        try {
            const response = await axios.get('marketing/analyses/');
            setAnalyses(response.data);
        } catch (error) {
            console.error('Error fetching analyses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (analysis: any = null) => {
        if (analysis) {
            setSelectedAnalysis(analysis);
            setFormData({
                title: analysis.title,
                strengths: analysis.strengths,
                weaknesses: analysis.weaknesses,
                opportunities: analysis.opportunities,
                threats: analysis.threats,
                market_trends: analysis.market_trends,
                competitor_analysis: analysis.competitor_analysis
            });
        } else {
            setSelectedAnalysis(null);
            setFormData({
                title: '',
                strengths: '',
                weaknesses: '',
                opportunities: '',
                threats: '',
                market_trends: '',
                competitor_analysis: ''
            });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            if (selectedAnalysis) {
                await axios.put(`marketing/analyses/${selectedAnalysis.id}/`, formData);
            } else {
                await axios.post('marketing/analyses/', formData);
            }
            setOpenDialog(false);
            fetchAnalyses();
        } catch (error) {
            console.error('Error saving analysis:', error);
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Marketing Analysis
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive SWOT and Market Environmental Analysis.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Perform New Analysis
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {analyses.length > 0 ? analyses.map((analysis) => (
                    <Grid item xs={12} key={analysis.id}>
                        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, bgcolor: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={700}>{analysis.title}</Typography>
                                <Stack direction="row" spacing={1}>
                                    <IconButton size="small" onClick={() => handleOpenDialog(analysis)}><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                </Stack>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={4}>
                                    {/* SWOT Grid */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 2 }}>SWOT Analysis</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Paper sx={{ p: 2, bgcolor: '#ecfdf5', height: '100%', border: '1px solid #d1fae5' }}>
                                                    <Typography variant="caption" fontWeight={700} color="#065f46" display="block">STRENGTHS</Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>{analysis.strengths || 'N/A'}</Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Paper sx={{ p: 2, bgcolor: '#fff1f2', height: '100%', border: '1px solid #ffe4e6' }}>
                                                    <Typography variant="caption" fontWeight={700} color="#9f1239" display="block">WEAKNESSES</Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>{analysis.weaknesses || 'N/A'}</Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Paper sx={{ p: 2, bgcolor: '#eff6ff', height: '100%', border: '1px solid #dbeafe' }}>
                                                    <Typography variant="caption" fontWeight={700} color="#1e40af" display="block">OPPORTUNITIES</Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>{analysis.opportunities || 'N/A'}</Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Paper sx={{ p: 2, bgcolor: '#fffbeb', height: '100%', border: '1px solid #fef3c7' }}>
                                                    <Typography variant="caption" fontWeight={700} color="#92400e" display="block">THREATS</Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>{analysis.threats || 'N/A'}</Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Market Trends</Typography>
                                                <Typography variant="body2" color="text.secondary">{analysis.market_trends || 'No trends identified.'}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Competitor Analysis</Typography>
                                                <Typography variant="body2" color="text.secondary">{analysis.competitor_analysis || 'No competitor data.'}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed #e2e8f0', bgcolor: 'transparent' }}>
                            <AnalysisIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">No analyses found. Start by performing a SWOT analysis.</Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Analysis Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle fontWeight={700}>
                    {selectedAnalysis ? 'Edit Analysis' : 'New Marketing Analysis'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Analysis Title"
                            placeholder="e.g. 2024 Market Entrance Analysis"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Strengths"
                                    value={formData.strengths}
                                    onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Weaknesses"
                                    value={formData.weaknesses}
                                    onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Opportunities"
                                    value={formData.opportunities}
                                    onChange={(e) => setFormData({ ...formData, opportunities: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Threats"
                                    value={formData.threats}
                                    onChange={(e) => setFormData({ ...formData, threats: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Market Trends"
                            value={formData.market_trends}
                            onChange={(e) => setFormData({ ...formData, market_trends: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Competitor Analysis"
                            value={formData.competitor_analysis}
                            onChange={(e) => setFormData({ ...formData, competitor_analysis: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Analysis</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Tabs, Tab, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DocumentViewer from '@/components/hr/DocumentViewer';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface DocumentCategory {
    id: number;
    name: string;
}

interface Document {
    id: number;
    title: string;
    description: string;
    file: string;
    category: number;
    category_details: {
        name: string;
    };
    created_at: string;
    is_confidential: boolean;
}

export default function DocumentsPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catsRes, docsRes] = await Promise.all([
                api.get('hr/document-categories/'),
                api.get('hr/documents/')
            ]);

            setCategories(Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.results || []);
            setDocuments(Array.isArray(docsRes.data) ? docsRes.data : docsRes.data.results || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = selectedCategory === 'ALL'
        ? documents
        : documents.filter(d => d.category === selectedCategory);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Documents</Typography>
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={() => router.push('/documents/upload')}
                >
                    Upload Document
                </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={selectedCategory}
                    onChange={(_, v) => setSelectedCategory(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="All Documents" value="ALL" />
                    {categories.map((cat) => (
                        <Tab key={cat.id} label={cat.name} value={cat.id} />
                    ))}
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredDocuments.length === 0 ? (
                        <Grid size={{ xs: 12 }}>
                            <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
                                No documents found in this category
                            </Typography>
                        </Grid>
                    ) : (
                        filteredDocuments.map((doc) => (
                            <Grid key={doc.id} size={{ xs: 12, md: 6 }}>
                                <DocumentViewer document={doc} />
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Box>
    );
}

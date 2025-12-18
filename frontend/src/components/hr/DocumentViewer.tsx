import { Box, Typography, Button, Paper, IconButton, Tooltip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Document {
    id: number;
    title: string;
    description: string;
    file: string;
    category_details: {
        name: string;
    };
    created_at: string;
    is_confidential: boolean;
}

interface DocumentViewerProps {
    document: Document;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
    const handleDownload = () => {
        window.open(document.file, '_blank');
    };

    return (
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main'
                }}>
                    <DescriptionIcon />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {document.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {document.category_details.name} • {new Date(document.created_at).toLocaleDateString()}
                    </Typography>
                </Box>
            </Box>
            <Box>
                <Tooltip title="Download">
                    <IconButton onClick={handleDownload} color="primary" size="small">
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
}

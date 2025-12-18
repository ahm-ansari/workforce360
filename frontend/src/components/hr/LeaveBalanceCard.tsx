import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

interface LeaveBalanceCardProps {
    type: string;
    used: number;
    total: number;
    color?: string;
}

export default function LeaveBalanceCard({ type, used, total, color = '#1976d2' }: LeaveBalanceCardProps) {
    const percentage = Math.min((used / total) * 100, 100);
    const remaining = total - used;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {type}
                </Typography>
                <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {remaining}
                    <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        / {total} days remaining
                    </Typography>
                </Typography>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: `${color}22`,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: color,
                                borderRadius: 5,
                            }
                        }}
                    />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {used} days used
                </Typography>
            </CardContent>
        </Card>
    );
}

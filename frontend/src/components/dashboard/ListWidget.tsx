'use client';

import { Card, CardContent, CardHeader, List, ListItem, ListItemText, Typography, Chip } from '@mui/material';

interface ListItem {
    id: string | number;
    primary: string;
    secondary?: string;
    status?: string;
    statusColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface ListWidgetProps {
    title: string;
    items: ListItem[];
    emptyMessage?: string;
}

export default function ListWidget({ title, items, emptyMessage = 'No items to display' }: ListWidgetProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent sx={{ pt: 0, maxHeight: 400, overflow: 'auto' }}>
                {items.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        {emptyMessage}
                    </Typography>
                ) : (
                    <List dense>
                        {items.map((item) => (
                            <ListItem
                                key={item.id}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' },
                                }}
                            >
                                <ListItemText
                                    primary={item.primary}
                                    secondary={item.secondary}
                                />
                                {item.status && (
                                    <Chip
                                        label={item.status}
                                        color={item.statusColor || 'default'}
                                        size="small"
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}

'use client';

'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Grid, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface AttendanceRecord {
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_LEAVE';
    check_in?: string;
    check_out?: string;
}

interface AttendanceCalendarProps {
    attendanceData: AttendanceRecord[];
    currentDate: Date;
    onMonthChange: (date: Date) => void;
    mode?: 'single' | 'team';
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Enhanced Color Palette
const getStatusColor = (status: string) => {
    switch (status) {
        case 'PRESENT': return '#10B981'; // Emerald 500
        case 'ABSENT': return '#EF4444'; // Red 500
        case 'HALF_DAY': return '#F59E0B'; // Amber 500
        case 'LATE': return '#FCD34D'; // Yellow 300
        case 'ON_LEAVE': return '#3B82F6'; // Blue 500
        default: return '#e0e0e0';
    }
};

export default function AttendanceCalendar({ attendanceData, currentDate, onMonthChange, mode = 'single' }: AttendanceCalendarProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<Grid key={`empty-${i}`} size={{ xs: 1.7 }} sx={{ height: 100 }} />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            let content;
            let cardStyle = {};

            if (mode === 'single') {
                const record = attendanceData.find(r => r.date === dateStr);
                const statusColor = record ? getStatusColor(record.status) : 'transparent';

                cardStyle = {
                    border: record ? `1px solid ${statusColor}` : '1px solid #eee',
                    bgcolor: record ? `${statusColor}10` : 'transparent',
                    '&:hover': {
                        bgcolor: record ? `${statusColor}20` : '#f5f5f5',
                        transform: 'translateY(-2px)'
                    }
                };

                content = (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                {day}
                            </Typography>
                            {record && (
                                <Box
                                    sx={{
                                        top: 0, right: 0, position: 'absolute',
                                        bgcolor: statusColor, color: '#fff',
                                        px: 0.8, py: 0.2, borderBottomLeftRadius: 8,
                                        fontSize: '0.6rem', fontWeight: 'bold'
                                    }}
                                >
                                    {record.status.replace('_', ' ')}
                                </Box>
                            )}
                        </Box>
                        {record && (
                            <Box sx={{ mt: 2 }}>
                                {record.check_in && (
                                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: '#555' }}>
                                        In: <strong>{record.check_in.slice(0, 5)}</strong>
                                    </Typography>
                                )}
                                {record.check_out && (
                                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: '#555' }}>
                                        Out: <strong>{record.check_out.slice(0, 5)}</strong>
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </>
                );
            } else {
                // TEAM MODE
                const dayRecords = attendanceData.filter(r => r.date === dateStr);
                const stats = {
                    PRESENT: 0, ABSENT: 0, LATE: 0, ON_LEAVE: 0, HALF_DAY: 0
                };
                dayRecords.forEach(r => {
                    if (stats[r.status] !== undefined) stats[r.status]++;
                });

                cardStyle = {
                    border: '1px solid #eee',
                    bgcolor: '#fff',
                    '&:hover': { bgcolor: '#fafafa', transform: 'translateY(-2px)' }
                };

                content = (
                    <>
                        <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                            {day}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {Object.entries(stats).map(([status, count]) => {
                                if (count === 0) return null;
                                return (
                                    <Box key={status} sx={{
                                        bgcolor: getStatusColor(status),
                                        color: '#fff',
                                        borderRadius: 1,
                                        px: 0.5, py: 0.2,
                                        fontSize: '0.65rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <span style={{ fontWeight: 'bold' }}>{count}</span>
                                        {status.charAt(0)}
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                );
            }

            days.push(
                <Grid key={day} size={{ xs: 1.7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            height: 100, p: 1, borderRadius: 2,
                            position: 'relative', transition: 'all 0.2s',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'space-between', overflow: 'hidden',
                            ...cardStyle
                        }}
                    >
                        {content}
                    </Paper>
                </Grid>
            );
        }

        return days;
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={handlePrevMonth} sx={{ border: '1px solid #eee' }}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h5" fontWeight="600" color="primary">
                    {isMounted ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : ''}
                </Typography>
                <IconButton onClick={handleNextMonth} sx={{ border: '1px solid #eee' }}>
                    <ChevronRightIcon />
                </IconButton>
            </Box>

            <Grid container spacing={1.5}>
                {DAYS_OF_WEEK.map(day => (
                    <Grid key={day} size={{ xs: 1.7 }}>
                        <Typography align="center" variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                            {day}
                        </Typography>
                    </Grid>
                ))}
                {renderCalendarDays()}
            </Grid>

            {/* Legend */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee', display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                {['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE'].map((status) => (
                    <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: getStatusColor(status), boxShadow: '0 0 0 2px #fff, 0 0 0 3px ' + getStatusColor(status) }} />
                        <Typography variant="caption" fontWeight="500" color="text.secondary">
                            {status.replace('_', ' ')}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

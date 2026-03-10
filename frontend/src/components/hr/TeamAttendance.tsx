import { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, TextField, MenuItem,
    Grid, Chip, CircularProgress, Pagination, Button
} from '@mui/material';
import AttendanceCalendar from './AttendanceCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '@/services/api';

// Enhanced Color Palette matching Calendar
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

export default function TeamAttendance() {
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        date: null as Date | null,
        status: '',
        employee: '',
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    useEffect(() => {
        fetchAttendance();
    }, [page, filters.date, filters.status, filters.employee, viewMode, currentMonth]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            let url = 'hr/attendance/?';

            if (viewMode === 'table') {
                url += `page=${page}`;
                if (filters.date) {
                    const dateStr = filters.date.toISOString().split('T')[0];
                    url += `&date=${dateStr}`;
                }
            } else {
                // Calendar Mode: Fetch range for the current month
                const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                // Adjust for timezone potentially, but YYYY-MM-DD should be safely handled by backend logic
                // Using exact string construction to avoid timezone jumps
                const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-01`;
                const endStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

                url += `start_date=${startStr}&end_date=${endStr}`;
            }

            if (filters.status) {
                url += `&status=${filters.status}`;
            }

            if (filters.employee) {
                url += `&search=${filters.employee}`;
            }

            const response = await api.get(url);
            if (response.data.results) {
                setAttendanceData(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 10));
            } else {
                setAttendanceData(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error('Failed to fetch team attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid #eee', overflow: 'hidden' }}>
            {/* Toolbar */}
            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #eee' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" fontWeight="600" color="#1e293b">Team Attendance</Typography>
                        <Typography variant="body2" color="text.secondary">Overview of employee attendance records</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                        {/* View Toggle */}
                        <Box sx={{ display: 'flex', bgcolor: '#e2e8f0', borderRadius: 1, p: 0.5 }}>
                            <Button
                                size="small"
                                variant={viewMode === 'table' ? 'contained' : 'text'}
                                onClick={() => setViewMode('table')}
                                sx={{ borderRadius: 1, boxShadow: 'none' }}
                            >
                                List
                            </Button>
                            <Button
                                size="small"
                                variant={viewMode === 'calendar' ? 'contained' : 'text'}
                                onClick={() => setViewMode('calendar')}
                                sx={{ borderRadius: 1, boxShadow: 'none' }}
                            >
                                Calendar
                            </Button>
                        </Box>

                        <TextField
                            placeholder="Search Employee..."
                            value={filters.employee}
                            onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                            size="small"
                            sx={{ bgcolor: '#fff', width: 200 }}
                        />

                        {viewMode === 'table' && (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Filter by Date"
                                    value={filters.date}
                                    onChange={(newValue) => setFilters({ ...filters, date: newValue })}
                                    slotProps={{
                                        textField: { size: 'small', sx: { bgcolor: '#fff', width: 180 } }
                                    }}
                                />
                            </LocalizationProvider>
                        )}

                        <TextField
                            select
                            label="Status"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            size="small"
                            sx={{ bgcolor: '#fff', width: 140 }}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="PRESENT">Present</MenuItem>
                            <MenuItem value="ABSENT">Absent</MenuItem>
                            <MenuItem value="LATE">Late</MenuItem>
                            <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                            <MenuItem value="HALF_DAY">Half Day</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Employee</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Check In</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Check Out</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Hours</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendanceData.length > 0 ? attendanceData.map((record) => (
                                            <TableRow key={record.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>{record.date}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>
                                                    {record.employee_details?.user_details
                                                        ? `${record.employee_details.user_details.first_name} ${record.employee_details.user_details.last_name}`
                                                        : record.employee_details?.name || record.employee || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={record.status.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getStatusColor(record.status),
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            minWidth: 80
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{record.check_in ? record.check_in.slice(0, 5) : '-'}</TableCell>
                                                <TableCell>{record.check_out ? record.check_out.slice(0, 5) : '-'}</TableCell>
                                                <TableCell>{record.work_hours || '-'}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                    No records found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid #eee' }}>
                                <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" />
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ p: 3 }}>
                            {/* Import AttendanceCalendar dynamically or use the one from props/context if available. 
                                Since it's a default export from another file, we make sure it is imported at top.
                                CHECK: We need to import AttendanceCalendar.
                             */}
                            <AttendanceCalendar
                                attendanceData={attendanceData}
                                currentDate={currentMonth}
                                onMonthChange={setCurrentMonth}
                                mode="team"
                            />
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );
}

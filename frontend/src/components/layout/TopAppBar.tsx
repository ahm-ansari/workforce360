'use client';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box, Avatar, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    link: string;
}

interface TopAppBarProps {
    title?: string;
}

export default function TopAppBar({ title = 'Workforce360' }: TopAppBarProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await api.get('users/notifications/');
            setNotifications(response.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const response = await api.get('users/notifications/unread_count/');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
            const interval = setInterval(() => {
                fetchUnreadCount();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    if (!mounted) {
        return null;
    }

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications();
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleNotificationItemClick = async (notification: Notification) => {
        try {
            await api.post(`users/notifications/${notification.id}/mark_read/`);
            fetchUnreadCount();
            if (notification.link) {
                router.push(notification.link);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
        handleNotificationClose();
    };

    const handleMarkAllRead = async () => {
        try {
            await api.post('users/notifications/mark_all_read/');
            fetchUnreadCount();
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleLogout = () => {
        useAuthStore.getState().logout();
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.clear();
        delete api.defaults.headers.common['Authorization'];
        handleProfileClose();
        window.location.href = '/login';
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: 'white',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                mb: 3,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h5" component="div" fontWeight={700} color="primary.main">
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={handleNotificationClick}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        onClick={handleProfileClick}
                        sx={{
                            ml: 1,
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '1rem',
                            }}
                        >
                            {user?.first_name?.[0] || user?.username[0].toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleNotificationClose}
                    PaperProps={{
                        sx: {
                            width: 380,
                            maxHeight: 480,
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                        }
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight={600}>Notifications</Typography>
                        {unreadCount > 0 && (
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{ cursor: 'pointer', fontWeight: 600 }}
                                onClick={handleMarkAllRead}
                            >
                                Mark all read
                            </Typography>
                        )}
                    </Box>
                    <Divider />
                    {notifications.length === 0 ? (
                        <MenuItem disabled>
                            <Typography variant="body2" color="text.secondary">No notifications</Typography>
                        </MenuItem>
                    ) : (
                        notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                onClick={() => handleNotificationItemClick(notification)}
                                sx={{
                                    bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                                    borderLeft: notification.is_read ? 'none' : '3px solid',
                                    borderColor: 'primary.main',
                                    py: 1.5,
                                    px: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    '&:hover': {
                                        bgcolor: 'action.selected',
                                    },
                                }}
                            >
                                <Typography variant="body2" fontWeight={notification.is_read ? 400 : 600}>
                                    {notification.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {new Date(notification.created_at).toLocaleString()}
                                </Typography>
                            </MenuItem>
                        ))
                    )}
                </Menu>

                {/* Profile Menu */}
                <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileClose}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 200,
                            borderRadius: 2,
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                        }
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {user?.first_name} {user?.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user?.email}
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                        onClick={() => { router.push('/profile'); handleProfileClose(); }}
                        sx={{ py: 1.5, gap: 1.5 }}
                    >
                        <PersonIcon fontSize="small" />
                        Profile
                    </MenuItem>
                    <MenuItem
                        onClick={() => { router.push('/settings'); handleProfileClose(); }}
                        sx={{ py: 1.5, gap: 1.5 }}
                    >
                        <SettingsIcon fontSize="small" />
                        Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={handleLogout}
                        sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}
                    >
                        <LogoutIcon fontSize="small" />
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

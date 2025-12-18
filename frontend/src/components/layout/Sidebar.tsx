'use client';
import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar, Collapse } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StorageIcon from '@mui/icons-material/Storage';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactElement;
    roles: string[];
    children?: NavItem[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: ['admin', 'manager', 'hr', 'employee', 'finance', 'security'] },

    // Master Records (Admin & HR)
    {
        label: 'Master Records',
        path: '/master-records',
        icon: <StorageIcon />,
        roles: ['admin', 'hr'],
        children: [
            { label: 'Departments', path: '/departments', icon: <BusinessIcon />, roles: ['admin', 'hr'] },
            { label: 'Designations', path: '/designations', icon: <BadgeIcon />, roles: ['admin', 'hr'] },
            { label: 'Roles', path: '/roles', icon: <AdminPanelSettingsIcon />, roles: ['admin'] },
        ]
    },

    // Employee Management
    { label: 'Employees', path: '/employees', icon: <PeopleIcon />, roles: ['admin', 'hr', 'manager'] },

    // HR Management
    { label: 'Attendance', path: '/attendance', icon: <EventAvailableIcon />, roles: ['admin', 'manager', 'hr', 'employee'] },
    { label: 'Leave', path: '/leave', icon: <EventNoteIcon />, roles: ['admin', 'manager', 'hr', 'employee'] },
    { label: 'Documents', path: '/documents', icon: <DescriptionIcon />, roles: ['admin', 'manager', 'hr', 'employee'] },

    // Task Management
    { label: 'Tasks', path: '/tasks', icon: <WorkIcon />, roles: ['admin', 'manager', 'employee'] },

    // Project Management
    { label: 'Projects', path: '/projects', icon: <DescriptionIcon />, roles: ['admin', 'manager', 'employee'] },

    // Outsourcing Management
    {
        label: 'Outsourcing',
        path: '/outsourcing',
        icon: <HandshakeIcon />,
        roles: ['admin', 'manager', 'hr'],
        children: [
            { label: 'Overview', path: '/outsourcing', icon: <AssessmentIcon />, roles: ['admin', 'manager', 'hr'] },
            { label: 'Staffing Requests', path: '/outsourcing/requests', icon: <AssignmentIcon />, roles: ['admin', 'manager', 'hr'] },
            { label: 'Outsourced Staff', path: '/outsourcing/staff', icon: <AssignmentIndIcon />, roles: ['admin', 'manager', 'hr'] },
            { label: 'Contracts', path: '/outsourcing/contracts', icon: <DescriptionIcon />, roles: ['admin', 'hr'] },
            { label: 'Timesheets', path: '/outsourcing/timesheets', icon: <EventNoteIcon />, roles: ['admin', 'hr', 'manager'] },
        ]
    },

    // Finance Management

    { label: 'Finance', path: '/finance', icon: <AccountBalanceIcon />, roles: ['admin', 'finance'] },

    // Recruitment Management
    { label: 'Recruitment', path: '/recruitment', icon: <PersonAddIcon />, roles: ['admin', 'hr'] },

    // Visitor & Security Management
    { label: 'Visitors', path: '/visitors', icon: <SecurityIcon />, roles: ['admin', 'security'] },
    { label: 'Companies', path: '/companies', icon: <BusinessIcon />, roles: ['admin', 'hr', 'security'] },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (!user) {
        return null;
    }

    // Get role name from role_details
    const userRole = user.role_details?.name?.toLowerCase() || '';

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    const handleSubmenuClick = (label: string) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    const renderNavItem = (item: NavItem) => {
        if (!item.roles.includes(userRole)) return null;

        const isActive = pathname === item.path || (item.children && item.children.some(child => pathname === child.path));
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openSubmenu === item.label;

        if (hasChildren) {
            return (
                <React.Fragment key={item.label}>
                    <ListItemButton
                        onClick={() => handleSubmenuClick(item.label)}
                        selected={isActive}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            color: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                            }}
                        />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children!.map((child) => {
                                if (!child.roles.includes(userRole)) return null;
                                const isChildActive = pathname === child.path;
                                return (
                                    <ListItemButton
                                        key={child.path}
                                        onClick={() => handleNavigate(child.path)}
                                        selected={isChildActive}
                                        sx={{
                                            pl: 4,
                                            borderRadius: 2,
                                            mb: 0.5,
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white',
                                            },
                                            '&.Mui-selected': {
                                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                            {child.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={child.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.9rem',
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Collapse>
                </React.Fragment>
            );
        }

        return (
            <ListItemButton
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                    },
                    '&.Mui-selected': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                        },
                    },
                }}
            >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                    }}
                />
            </ListItemButton>
        );
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 260,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 260,
                    boxSizing: 'border-box',
                    background: 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)',
                    color: 'white',
                    borderRight: 'none',
                }
            }}
        >
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                    }}
                >
                    {user.first_name?.[0] || user.username[0].toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {user.role_details?.name || 'User'}
                    </Typography>
                </Box>
            </Box>

            <List sx={{ px: 2 }}>
                {navItems.map(renderNavItem)}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 2, textAlign: 'center', opacity: 0.6 }}>
                <Typography variant="caption">
                    Workforce360 © 2025
                </Typography>
            </Box>
        </Drawer>
    );
}

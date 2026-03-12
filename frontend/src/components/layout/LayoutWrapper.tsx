'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopAppBar from '@/components/layout/TopAppBar';
import { Box } from '@mui/material';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return (
            <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                {children}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: '#f8fafc',
                    backgroundImage: 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px',
                    minHeight: '100vh',
                    transition: 'all 0.3s ease'
                }}
            >
                <TopAppBar />
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

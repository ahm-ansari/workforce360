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
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
                <TopAppBar />
                {children}
            </Box>
        </Box>
    );
}

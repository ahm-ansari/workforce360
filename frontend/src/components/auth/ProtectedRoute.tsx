'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/login') {
            router.replace('/login');
        }
    }, [isAuthenticated, router, pathname]);

    // Render children only when authenticated or on login page
    return isAuthenticated || pathname === '/login' ? <>{children}</> : null;
}

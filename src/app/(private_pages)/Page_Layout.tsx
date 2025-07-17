"use client";

import { usePathname, redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface PageLayoutProps {
  userRole: string;
  children: ReactNode;
}

export default function PageLayout({ userRole, children }: PageLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    const superAdminRoutes = ['/users', '/departments'];

    if (userRole !== 'SUPERADMIN' && superAdminRoutes.some(route => pathname.startsWith(route))) {
      redirect('/dashboard');
    }
  }, [pathname, userRole]);

  return <>{children}</>;
}
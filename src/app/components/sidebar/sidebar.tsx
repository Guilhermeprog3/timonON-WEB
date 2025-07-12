"use client"
import {
  LayoutDashboard,
  MessageSquareWarning,
  Users,
  Settings,
  User2,
  LogOut,
  ChevronUp,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from "next-auth/react";
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface AppSidebarProps {
  userName: string;
  userRole: string;
}

const allItems = [
    {
        title: 'Geral',
        url: '/dashboard',
        icon: LayoutDashboard,
        roles: ['SUPERADMIN', 'ADMIN']
    },
    {
        title: 'Reclamações',
        url: '/complaint',
        icon: MessageSquareWarning,
        roles: ['SUPERADMIN', 'ADMIN']
    },
    {
        title: 'Bandeiras',
        url: '/banners',
        icon: ImageIcon,
        roles: ['SUPERADMIN', 'ADMIN']
    },
    {
        title: 'Users',
        url: '/users',
        icon: Users,
        roles: ['SUPERADMIN']
    },
    {
        title: 'Departamentos',
        url: '/departments',
        icon: Building,
        roles: ['SUPERADMIN']
    },
    {
        title: 'Configuração',
        url: '/settings',
        icon: Settings,
        roles: ['SUPERADMIN', 'ADMIN']
    },
];

export function AppSidebar({ userName, userRole }: AppSidebarProps) {
  const pathname = usePathname();

  const menuItems = useMemo(() => {
    if (!userRole) return [];
    return allItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col flex-grow">
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg p-1">
                <Image
              src="/assets/prefeitura-logo.png"
              alt="Logo da Prefeitura"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Zelus
              </span>
            </Link>
        </div>
        
        <SidebarGroup className="flex-grow">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col justify-center h-full">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="flex items-center gap-5 rounded-lg px-4 py-5 text-xl transition-all"
                    >
                      <Link href={item.url}>
                        <item.icon size={28} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full text-base rounded-lg p-3">
              <div className="flex items-center gap-4">
                <User2 size={24} />
                <span className="truncate font-medium">{userName}</span>
              </div>
              <ChevronUp size={22} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-md shadow-lg border"
          >
            <DropdownMenuItem asChild>
              <a
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 p-2 text-destructive cursor-pointer hover:bg-accent rounded-sm"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
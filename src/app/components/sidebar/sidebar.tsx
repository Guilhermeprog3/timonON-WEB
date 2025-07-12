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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { signOut } from "next-auth/react";
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface AppSidebarProps {
  userName: string;
  userRole: string;
}

const allItems = [
    {
        title: 'Dashboard',
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
        title: 'Banners',
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
      <SidebarContent className="bg-indigo-900 text-white flex flex-col">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:bg-indigo-800 ${isActive ? 'bg-indigo-700 font-semibold' : ''}`}
                    >
                      <Link href={item.url}>
                        <item.icon size={20} />
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

      <SidebarFooter className="bg-indigo-950 border-t border-indigo-800 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full text-white hover:bg-indigo-800 rounded-lg">
              <div className="flex items-center gap-3">
                <User2 size={20} />
                <span className="truncate font-medium">{userName}</span>
              </div>
              <ChevronUp size={20} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)] bg-slate-50 text-slate-800 rounded-md shadow-lg border border-slate-200"
          >
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-200 rounded-sm"
              >
                <Settings size={16} />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 p-2 text-red-500 cursor-pointer hover:bg-slate-200 rounded-sm"
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
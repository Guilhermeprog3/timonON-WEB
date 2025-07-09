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
import { signOut } from "next-auth/react"; // 1. Importe a função signOut
import { useMemo } from 'react';

interface AppSidebarProps {
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
        url: '#',
        icon: Settings,
        roles: ['SUPERADMIN']
    },
];

export function AppSidebar({ userRole }: AppSidebarProps) {

  const menuItems = useMemo(() => {
    if (!userRole) return [];
    return allItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  return (
    <Sidebar>
      <SidebarContent className="bg-indigo-900 text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-indigo-950 border-t border-indigo-800 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full text-white hover:bg-indigo-800">
              <div className="flex items-center gap-3">
                <User2 size={20} />
                <span className="truncate">Username</span>
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
              <a
                href="#"
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-200 rounded-sm"
              >
                <User2 size={16} />
                <span>Meu Perfil</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {/* 2. Use a função signOut no onClick */}
              <a
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 p-2 text-red-500 cursor-pointer hover:bg-slate-200 rounded-sm"
              >
                <LogOut size={16} />
                <span >Sair</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

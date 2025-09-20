import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
// import { NavFooter } from '@/components/nav-footer';
import { BookOpenTextIcon, FileText, GraduationCap, HeartHandshake, LayoutGrid, Users2, CalendarCheck, BookOpen } from 'lucide-react';
import AppLogo from './app-logo';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        // role_access: ['admin'],
        role_access: [''],
    },

    // admin
    {
        title: 'Data Siswa',
        href: '/admin/siswa',
        icon: Users2,
        role_access: ['admin'],
    },
    {
        title: 'Data Guru',
        href: '/admin/guru',
        icon: GraduationCap,
        role_access: ['admin'],
    },
    {
        title: 'Data Wali Siswa',
        href: '/admin/walisiswa',
        icon: HeartHandshake,
        role_access: ['admin'],
    },
    {
        title: 'Data Mata Pelajaran',
        href: '/admin/pelajaran',
        icon: BookOpenTextIcon,
        role_access: ['admin'],
    },
    {
        title: 'Laporan Izin Siswa',
        href: '/admin/izin',
        icon: FileText,
        role_access: ['admin'],
    },
    // guru
    {
        title: 'Data Siswa Didik',
        href: '/guru/siswa-didik',
        icon: Users2,
        role_access: ['guru'],
    },
    {
        title: 'Data Mata Pelajaran',
        href: '/guru/pelajaran',
        icon: BookOpenTextIcon,
        role_access: ['guru'],
    },
    {
        title: 'Laporan Izin Siswa',
        href: '/guru/izin',
        icon: FileText,
        role_access: ['guru'],
    },


    // wali siswa
    {
        title: 'Data Anak',
        href: '/wali/anak',
        icon: Users2,
        role_access: ['walisiswa'],
    },
    {
        title: 'Laporan Izin Anak',
        href: '/wali/izin',
        icon: BookOpenTextIcon,
        role_access: ['walisiswa'],
    },

];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

import DataTableWalisiswaAdmin from '@/components/admin/walisiswa/data-table-walisiswa-admin';
import WalisiswaFormAddAdmin from '@/components/admin/walisiswa/walisiswa-form-add-admin';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AdminWaliSiswaResponse } from '@/types/admin/walisiswa';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wali Siswa',
        href: '/admin/walisiswa',
    },
];

export default function Page({ prop }: { prop: AdminWaliSiswaResponse }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Wali Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Wali Siswa"
                        description="Memuat informasi wali siswa sebagai kontak utama untuk keperluan komunikasi, perizinan, dan administrasi pondok."
                    />

                    <WalisiswaFormAddAdmin />
                </div>
                <Separator />
                <DataTableWalisiswaAdmin siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

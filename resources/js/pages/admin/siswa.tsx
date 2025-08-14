import DataTableSiswaAdmin from '@/components/admin/siswa/data-table-siswa-admin';
import SiswaFormAddAdmin from '@/components/admin/siswa/siswa-form-add-admin';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AdminSiswaPaginationResponse } from '@/types/admin/siswa';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: '/admin/siswa',
    },
];

export default function Page({ prop }: { prop: AdminSiswaPaginationResponse }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Siswa"
                        description="Menampilkan informasi lengkap siswa pondok pesantren secara terstruktur untuk memudahkan pencarian, pengelolaan, dan pemantauan perkembangan siswa."
                    />

                    <SiswaFormAddAdmin />
                </div>
                <Separator />
                <DataTableSiswaAdmin siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

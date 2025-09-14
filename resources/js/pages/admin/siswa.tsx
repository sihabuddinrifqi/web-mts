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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Data Siswa"
                        description="Menampilkan informasi lengkap siswa pondok pesantren secara terstruktur untuk memudahkan pencarian, pengelolaan, dan pemantauan perkembangan siswa."
                    />

                    <div className="flex justify-end">
                        <SiswaFormAddAdmin />
                    </div>
                </div>
                <Separator />
                <DataTableSiswaAdmin siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

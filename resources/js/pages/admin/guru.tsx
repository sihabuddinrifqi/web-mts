import DataTableGuruAdmin from '@/components/admin/guru/data-table-guru-admin';
import GuruFormAddAdmin from '@/components/admin/guru/guru-form-add-admin';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AdminGuruResponse } from '@/types/admin/guru';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Guru',
        href: '/admin/guru',
    },
];

export default function Page({ prop }: { prop: AdminGuruResponse }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Guru" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Guru"
                        description="Berisi informasi lengkap tentang guru yang mengajar di pondok, termasuk jumlah siswa, list pelajaran, dan list siswa didik."
                    />

                    <GuruFormAddAdmin />
                </div>
                <Separator />
                <DataTableGuruAdmin siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import DataTableSiswaGuru from '@/components/guru/siswa/data-table-siswa-guru';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { GuruSiswa } from '@/types/guru/siswa';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa yang Diasuh',
        href: '/guru/siswa-didik',
    },
];

export default function Page({ prop }: { prop: GuruSiswa }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa yang Diasuh" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Data Siswa yang Diasuh"
                        description="Menampilkan daftar siswa yang berada dalam bimbingan atau pengawasan guru. "
                    />
                </div>
                <Separator />
                <DataTableSiswaGuru siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

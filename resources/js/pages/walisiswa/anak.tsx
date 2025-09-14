import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import DataTableSiswaWali from '@/components/wali/anak/data-table-siswa-wali';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { APIPaginateResponse } from '@/types/response';
import { Siswa } from '@/types/users';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Anak',
        href: '/wali/anak',
    },
];

export default function Page({ prop }: { prop: APIPaginateResponse<Siswa> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Anak" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading title="Data Anak" description="Menampilkan daftar anak yang berada dalam bimbingan atau pengawasan orang tua wali. " />
                </div>
                <Separator />
                <DataTableSiswaWali siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

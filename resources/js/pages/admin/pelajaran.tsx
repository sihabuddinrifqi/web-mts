import DataTablePelajaranSiswaAdmin from '@/components/admin/pelajaran/data-table-pelajaran-admin';
import PelajaranFormAddAdmin from '@/components/admin/pelajaran/pelajaran-form-add-admin';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AdminPelajaranResponse } from '@/types/admin/pelajaran';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Mata Pelajaran',
        href: '/admin/pelajaran',
    },
];

export default function Page({ prop }: { prop: AdminPelajaranResponse }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Mata Pelajaran Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Mata Pelajaran Siswa"
                        description="Berisi daftar mata pelajaran yang diajarkan kepada siswa lengkap dengan nama pengampu, semester berjalan, dan jumlah peserta."
                    />
                    <PelajaranFormAddAdmin />
                </div>
                <Separator />
                <DataTablePelajaranSiswaAdmin siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

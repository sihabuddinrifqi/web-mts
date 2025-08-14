import DataTableIzinAdmin from '@/components/admin/izin/data-table-izin-admin';
import IzinFormAddAdmin from '@/components/admin/izin/izzin-form-add-admin';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AdminIzinPulangResponse } from '@/types/admin/izin';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Permohonan Izin Siswa',
        href: '/admin/izin',
    },
];

export default function Page({ prop }: { prop: AdminIzinPulangResponse }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Permohonan Izin Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Permohonan Izin Siswa"
                        description="Berisi informasi izin siswa yang diajukan oleh orang tua atau wali, termasuk alasan, durasi, dan status izin."
                    />

                    <IzinFormAddAdmin />
                </div>
                <Separator />
                <DataTableIzinAdmin siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

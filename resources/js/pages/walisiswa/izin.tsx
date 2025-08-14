import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import DataTableIzinWali from '@/components/wali/izin/data-table-izin-wali';
import IzinFormAddWali from '@/components/wali/izin/izzin-form-add-wali';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Izin } from '@/types/izin';
import { APIPaginateResponse } from '@/types/response';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Permohonan Izin Siswa',
        href: '/admin/izin',
    },
];

export default function Page({ prop }: { prop: APIPaginateResponse<Izin> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Permohonan Izin Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Data Permohonan Izin Siswa"
                        description="Berisi informasi izin siswa yang diajukan oleh orang tua atau wali, termasuk alasan, durasi, dan status izin."
                    />

                    <IzinFormAddWali />
                </div>
                <Separator />
                <DataTableIzinWali siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

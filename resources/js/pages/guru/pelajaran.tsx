import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import DataTablePelajaranGuru from '@/components/guru/pelajaran/data-table-pelajaran-guru';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { GuruPelajaranList } from '@/types/guru/pelajaran';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Pelajaran',
        href: '/guru/pelajaran',
    },
];

export default function Page({ prop }: { prop: GuruPelajaranList }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pelajaran" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Daftar Mata Pelajaran yang Diampu"
                        description="Informasi lengkap mengenai mata pelajaran yang diajarkan oleh seorang guru. "
                    />
                </div>
                <Separator />
                <DataTablePelajaranGuru siswaData={prop} filters={{ search: '', page: 1 }} />
            </div>
        </AppLayout>
    );
}

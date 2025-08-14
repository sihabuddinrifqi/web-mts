// resources/js/Pages/Admin/SiswaPage.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminGuruResponse } from '@/types/admin/guru';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LessonViewGuruAdmin from './lesson-view-guru-admin';
import SiswaViewGuruAdmin from './siswa-view-guru-admin';
import { GuruActionAdmin } from './guru-action-admin';

type Props = {
    siswaData: AdminGuruResponse;
    filters: {
        search: string;
        page: number;
    };
};

export default function DataTableGuruAdmin({ siswaData, filters }: Props) {
    const { url } = usePage();
    const [searchInput, setSearchInput] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(url.split('?')[0], { search: searchInput, page: 1 }, { preserveState: true, replace: true });
    };

    const handlePageChange = (pageUrl: string | null) => {
        if (pageUrl) {
            router.visit(pageUrl, { preserveState: true, replace: true });
        }
    };

    return (
        <div className="flex flex-col gap-6 pt-2">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
                <Input
                    placeholder="Search siswa..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full sm:max-w-xs"
                />
                <Button type="submit" className="w-full sm:w-auto">
                    Search
                </Button>
            </form>

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-lg border">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead>No</TableHead>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Jumlah Siswa Didik</TableHead>
                            <TableHead>List Pelajaran</TableHead>
                            <TableHead>List Siswa Didik</TableHead>
                            <TableHead></TableHead>
                            {/* <TableHead>Alamat</TableHead> */}
                            {/* <TableHead>Jenis Kelamin</TableHead>
                            <TableHead>Nomor HP</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Nama Orang Tua</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {siswaData.data.length > 0 ? (
                            siswaData.data.map((siswa, index) => (
                                <TableRow key={siswa.id}>
                                    <TableCell>{(siswaData.current_page - 1) * siswaData.per_page + index + 1}</TableCell>
                                    <TableCell>{siswa.name}</TableCell>
                                    <TableCell>{siswa.anak?.length}</TableCell>
                                    <TableCell>
                                        <LessonViewGuruAdmin id={siswa.id} />
                                    </TableCell>
                                    <TableCell>
                                        <SiswaViewGuruAdmin id={siswa.id} />
                                    </TableCell>
                                    <TableCell>
                                        <GuruActionAdmin id={siswa.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex w-full flex-wrap items-center justify-center gap-2">
                {siswaData.links.map((link, index) => (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        onClick={() => handlePageChange(link.url)}
                        className="min-w-8"
                    />
                ))}
            </div>
        </div>
    );
}

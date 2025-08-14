// resources/js/Pages/Admin/SiswaPage.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import formatDate from '@/lib/format-date';
import { Izin } from '@/types/izin';
import { APIPaginateResponse } from '@/types/response';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { IzinActionWali } from './izin-action-walii';

type Props = {
    siswaData: APIPaginateResponse<Izin>;
    filters: {
        search: string;
        page: number;
    };
};

export default function DataTableIzinWali({ siswaData, filters }: Props) {
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
                            <TableHead>Nama Siswa</TableHead>
                            <TableHead>Pelapor (Wali)</TableHead>
                            <TableHead>Alasan</TableHead>
                            <TableHead>Tanggal Pulang</TableHead>
                            <TableHead>Tanggal Kembali</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {siswaData.data.length > 0 ? (
                            siswaData.data.map((data) => (
                                <TableRow key={data.id}>
                                    <TableCell>{data.target_siswa?.name}</TableCell>
                                    <TableCell>{data.created_by?.name}</TableCell>
                                    <TableCell>{data.message}</TableCell>
                                    <TableCell>{formatDate(data.tanggal_pulang)}</TableCell>
                                    <TableCell>{formatDate(data.tanggal_kembali)}</TableCell>
                                    <TableCell>
                                        <div
                                            className={`w-full rounded px-3 py-1.5 text-center text-xs font-bold ${
                                                data.status === 'accepted'
                                                    ? 'border border-green-500 bg-green-50 text-green-500'
                                                    : data.status === 'rejected'
                                                      ? 'border border-red-500 bg-red-50 text-red-500'
                                                      : 'border border-blue-500 bg-blue-50 text-blue-500'
                                            }`}
                                        >
                                            {data.status === 'accepted'
                                                ? 'Disetujui'
                                                : data.status === 'rejected'
                                                  ? 'Izin Tidak Diberikan'
                                                  : 'Menunggu Persetujuan'}
                                        </div>
                                    </TableCell>
                                    {/* <TableCell>
                                        <Button size={'sm'}>
                                            <Printer /> Cetak{' '}
                                        </Button>
                                    </TableCell> */}
                                    <TableCell>
                                        <IzinActionWali />
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

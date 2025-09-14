// resources/js/Pages/Admin/SiswaPage.tsx

import { SiswaDetail } from '@/components/admin/siswa/siswa-detail';
import TranscriptViewAdmin from '@/components/admin/siswa/transcript-view-admin';
import MonitorPresensiGuru from '@/components/guru/presensi-view-guru';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GuruSiswa } from '@/types/guru/siswa';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Props = {
    siswaData: GuruSiswa;
    filters: {
        search: string;
        page: number;
    };
};

export default function DataTableSiswaGuru({ siswaData, filters }: Props) {
    const { url } = usePage();
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [openPresensiDialogId, setOpenPresensiDialogId] = useState<number | null>(null);

    const handleOpenPresensiDialog = (siswaId: number) => {
        setOpenPresensiDialogId(siswaId);
    };

    const handleClosePresensiDialog = () => {
        setOpenPresensiDialogId(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(url.split('?')[0], { search: searchInput, page: 1 }, { preserveState: true, replace: true });
    };

    // const handlePageChange = (pageUrl: string | null) => {
    //     if (pageUrl) {
    //         router.visit(pageUrl, { preserveState: true, replace: true });
    //     }
    // };

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
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className="bg-muted">
                            {/* <TableHead>No</TableHead> */}
                            <TableHead>NIS</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Transkip Nilai</TableHead>
                            <TableHead>Presensi</TableHead>
                            <TableHead>Detail Siswa</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {siswaData.length > 0 ? (
                            siswaData.map((siswa) => (
                                <TableRow key={siswa.id}>
                                    {/* <TableCell>{(siswaData.current_page - 1) * siswaData.per_page + index + 1}</TableCell> */}
                                    <TableCell>{siswa.nis}</TableCell>
                                    <TableCell>{siswa.name}</TableCell>
                                    <TableCell>
                                        <TranscriptViewAdmin id={siswa.id} />
                                    </TableCell>
                                    <TableCell>
                                        <MonitorPresensiGuru
                                            siswaId={siswa.id}
                                            isOpen={openPresensiDialogId === siswa.id}
                                            onOpenChange={(open) => {
                                                if (!open) handleClosePresensiDialog();
                                                else handleOpenPresensiDialog(siswa.id);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <SiswaDetail data={siswa} />
                                    </TableCell>
                                    {/* <TableCell>{siswa.alamat}</TableCell> */}
                                    {/* <TableCell>{siswa.jenis_kelamin}</TableCell>
                                    <TableCell>{siswa.phone}</TableCell>
                                    <TableCell>{siswa.siswa_role}</TableCell>
                                    <TableCell>{siswa.ortu?.name || '-'}</TableCell> */}
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
            {/* <div className="flex w-full flex-wrap items-center justify-center gap-2">
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
            </div> */}
        </div>
    );
}

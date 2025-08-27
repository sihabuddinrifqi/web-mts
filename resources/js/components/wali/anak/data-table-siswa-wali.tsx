import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { APIPaginateResponse } from '@/types/response';
import { Siswa } from '@/types/users';
import { router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TranscriptViewWali from './transcript-view-wali';
import MonitorPresensiWali from '@/components/wali/anak/presensi-view-wali';

type Props = {
  siswaData: APIPaginateResponse<Siswa>;
  filters: {
    search: string;
    page: number;
  };
};

export default function DataTableSiswaWali({ siswaData, filters }: Props) {
  const { url } = usePage();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [openPresensiDialogId, setOpenPresensiDialogId] = useState<number | null>(null); // State untuk dialog presensi

  // Parsing parameter URL untuk membuka dialog presensi secara otomatis
  useEffect(() => {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const siswaId = params.get('siswaId');
    if (siswaId) {
      setOpenPresensiDialogId(Number(siswaId)); // Buka dialog presensi untuk siswa dengan ID dari URL
    }
  }, [url]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(url.split('?')[0], { search: searchInput, page: 1 }, { preserveState: true, replace: true });
  };

  const handlePageChange = (pageUrl: string | null) => {
    if (pageUrl) {
      router.visit(pageUrl, { preserveState: true, replace: true });
    }
  };

  const handleOpenPresensiDialog = (siswaId: number) => {
    setOpenPresensiDialogId(siswaId); // Buka dialog presensi untuk siswa tertentu
  };

  const handleClosePresensiDialog = () => {
    setOpenPresensiDialogId(null); // Tutup dialog presensi
    // Hapus parameter siswaId dari URL
    router.get(url.split('?')[0], { search: searchInput, page: filters.page }, { preserveState: true, replace: true });
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
              <TableHead>NIS</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Transkrip Nilai</TableHead>
              <TableHead>Presensi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siswaData.data.length > 0 ? (
              siswaData.data.map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell>{siswa.nis}</TableCell>
                  <TableCell>{siswa.name}</TableCell>
                  <TableCell>{siswa.email}</TableCell>
                  <TableCell>
                    <TranscriptViewWali id={siswa.id} />
                  </TableCell>
                  <TableCell>
                    <MonitorPresensiWali
                      siswaId={siswa.id}
                      isOpen={openPresensiDialogId === siswa.id}
                      onOpenChange={(open) => {
                        if (!open) handleClosePresensiDialog();
                        else handleOpenPresensiDialog(siswa.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminSiswaPaginationResponse } from '@/types/admin/siswa';
import { router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { SiswaActionAdmin } from './siswa-action-admin';
import { SiswaDetail } from './siswa-detail';
import TranscriptViewAdmin from './transcript-view-admin';
import MonitorPresensiAdmin from './monitor-presensi-admin';

type Props = {
  siswaData: AdminSiswaPaginationResponse;
  filters: {
    search: string;
    page: number;
  };
};

export default function DataTableSiswaAdmin({ siswaData, filters }: Props) {
  const { url } = usePage();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [openPresensiDialogId, setOpenPresensiDialogId] = useState<number | null>(null);

  // Parsing parameter URL untuk membuka dialog presensi secara otomatis
  useEffect(() => {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const siswaId = params.get('siswaId');
    if (siswaId) {
      setOpenPresensiDialogId(Number(siswaId));
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
    setOpenPresensiDialogId(siswaId);
  };

  const handleClosePresensiDialog = () => {
    setOpenPresensiDialogId(null);
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
              <TableHead>No</TableHead>
              <TableHead>NIS</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Wali</TableHead>
              <TableHead>Presensi</TableHead>
              <TableHead>Transkrip Nilai</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siswaData.data.length > 0 ? (
              siswaData.data.map((siswa, index) => (
                <TableRow key={siswa.id}>
                  <TableCell>{(siswaData.current_page - 1) * siswaData.per_page + index + 1}</TableCell>
                  <TableCell>{siswa.nis}</TableCell>
                  <TableCell>{siswa.name}</TableCell>
                  <TableCell>{siswa.ortu?.name || '-'}</TableCell>
                  <TableCell>
                    <MonitorPresensiAdmin
                      siswaId={siswa.id}
                      isOpen={openPresensiDialogId === siswa.id}
                      onOpenChange={(open) => {
                        if (!open) handleClosePresensiDialog();
                        else handleOpenPresensiDialog(siswa.id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TranscriptViewAdmin id={siswa.id} />
                  </TableCell>
                  <TableCell>
                    <SiswaDetail data={siswa} />
                  </TableCell>
                  <TableCell>
                    <SiswaActionAdmin id={siswa.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
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
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APIResponse } from '@/types/response';
import { Siswa } from '@/types/users';
import { AlertCircle, Printer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// --- Tipe Data ---
interface Presensi {
  id: number;
  pelajaran: {
    id: number;
    nama_pelajaran: string;
  };
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  tanggal: string;
  semester: string;
}

interface SiswaWithPresensi extends Siswa {
  presensi?: Presensi[];
}

interface MonitorPresensiAdminProps {
  siswaId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- Fungsi Bantuan ---
const countStatus = (presensi: Presensi[] | undefined, status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'): number => {
  if (!presensi) return 0;
  return presensi.filter((p) => p.status === status).length;
};

const groupByPelajaran = (presensi: Presensi[]): Record<string, Presensi[]> => {
  return presensi.reduce((acc, curr) => {
    const pelajaran = curr.pelajaran.nama_pelajaran;
    if (!acc[pelajaran]) acc[pelajaran] = [];
    acc[pelajaran].push(curr);
    return acc;
  }, {} as Record<string, Presensi[]>);
};

export default function MonitorPresensiAdmin({ siswaId, isOpen, onOpenChange }: MonitorPresensiAdminProps) {
  const [semester, setSemester] = useState<string>('Semua');
  const [siswaData, setSiswaData] = useState<SiswaWithPresensi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data presensi siswa saat dialog dibuka
  useEffect(() => {
    if (isOpen && siswaId && !siswaData && !isLoading) {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token') || '';
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login ulang.');
        setIsLoading(false);
        return;
      }

      console.log('Mengambil data presensi untuk siswa ID:', siswaId);
      console.log('URL:', route('api.presensi.siswa', { siswa: siswaId }));
      console.log('Token:', token);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout 5 detik

      fetch(route('api.presensi.siswa', { siswa: siswaId }), {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then((response) => {
          clearTimeout(timeoutId);
          console.log('Status Respons:', response.status, response.statusText);
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || `Gagal mengambil data presensi. Status: ${response.status} ${response.statusText}`);
            });
          }
          return response.json();
        })
        .then((resp: APIResponse<SiswaWithPresensi>) => {
          console.log('Respons API:', resp);
          if (resp.success && resp.data) {
            setSiswaData(resp.data);
          } else {
            throw new Error('Data presensi tidak ditemukan atau format API tidak valid.');
          }
        })
        .catch((err) => {
          console.error('Error fetching presensi:', err);
          setError(err.message || 'Terjadi kesalahan saat mengambil data presensi.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, siswaId, siswaData, isLoading]);

  // Reset state saat dialog ditutup
  useEffect(() => {
    if (!isOpen) {
      setSiswaData(null);
      setError(null);
      setIsLoading(false);
      setSemester('Semua');
    }
  }, [isOpen]);

  // Daftar semester yang tersedia
  const availableSemesters = useMemo(() => {
    if (!siswaData?.presensi) return [];
    const semesters = Array.from(new Set(siswaData.presensi.map((presensi) => presensi.semester)));
    return ['Semua', ...semesters.sort()];
  }, [siswaData?.presensi]);

  // Filter presensi berdasarkan semester
  const filteredPresensi = useMemo(() => {
    if (!siswaData?.presensi) return [];
    return semester === 'Semua'
      ? siswaData.presensi
      : siswaData.presensi.filter((presensi) => presensi.semester === semester);
  }, [siswaData?.presensi, semester]);

  // Kelompokkan presensi berdasarkan pelajaran
  const groupedPresensi = useMemo(() => groupByPelajaran(filteredPresensi), [filteredPresensi]);

  // Render konten dialog
  const renderContent = () => {
    if (isLoading) {
      return <div className="py-12 text-center">Memuat data presensi siswa...</div>;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-destructive">
          <AlertCircle className="h-12 w-12" />
          <h3 className="font-semibold">Gagal Memuat Data</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!siswaData) {
      return <div className="py-12 text-center">Tidak ada data siswa untuk ditampilkan.</div>;
    }

    return (
      <>
        <div className="space-y-6 py-4">
          {/* Informasi Siswa dan Filter Semester */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Nama Siswa</div>
                <div className="font-semibold">{siswaData.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Angkatan</div>
                <div className="font-semibold">{siswaData.angkatan}</div>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabel Presensi */}
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mata Pelajaran</th>
                  <th className="w-20 px-4 py-3 text-center font-medium">Hadir</th>
                  <th className="w-20 px-4 py-3 text-center font-medium">Sakit</th>
                  <th className="w-20 px-4 py-3 text-center font-medium">Izin</th>
                  <th className="w-20 px-4 py-3 text-center font-medium">Alpa</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedPresensi).length > 0 ? (
                  Object.keys(groupedPresensi).map((pelajaran, index) => {
                    const presensiPelajaran = groupedPresensi[pelajaran];
                    const hadir = countStatus(presensiPelajaran, 'Hadir');
                    const sakit = countStatus(presensiPelajaran, 'Sakit');
                    const izin = countStatus(presensiPelajaran, 'Izin');
                    const alpa = countStatus(presensiPelajaran, 'Alpa');
                    return (
                      <tr key={`${pelajaran}-${index}`} className="border-t">
                        <td className="px-4 py-2">{pelajaran}</td>
                        <td className="px-4 py-2 text-center">{hadir || '-'}</td>
                        <td className="px-4 py-2 text-center">{sakit || '-'}</td>
                        <td className="px-4 py-2 text-center">{izin || '-'}</td>
                        <td className="px-4 py-2 text-center">{alpa || '-'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-t">
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada data presensi untuk semester ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-end">
            <Button asChild disabled={!siswaData?.nis}>
              <a
                href={siswaData?.nis ? '#' : '#'} // Ganti dengan rute yang valid setelah didefinisikan
                target="_blank"
                rel="noopener noreferrer"
              >
                <Printer className="mr-2 h-4 w-4" />
                Cetak Laporan Presensi
              </a>
            </Button>
          </div>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Lihat Presensi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-center">Laporan Presensi Siswa</DialogTitle>
          <DialogDescription className="mx-auto max-w-sm text-center">
            Ringkasan kehadiran siswa dalam setiap mata pelajaran berdasarkan semester.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
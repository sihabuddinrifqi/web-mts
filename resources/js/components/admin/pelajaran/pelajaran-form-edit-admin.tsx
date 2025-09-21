'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchableMultiSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/utils';
import { Guru } from '@/types/walisiswa/anak';
import { Siswa } from '@/types/admin/siswa';
import { APIPaginateResponse, APIResponse } from '@/types/response';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, Dispatch, SetStateAction } from 'react';

type PelajaranFormEditAdminProps = {
  id: number;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onUpdateSuccess: () => void;
};

/**
 * Tipe khusus untuk useForm (harus punya index signature supaya Inertia useForm happy)
 */
interface PelajaranFormType {
  nama_pelajaran: string;
  pengampu_id: number;
  semester: number;
  angkatan: string;
  siswa_ids: number[];
  [key: string]: any;
}

export default function PelajaranFormEditAdmin({ id, open, onOpenChange, onUpdateSuccess }: PelajaranFormEditAdminProps) {
  const [dataGuru, setDataGuru] = useState<Guru[]>([]);
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, setData, patch, processing, reset } = useForm<PelajaranFormType>({
    nama_pelajaran: '',
    pengampu_id: -1,
    semester: 1,
    angkatan: '',
    siswa_ids: [],
  });

  // load initial pelajaran, guru, dan siswa (berdasarkan angkatan pelajaran)
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      // detail pelajaran
      const pelajaranUrl = (window as any).route('api.detail.pelajaran', { pelajaran: id }) || `/api/detail/pelajaran/${id}`;
      const guruUrl = (window as any).route('api.guru') || '/api/guru';

      const [pelajaranRes, guruRes] = await Promise.all([fetch(pelajaranUrl), fetch(guruUrl)]);

      if (!pelajaranRes.ok) throw new Error(`Gagal memuat detail pelajaran (status ${pelajaranRes.status})`);
      if (!guruRes.ok) throw new Error(`Gagal memuat daftar guru (status ${guruRes.status})`);

      const pelajaranResp: APIResponse<any> = await pelajaranRes.json();
      const guruResp: APIPaginateResponse<Guru> = await guruRes.json();

      const p = pelajaranResp.data;
      // set form data
      setData({
        nama_pelajaran: p.nama_pelajaran || '',
        pengampu_id: p.pengampu_id ?? -1,
        semester: p.semester ?? 1,
        angkatan: p.angkatan ?? '',
        siswa_ids: (p.siswa && Array.isArray(p.siswa)) ? p.siswa.map((s: any) => s.id) : (p.siswa_ids || []),
      });

      setDataGuru(guruResp.data || []);

      // jika ada angkatan, ambil daftar siswa angkatan tsb
      const angkatan = p.angkatan;
      if (angkatan) {
        try {
          const siswaResp = await fetchApi<APIResponse<Siswa[]>>((window as any).route('api.siswa.angkatan', angkatan) || `/api/siswa/${angkatan}`);
          setDataSiswa(siswaResp.data || []);
        } catch (e) {
          // jangan gagal total hanya karena fetch siswa
          console.warn('Gagal memuat siswa angkatan:', angkatan, e);
          setDataSiswa([]);
        }
      } else {
        setDataSiswa([]);
      }
    } catch (err: any) {
      console.error('Gagal load initial data:', err);
      setError(err.message || 'Gagal memuat data awal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && id) loadInitialData();
    if (!open) {
      // reset ketika modal ditutup
      reset();
      setDataSiswa([]);
      setDataGuru([]);
      setError(null);
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  // saat user mengetik angkatan di input: jika 4 digit, fetch siswa angkatan
  const handleAngkatanChange = async (val: string) => {
    setData('angkatan', val);
    if (val.length !== 4) {
      setDataSiswa([]);
      return;
    }

    try {
      const siswaResp = await fetchApi<APIResponse<Siswa[]>>((window as any).route('api.siswa.angkatan', val) || `/api/siswa/angkatan/${val}`);
      setDataSiswa(siswaResp.data || []);
    } catch (err) {
      console.warn('Gagal memuat siswa untuk angkatan', val, err);
      setDataSiswa([]);
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch((window as any).route('admin.pelajaran.update', { pelajaran: id }) || `/admin/pelajaran/${id}`, {
      onSuccess: () => {
        onUpdateSuccess();
        onOpenChange(false);
      },
      onError: (err) => {
        console.error('Gagal memperbarui pelajaran:', err);
        setError('Gagal menyimpan perubahan. Periksa masukan Anda.');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Data Mata Pelajaran</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Memuat data...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">
            <p className="font-semibold">Terjadi Kesalahan:</p>
            <p className="text-sm">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={loadInitialData}>Coba Lagi</Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Nama Mata Pelajaran</label>
                <Input value={data.nama_pelajaran} onChange={(e) => setData('nama_pelajaran', e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Pengampu</label>
                  <Select value={data.pengampu_id > 0 ? data.pengampu_id.toString() : ''} onValueChange={(v) => setData('pengampu_id', parseInt(v))}>
                    <SelectTrigger><SelectValue placeholder="Pilih Pengampu" /></SelectTrigger>
                    <SelectContent>
                      {dataGuru.map((g) => <SelectItem key={g.id} value={`${g.id}`}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Semester</label>
                  <Select value={data.semester?.toString() ?? '1'} onValueChange={(v) => setData('semester', parseInt(v))}>
                    <SelectTrigger><SelectValue placeholder="Pilih Semester" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Untuk Angkatan</label>
                <Input type="number" value={data.angkatan} onChange={(e) => handleAngkatanChange(e.target.value)} placeholder="Contoh: 2025" />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Pilih Siswa (berdasarkan angkatan)</label>
                <SearchableMultiSelect
                  options={dataSiswa.map((s) => ({ id: s.id, name: s.name }))}
                  value={data.siswa_ids}
                  onChange={(v) => setData('siswa_ids', v)}
                  placeholder="Pilih Siswa"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
              <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

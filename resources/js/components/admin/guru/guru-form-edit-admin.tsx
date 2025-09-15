'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/utils';
import { FormEventHandler, useEffect, useState, Dispatch, SetStateAction } from 'react';

type GuruFormEditAdminProps = {
  id?: number;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

interface GuruRequestType {
  name: string;
  jenis_kelamin: 'laki-laki' | 'perempuan';
  phone: string;
}

interface Guru {
  id: number;
  name: string;
  jenis_kelamin: 'laki-laki' | 'perempuan';
  phone: string;
}

export default function GuruFormEditAdmin({ id, open, onOpenChange }: GuruFormEditAdminProps) {
  const [data, setData] = useState<GuruRequestType>({
    name: '',
    jenis_kelamin: 'laki-laki',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetData = (key: keyof GuruRequestType, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const loadGuruData = async () => {
    if (!id) {
      setError('ID guru tidak valid');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = route?.('api.detail.guru', { guru: id }) || `/api/detail/guru/${id}`;
      const res = await fetchApi<{ message: string; received: number; data: Guru }>(url);

      if (!res || !res.data) {
        throw new Error('Data guru tidak ditemukan');
      }

      const guru = res.data;
      setData({
        name: guru.name || '',
        jenis_kelamin: guru.jenis_kelamin || 'laki-laki',
        phone: guru.phone || '',
      });
    } catch (err: any) {
      console.error('❌ Error load guru:', err);
      setError(err.message || 'Gagal memuat data guru');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && id) loadGuruData();
  }, [open, id]);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!id) return;

    setProcessing(true);
    setError(null);

    try {
      // URL update sesuai resource route Laravel
      const updateUrl = route?.('admin.guru.update', { guru: id }) || `/admin/guru/${id}`;
      const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

      await fetchApi(updateUrl, {
        method: 'POST', // POST + _method: PUT
        data: {
          ...data,
          _method: 'PUT',
          _token: csrfToken,
        },
      });

      alert('Data guru berhasil diperbarui!');
      onOpenChange(false);
    } catch (err: any) {
      console.error('❌ Error update guru:', err);
      setError(err.message || 'Gagal menyimpan data guru');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Data Guru</DialogTitle>
          <DialogDescription>
            Perbarui informasi guru sesuai data terbaru. Pastikan semua kolom terisi dengan benar.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <p>Memuat data...</p>
            <p className="text-sm text-gray-500">ID: {id}</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">
            <p className="font-medium">Terjadi Kesalahan:</p>
            <p className="text-sm mt-2">{error}</p>
            <Button variant="outline" className="mt-4" onClick={loadGuruData}>
              Coba Lagi
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6 py-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="edit-nama" className="font-medium">Nama Lengkap</label>
              <Input
                id="edit-nama"
                placeholder="Masukkan nama lengkap"
                value={data.name}
                onChange={(e) => handleSetData('name', e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="jenisKelamin" className="font-medium">Jenis Kelamin</label>
              <Select
                value={data.jenis_kelamin}
                onValueChange={(val) => handleSetData('jenis_kelamin', val as 'laki-laki' | 'perempuan')}
                required
              >
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="telepon" className="font-medium">Nomor Telepon</label>
              <Input
                id="telepon"
                placeholder="Masukkan nomor telepon"
                value={data.phone}
                onChange={(e) => handleSetData('phone', e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

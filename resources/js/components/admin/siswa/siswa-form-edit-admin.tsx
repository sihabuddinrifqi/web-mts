'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { fetchApi } from '@/lib/utils';
import { SiswaRequestType, Siswa } from '@/types/admin/siswa';
import { APIPaginateResponse, APIResponse } from '@/types/response';
import { WaliSiswa } from '@/types/users';
import { Guru } from '@/types/walisiswa/anak';
import { FormEventHandler, useState, Dispatch, SetStateAction, useEffect } from 'react';

type SiswaFormEditAdminProps = {
  id?: number;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export default function SiswaFormEditAdmin({ id, open, onOpenChange }: SiswaFormEditAdminProps) {
const [selectedSiswaId, setSelectedSiswaId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<SiswaRequestType>>({});
  const [data, setData] = useState<SiswaRequestType>({
    name: '',
    nik: '',
    alamat: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    angkatan: new Date().getFullYear(),
    jenis_kelamin: 'pria',
    siswa_role: 'regular',
    guru_id: -1,
    ortu_id: -1,
  });

  const [dataWali, setDataWali] = useState<WaliSiswa[]>([]);
  const [dataGuru, setDataGuru] = useState<Guru[]>([]);

  const handleSetData = (key: keyof SiswaRequestType, value: any) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
  };

  const loadData = async () => {
    console.log('🔄 loadData dipanggil dengan ID:', id);
    if (!id || id <= 0) {
      setError('ID siswa tidak valid');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const siswaUrl = route?.('api.detail.siswa', { siswa: id }) || `/api/siswa/${id}`;
      const guruUrl = route?.('api.guru') || '/api/guru';
      const waliUrl = route?.('api.walisiswa') || '/api/walisiswa';

      console.log('🌐 Fetching:', { siswaUrl, guruUrl, waliUrl });

      const [siswaResponse, guruResponse, waliResponse] = await Promise.all([
        fetchApi<APIResponse<Siswa>>(siswaUrl),
        fetchApi<APIPaginateResponse<Guru>>(guruUrl),
        fetchApi<APIPaginateResponse<WaliSiswa>>(waliUrl),
      ]);

      if (!siswaResponse || !siswaResponse.data) {
        throw new Error('Data siswa tidak ditemukan');
      }

      setDataGuru(guruResponse.data || []);
      setDataWali(waliResponse.data || []);

      const siswa = siswaResponse.data;
      let formattedDate = '';
      if (siswa.tanggal_lahir) {
        try {
          const date = new Date(siswa.tanggal_lahir);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        } catch (dateError) {
          console.warn('Error formatting date:', dateError);
        }
      }

      setData({
        name: siswa.name || '',
        nik: String(siswa.nik || ''),
        alamat: siswa.alamat || '',
        tempat_lahir: siswa.tempat_lahir || '',
        tanggal_lahir: formattedDate,
        angkatan: siswa.angkatan || new Date().getFullYear(),
        jenis_kelamin: siswa.jenis_kelamin || 'pria',
        siswa_role: siswa.siswa_role || 'regular',
        guru_id: siswa.guru_id || -1,
        ortu_id: siswa.ortu_id || -1,
      });
    } catch (error: any) {
      console.error('❌ Error loading data:', error);
      setError(error.message || 'Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Load data tiap kali modal dibuka
  useEffect(() => {
    if (open && id) {
      loadData();
    }
  }, [open, id]);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const updateUrl = route?.('admin.siswa.update', { siswa: id }) || `/admin/siswa/${id}`;

      await fetchApi(updateUrl, {
  method: 'POST',
  data: {
    ...data,
    _method: 'PUT',
    _token: (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
  },
});



      onOpenChange(false);
    } catch (error: any) {
      console.error('❌ Failed to update siswa data:', error);

      if (error.errors) {
        setErrors(error.errors);
      } else {
        setError(error.message || 'Gagal memperbarui data siswa');
      }
    } finally {
      setProcessing(false);
    }
  };

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Data Siswa</DialogTitle>
          <DialogDescription>
            Perbarui informasi siswa sesuai data terbaru. Pastikan semua kolom terisi dengan benar.
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
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setError(null);
                loadData();
              }}
            >
              Coba Lagi
            </Button>
          </div>
        ) : (
                    <form onSubmit={submit}>
                        <div className="space-y-4 py-4">
                            {/* NIK */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="edit-nik" className="font-medium">NIK</label>
                                <Input 
                                    id="edit-nik" 
                                    placeholder="Masukan NIK" 
                                    value={data.nik} 
                                    onChange={(e) => handleSetData('nik', e.target.value)} 
                                    required 
                                />
                                {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
                            </div>

                            

                            {/* Nama & Jenis Kelamin */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-nama" className="font-medium">Nama Lengkap</label>
                                    <Input 
                                        id="edit-nama" 
                                        placeholder="Masukan nama lengkap" 
                                        value={data.name} 
                                        onChange={(e) => handleSetData('name', e.target.value)} 
                                        required 
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-jenisKelamin" className="font-medium">Jenis Kelamin</label>
                                    <Select 
                                        value={data.jenis_kelamin} 
                                        onValueChange={(val) => handleSetData('jenis_kelamin', val as 'pria' | 'wanita')} 
                                        required
                                    >
                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pria">Pria</SelectItem>
                                            <SelectItem value="wanita">Wanita</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            {/* Tempat & Tanggal Lahir */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-tempatLahir" className="font-medium">Tempat Lahir</label>
                                    <Input 
                                        id="edit-tempatLahir" 
                                        placeholder="Masukan Tempat Lahir" 
                                        value={data.tempat_lahir} 
                                        onChange={(e) => handleSetData('tempat_lahir', e.target.value)} 
                                        required 
                                    />
                                    {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-tanggalLahir" className="font-medium">Tanggal Lahir</label>
                                    <Input 
                                        type="date" 
                                        id="edit-tanggalLahir" 
                                        value={data.tanggal_lahir} 
                                        className="block w-full" 
                                        onChange={(e) => handleSetData('tanggal_lahir', e.target.value)} 
                                        required 
                                    />
                                    {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>}
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="edit-alamat" className="font-medium">Alamat</label>
                                <Textarea 
                                    id="edit-alamat" 
                                    placeholder="Masukan alamat lengkap" 
                                    rows={3} 
                                    value={data.alamat} 
                                    onChange={(e) => handleSetData('alamat', e.target.value)} 
                                    required 
                                />
                                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                            </div>

                            {/* Angkatan & Peran */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-angkatan" className="font-medium">Angkatan</label>
                                    <Input 
                                        id="edit-angkatan" 
                                        placeholder="Contoh: 2025" 
                                        type="number" 
                                        value={data.angkatan.toString()} 
                                        onChange={(e) => handleSetData('angkatan', parseInt(e.target.value) || new Date().getFullYear())} 
                                        required 
                                    />
                                     {errors.angkatan && <p className="text-sm text-red-500">{errors.angkatan}</p>}
                               </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-peran" className="font-medium">Jalur</label>
                                    <Select 
                                        value={data.siswa_role} 
                                        onValueChange={(ev) => handleSetData('siswa_role', ev as 'regular' | 'pengurus')} 
                                        required
                                    >
                                        <SelectTrigger><SelectValue placeholder="Regular" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="regular">Regular</SelectItem>
                                            <SelectItem value="pengurus">Beasiswa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Guru & Wali */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-guru" className="font-medium">Wali Kelas</label>
                                    <Select 
                                        value={data.guru_id > 0 ? data.guru_id.toString() : ""} 
                                        onValueChange={(value) => handleSetData('guru_id', parseInt(value) || -1)} 
                                        required
                                    >
                                        <SelectTrigger><SelectValue placeholder="Cari dan pilih guru..." /></SelectTrigger>
                                        <SelectContent>
                                            {dataGuru.length > 0 ? (
                                                dataGuru.map((guru) => (
                                                    <SelectItem key={guru.id} value={guru.id.toString()}>
                                                        {guru.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="-1" disabled>Tidak ada data guru</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.guru_id && <p className="text-sm text-red-500">{errors.guru_id}</p>}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-wali" className="font-medium">Nama Orang Tua / Wali</label>
                                    <Select 
                                        value={data.ortu_id > 0 ? data.ortu_id.toString() : ""} 
                                        onValueChange={(value) => handleSetData('ortu_id', parseInt(value) || -1)} 
                                        required
                                    >
                                         <SelectTrigger><SelectValue placeholder="Cari dan pilih wali..." /></SelectTrigger>
                                         <SelectContent>
                                            {dataWali.length > 0 ? (
                                                dataWali.map((wali) => (
                                                    <SelectItem key={wali.id} value={wali.id.toString()}>
                                                        {wali.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="-1" disabled>Tidak ada data wali</SelectItem>
                                            )}
                                         </SelectContent>
                                    </Select>
                                    {errors.ortu_id && <p className="text-sm text-red-500">{errors.ortu_id}</p>}
                                </div>
                            </div>
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

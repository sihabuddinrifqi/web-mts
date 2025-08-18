'use client';

import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { WaliSiswa } from '@/types/users';
import { useForm } from '@inertiajs/react';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';

type WalisiswaFormEditAdminProps = {
    id: number;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export default function WalisiswaFormEditAdmin({ id, open, onOpenChange }: WalisiswaFormEditAdminProps) {
    // State untuk menampilkan info (misal di judul)
    const [walisiswaInfo, setWalisiswaInfo] = useState<WaliSiswa | null>(null);

    // Gunakan useForm untuk data yang akan diedit dan dikirim
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: '',
        phone_number: '', // Sesuaikan nama field dengan model Anda
    });

    // Ambil data dari API saat dialog terbuka
    useEffect(() => {
        if (open) {
            // Reset form setiap kali dialog dibuka
            reset(); 
            setWalisiswaInfo(null);

            fetchApi<APIResponse<WaliSiswa>>(route('api.detail.walisiswa', { walisiswa: id })).then((resp) => {
                const fetchedData = resp.data;
                setWalisiswaInfo(fetchedData);
                // Panggil setData secara terpisah untuk setiap field
                setData('name', fetchedData.name || '');
                setData('phone_number', fetchedData.phone_number || '');
            });
        }
    }, [open, id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.walisiswa.update', id), {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Data: {walisiswaInfo?.name || '...'}</DialogTitle>
                    <DialogDescription>
                        Ubah informasi terkait wali siswa. Pastikan data yang baru sesuai dengan informasi yang valid.
                    </DialogDescription>
                </DialogHeader>

                {!walisiswaInfo ? (
                    <div className="py-12 text-center">Memuat data...</div>
                ) : (
                    <form onSubmit={submit} className="space-y-6 border-t py-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama" className="font-medium">Nama Lengkap</label>
                                <Input
                                    id="nama"
                                    placeholder="Masukan nama lengkap"
                                    value={data.name} // Gunakan state dari useForm
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="no" className="font-medium">Nomor Telepon</label>
                                <Input
                                    id="no"
                                    placeholder="Masukan telepon"
                                    value={data.phone_number} // Gunakan state dari useForm
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                />
                                {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
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
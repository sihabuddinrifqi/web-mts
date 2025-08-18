'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WaliSiswaRequestType } from '@/types/admin/walisiswa';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// The import for '@inertiajs/react' and 'sonner' has been removed to resolve the module error.
// Form submission will be handled with standard fetch and useState.

type WalisiswaFormAddAdminProps = {
    onSuccess?: () => void;
};

export default function WalisiswaFormAddAdmin({ onSuccess }: WalisiswaFormAddAdminProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<WaliSiswaRequestType>>({});
    const [data, setData] = useState<WaliSiswaRequestType>({
        name: '',
        phone: '',
        jenis_kelamin: 'pria',
        alamat: '',
        anak: [], 
    });

    const handleSetData = (key: keyof WaliSiswaRequestType, value: any) => {
        setData(prevData => ({ ...prevData, [key]: value }));
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

        try {
            const response = await fetch(route('admin.walisiswa.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 422) { // Validation error
                const errorData = await response.json();
                setErrors(errorData.errors);
                // You can add a toast error notification here if you have a notification library
            } else if (!response.ok) {
                throw new Error('Terjadi kesalahan pada server.');
            } else {
                setOpen(false); // Close dialog on success
                setData({ // Reset form
                    name: '', phone: '', jenis_kelamin: 'pria', alamat: '', anak: [],
                });
                // You can add a toast success notification here
                if (onSuccess) {
                    onSuccess(); // Call the callback to refresh parent page data
                }
            }
        } catch (error) {
            console.error('Gagal mengirim form:', error);
            // You can add a general error notification here
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus /> Tambah Wali Siswa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Data Wali Siswa Baru</DialogTitle>
                        <DialogDescription>
                            Lengkapi data berikut untuk menambahkan wali siswa baru. Pastikan semua informasi diisi dengan benar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama" className="font-medium">Nama Lengkap</label>
                                <Input required id="nama" placeholder="Masukan nama lengkap" value={data.name || ''} onChange={(ev) => handleSetData('name', ev.target.value)} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="no" className="font-medium">Nomor Telepon</label>
                                <Input required id="no" placeholder="Masukan telepon" value={data.phone || ''} onChange={(ev) => handleSetData('phone', ev.target.value)} />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="jenisKelamin" className="font-medium">Jenis Kelamin</label>
                                <Select value={data.jenis_kelamin} onValueChange={(ev) => handleSetData('jenis_kelamin', ev as 'pria' | 'wanita')} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pria">Pria</SelectItem>
                                        <SelectItem value="wanita">Wanita</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="alamat" className="font-medium">Alamat</label>
                            <Textarea
                                id="alamat"
                                placeholder="Masukan alamat lengkap"
                                rows={3}
                                value={data.alamat || ''}
                                onChange={(ev) => handleSetData('alamat', ev.target.value)}
                                required
                            />
                            {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Tambah Data'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

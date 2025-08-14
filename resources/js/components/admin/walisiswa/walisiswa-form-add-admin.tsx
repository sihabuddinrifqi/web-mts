import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WaliSiswaRequestType } from '@/types/admin/walisiswa';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function WalisiswaFormAddAdmin() {
    const { data, setData, post } = useForm<WaliSiswaRequestType>();
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.walisiswa.store'));
        // console.log(data);
    };
    return (
        <Dialog>
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
                            Lengkapi data berikut untuk menambahkan wali siswa baru. Pastikan semua informasi diisi dengan benar untuk keperluan
                            administrasi dan komunikasi dengan wali siswa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 border-t py-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama" className="font-medium">
                                    Nama Lengkap
                                </label>
                                <Input required id="nama" placeholder="Masukan nama lengkap" onChange={(ev) => setData('name', ev.target.value)} />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="no" className="font-medium">
                                    Nomor Telepon
                                </label>
                                <Input required id="no" placeholder="Masukan telepon" onChange={(ev) => setData('phone', ev.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="jenisKelamin" className="font-medium">
                                    Jenis Kelamin
                                </label>
                                <Select onValueChange={(ev) => setData('jenis_kelamin', ev as 'pria' | 'wanita')} required>
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
                            <label htmlFor="alamat" className="font-medium">
                                Alamat
                            </label>
                            <Textarea
                                id="alamat"
                                placeholder="Masukan alamat lengkap"
                                rows={3}
                                onChange={(ev) => setData('alamat', ev.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Tambah data</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

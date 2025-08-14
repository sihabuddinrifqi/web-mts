import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

type GuruFormEditAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
};

export default function GuruFormEditAdmin({ open, onOpenChange }: GuruFormEditAdminProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Data Guru</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi guru sesuai data terbaru. Pastikan semua kolom terisi dengan benar untuk keperluan administrasi dan
                        akademik.
                    </DialogDescription>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-6 border-t py-4">
                    {/* NIS & NIK */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nis" className="font-medium">
                                NIS
                            </label>
                            <Input id="nis" placeholder="Masukan NIS" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nik" className="font-medium">
                                NIK
                            </label>
                            <Input id="nik" placeholder="Masukan NIK" />
                        </div>
                    </div>

                    {/* Nama & Jenis Kelamin */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama" className="font-medium">
                                Nama Lengkap
                            </label>
                            <Input id="nama" placeholder="Masukan nama lengkap" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="jenisKelamin" className="font-medium">
                                Jenis Kelamin
                            </label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                                    <SelectItem value="perempuan">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tempat Lahir & Tanggal Lahir */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="tempatLahir" className="font-medium">
                                Tempat Lahir
                            </label>
                            <Input id="tempatLahir" placeholder="Masukan Tempat Lahir" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="tanggalLahir" className="font-medium">
                                Tanggal Lahir
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !date && 'text-gray-400')}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'PPP', { locale: id }) : 'Pilih tanggal'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="alamat" className="font-medium">
                            Alamat
                        </label>
                        <Textarea id="alamat" placeholder="Masukan alamat lengkap" rows={3} />
                    </div>

                    {/* Angkatan & Peran */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="angkatan" className="font-medium">
                                Angkatan
                            </label>
                            <Input id="angkatan" placeholder="contoh: 2025" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="peran" className="font-medium">
                                Peran
                            </label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Regular" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="khusus">Khusus</SelectItem>
                                    <SelectItem value="beasiswa">Beasiswa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Guru & Wali */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="guru" className="font-medium">
                                Guru Pembimbing
                            </label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="guru1">Guru Ahmad</SelectItem>
                                    <SelectItem value="guru2">Guru Mahmud</SelectItem>
                                    <SelectItem value="guru3">Guru Hasan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="wali" className="font-medium">
                                Nama Orang Tua / Wali
                            </label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Masukan nama orang tua" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wali1">Ahmad Ridwan Hakim</SelectItem>
                                    <SelectItem value="wali2">Nur Aini Fadillah</SelectItem>
                                    <SelectItem value="wali3">H. Muhammad Zainal Abidin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

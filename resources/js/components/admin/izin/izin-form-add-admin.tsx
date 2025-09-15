import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useState } from 'react';

export default function IzinFormAddAdmin() {
    const [open, setOpen] = useState(false);
    const [pulangOpen, setPulangOpen] = useState(false);
    const [kembaliOpen, setKembaliOpen] = useState(false);
    const [namaSiswa, setNamaSiswa] = useState('');
    const [namaPelapor, setNamaPelapor] = useState('');
    const [alasan, setAlasan] = useState('');
    const [tanggalPulang, setTanggalPulang] = useState<Date | undefined>(undefined);
    const [tanggalKembali, setTanggalKembali] = useState<Date | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Laporan
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Tambah Izin Siswa</DialogTitle>
                    <DialogDescription>
                        Pengajuan izin oleh siswa untuk keperluan tertentu, seperti keperluan keluarga, kesehatan, atau kegiatan luar pondok. Data
                        ini digunakan sebagai arsip administratif dan kontrol keluar-masuk siswa.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama-siswa" className="text-sm font-medium">
                                Nama Siswa
                            </label>
                            <Input
                                id="nama-siswa"
                                placeholder="Masukkan nama siswa"
                                value={namaSiswa}
                                onChange={(e) => setNamaSiswa(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama-pelapor" className="text-sm font-medium">
                                Pelapor ( Wali )
                            </label>
                            <Input
                                id="nama-pelapor"
                                placeholder="Masukkan nama pelapor"
                                value={namaPelapor}
                                onChange={(e) => setNamaPelapor(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="alasan" className="text-sm font-medium">
                                Alasan
                            </label>
                            <Textarea
                                id="alasan"
                                placeholder="Masukkan alasan yang jelas dan lengkap"
                                rows={4}
                                value={alasan}
                                onChange={(e) => setAlasan(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tanggal-pulang" className="text-sm font-medium">
                                    Tanggal Pulang
                                </label>
                                <Popover open={pulangOpen} onOpenChange={setPulangOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="tanggal-pulang"
                                            variant="outline"
                                            className={cn('w-full justify-start text-left font-normal', !tanggalPulang && 'text-muted-foreground')}
                                            onClick={() => setPulangOpen(true)}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tanggalPulang ? format(tanggalPulang, 'PPP') : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tanggalPulang}
                                            onSelect={(date) => {
                                                setTanggalPulang(date);
                                                setPulangOpen(false);
                                            }}
                                            
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tanggal-kembali" className="text-sm font-medium">
                                    Tanggal Kembali
                                </label>
                                <Popover open={kembaliOpen} onOpenChange={setKembaliOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="tanggal-kembali"
                                            variant="outline"
                                            className={cn('w-full justify-start text-left font-normal', !tanggalKembali && 'text-muted-foreground')}
                                            onClick={() => setKembaliOpen(true)}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tanggalKembali ? format(tanggalKembali, 'PPP') : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tanggalKembali}
                                            onSelect={(date) => {
                                                setTanggalKembali(date);
                                                setKembaliOpen(false);
                                            }}
                                            
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="submit" variant={'default'}>
                            Tambah Data
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

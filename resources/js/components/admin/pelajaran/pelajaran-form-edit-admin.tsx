'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

type PelajaranFormEditAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
};

export default function PelajaranFormEditAdmin({ open, onOpenChange, id }: PelajaranFormEditAdminProps) {
    const [namaPelajaran, setNamaPelajaran] = useState("Kitab Ta'limul Muta'allim");
    const [pengampu, setPengampu] = useState('Ust. Ahmad Zaki Mubarak');
    const [semester, setSemester] = useState('Ganjil');
    const [angkatan, setAngkatan] = useState('');
    const [siswa, setSiswa] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Data Pembelajaran</DialogTitle>
                    <DialogDescription>
                        Ubah informasi terkait mata pelajaran yang telah terdaftar di sistem. Data ini akan digunakan untuk keperluan akademik, jadwal
                        pengajaran, dan pencatatan nilai siswa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama-pelajaran" className="text-sm font-medium">
                                Nama Mata Pelajaran
                            </label>
                            <Input id="nama-pelajaran" value={namaPelajaran} onChange={(e) => setNamaPelajaran(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="pengampu" className="text-sm font-medium">
                                    Pengampu
                                </label>
                                <Select value={pengampu} onValueChange={setPengampu}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Pengampu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ust. Ahmad Zaki Mubarak">Ust. Ahmad Zaki Mubarak</SelectItem>
                                        <SelectItem value="Ust. Abdul Malik">Ust. Abdul Malik</SelectItem>
                                        <SelectItem value="Ust. Muhammad Faisal">Ust. Muhammad Faisal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="semester" className="text-sm font-medium">
                                    Semester
                                </label>
                                <Select value={semester} onValueChange={setSemester}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ganjil">Ganjil</SelectItem>
                                        <SelectItem value="Genap">Genap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Pilih Siswa</label>
                            <div className="grid grid-cols-2 gap-4">
                                <Select value={angkatan} onValueChange={setAngkatan}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Angkatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={siswa} onValueChange={setSiswa}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="semua">Semua Siswa</SelectItem>
                                        <SelectItem value="pilihan">Siswa Pilihan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant={'default'}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

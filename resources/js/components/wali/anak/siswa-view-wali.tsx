import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {  Printer, Search } from 'lucide-react';
import { useState } from 'react';

export default function SiswaViewWali() {
    const [semester, setSemester] = useState('Ganjil');

    const studentData = {
        name: 'Fathimah Zahra',
        year: '2024',
        grades: [
            { subject: "Tafsir Al-Qur'an", semester: 'Ganjil', score: 82 },
            { subject: "Kitab Ta'limul Muta'allim", semester: 'Ganjil', score: 82 },
            { subject: 'Hadis dan Mustholah', semester: 'Ganjil', score: 82 },
            { subject: 'Ilmu Nahwu (Jurumiyah)', semester: 'Ganjil', score: 82 },
        ],
    };

    // Calculate average
    const average = studentData.grades.reduce((sum, item) => sum + item.score, 0) / studentData.grades.length;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    <Search /> Detail Siswa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Transkip Nilai Siswa</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Ringkasan hasil belajar siswa selama mengikuti program pendidikan di Pondok Pesantren.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 border-b">
                    <div className="flex items-end justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-sm">Nama Siswa</div>
                                <div className="font-semibold">{studentData.name}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Angkatan</div>
                                <div className="font-semibold">{studentData.year}</div>
                            </div>
                        </div>

                        <div className="w-48">
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                                    <SelectItem value="Genap">Genap</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Mata Pelajaran</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData.grades.map((grade, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-4">{grade.subject}</td>
                                        <td className="px-4 py-4">{grade.semester}</td>
                                        <td className="px-4 py-4 text-right">{grade.score}</td>
                                    </tr>
                                ))}
                                <tr className="bg-muted border-t">
                                    <td colSpan={2} className="px-4 py-4 font-medium">
                                        Rata rata
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium">{average}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                        <Button variant="default">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak transkrip nilai
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

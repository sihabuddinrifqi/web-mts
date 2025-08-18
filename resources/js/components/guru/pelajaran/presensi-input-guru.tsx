'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pelajaran } from '@/types/pelajaran';
import { APIResponse } from '@/types/response';
import { CalendarCheck, Search, Save, Users, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- Tipe Data Lokal ---
type PresensiSiswa = {
    id: number;
    siswa_id: number;
    pelajaran_id: number;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpha';
    keterangan?: string;
    siswa: {
        id: number;
        name: string;
        nis: string;
    };
};

type PresensiData = {
    id: number;
    siswa: {
        id: number;
        name: string;
        nis: string;
    };
    status: 'hadir' | 'sakit' | 'izin' | 'alpha';
    keterangan?: string;
};

export default function PresensiInputGuru({ pelajaran }: { pelajaran: Pelajaran }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    const [studentsData, setStudentsData] = useState<PresensiData[]>([]);
    const [displayedData, setDisplayedData] = useState<PresensiData[]>([]);
    const [editedStatus, setEditedStatus] = useState<{
        status: 'hadir' | 'sakit' | 'izin' | 'alpha';
        keterangan: string;
    }>({
        status: 'hadir',
        keterangan: ''
    });

    // Fungsi untuk mengambil data presensi
    const fetchPresensiData = (date: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // PERBAIKAN: Fungsi route() dapat melempar error jika nama route tidak ditemukan.
            // Kita bungkus dengan try...catch untuk menangkap error tersebut.
            // PASTIKAN NAMA ROUTE INI ('api.detail.pelajaran.presensi') SUDAH BENAR
            // DAN TERDAFTAR DI FILE ROUTES LARAVEL ANDA.
            const url = route('api.detail.pelajaran.presensi', { pelajaran: pelajaran.id, tanggal: date });

            fetch(url)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Gagal mengambil data presensi. Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((resp: APIResponse<PresensiData[]>) => {
                    if (resp && resp.data) {
                        setStudentsData(resp.data);
                    } else {
                        throw new Error('Struktur data dari API tidak valid.');
                    }
                })
                .catch(err => {
                    console.error("Gagal mengambil data presensi:", err);
                    setError(err.message || 'Terjadi kesalahan.');
                    setStudentsData([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });

        } catch (err: any) {
            // Menangkap error dari Ziggy jika route tidak ada
            console.error("Error pada konfigurasi route Ziggy:", err);
            setError(err.message || "Konfigurasi route frontend-backend salah.");
            setStudentsData([]);
            setIsLoading(false); // Pastikan loading berhenti jika ada error
        }
    };
    
    // Efek untuk mengambil ulang data saat dialog dibuka atau tanggal berubah
    useEffect(() => {
        if (isOpen) {
            fetchPresensiData(selectedDate);
        }
    }, [isOpen, selectedDate]);


    // Efek untuk memfilter data berdasarkan pencarian
    useEffect(() => {
        const filteredData = studentsData.filter((student) =>
            student.siswa?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.siswa?.nis.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDisplayedData(filteredData);
    }, [searchQuery, studentsData]);

    // Reset state saat dialog ditutup
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setEditingIndex(null);
            setError(null);
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const handleEditClick = (index: number): void => {
        const studentPresensi = displayedData[index];
        setEditingIndex(index);
        setEditedStatus({
            status: studentPresensi.status || 'hadir',
            keterangan: studentPresensi.keterangan || ''
        });
    };

    const saveAttendance = async (index: number, status: 'hadir' | 'sakit' | 'izin' | 'alpha', keterangan: string) => {
        const studentToUpdate = displayedData[index];
        if (!studentToUpdate.siswa) return;

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        if (!csrfToken) {
            console.error('CSRF token tidak ditemukan.');
            return;
        }

        const payload = {
            siswa_id: studentToUpdate.siswa.id,
            pelajaran_id: pelajaran.id,
            tanggal: selectedDate,
            status: status,
            keterangan: keterangan || null,
        };

        try {
            const response = await fetch('/guru/presensi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server merespon dengan error:', errorData);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const result: APIResponse<PresensiSiswa> = await response.json();
            const updatedStudents = studentsData.map((student) =>
                student.siswa.id === result.data.siswa_id 
                    ? { ...student, status: result.data.status, keterangan: result.data.keterangan } 
                    : student
            );
            setStudentsData(updatedStudents);
            setEditingIndex(null);
        } catch (error) {
            console.error('Gagal menyimpan presensi:', error);
        }
    };
    
    const handleQuickAttendance = async (index: number, isPresent: boolean) => {
        const status = isPresent ? 'hadir' : 'alpha';
        await saveAttendance(index, status, '');
    };

    const handleSaveClick = async (index: number) => {
        await saveAttendance(index, editedStatus.status, editedStatus.keterangan);
    };

    const markAllPresent = async () => {
        const promises = displayedData.map((_, index) => saveAttendance(index, 'hadir', ''));
        await Promise.all(promises);
    };

    const getAttendanceSummary = () => ({
        hadir: studentsData.filter(s => s.status === 'hadir').length,
        sakit: studentsData.filter(s => s.status === 'sakit').length,
        izin: studentsData.filter(s => s.status === 'izin').length,
        alpha: studentsData.filter(s => s.status === 'alpha').length,
        total: studentsData.length
    });

    const getStatusColor = (status: 'hadir' | 'sakit' | 'izin' | 'alpha') => {
        switch (status) {
            case 'hadir': return 'text-green-600 bg-green-50';
            case 'sakit': return 'text-yellow-600 bg-yellow-50';
            case 'izin': return 'text-blue-600 bg-blue-50';
            case 'alpha': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const summary = getAttendanceSummary();

    const renderContent = () => {
        if (isLoading) {
            return <div className="py-12 text-center">Memuat data presensi...</div>;
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-destructive">
                    <AlertCircle className="h-12 w-12" />
                    <h3 className="font-semibold">Gagal Memuat Data</h3>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }
        return (
            <div className="space-y-4 py-4">
                {/* Kontrol dan Ringkasan */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="date-picker" className="text-sm font-medium">Tanggal:</label>
                            <Input
                                id="date-picker"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-auto"
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={markAllPresent}
                            disabled={studentsData.length === 0}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Tandai Semua Hadir
                        </Button>
                    </div>
                    
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                            placeholder="Cari nama atau NIS siswa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg border p-4 sm:grid-cols-5">
                    <div className="text-center"><div className="text-lg font-bold text-green-600">{summary.hadir}</div><div className="text-xs text-gray-500">Hadir</div></div>
                    <div className="text-center"><div className="text-lg font-bold text-yellow-600">{summary.sakit}</div><div className="text-xs text-gray-500">Sakit</div></div>
                    <div className="text-center"><div className="text-lg font-bold text-blue-600">{summary.izin}</div><div className="text-xs text-gray-500">Izin</div></div>
                    <div className="text-center"><div className="text-lg font-bold text-red-600">{summary.alpha}</div><div className="text-xs text-gray-500">Alpha</div></div>
                    <div className="text-center"><div className="text-lg font-bold">{summary.total}</div><div className="text-xs text-gray-500">Total</div></div>
                </div>

                {/* Tabel Presensi */}
                <div className="overflow-hidden rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">NIS</th>
                                <th className="px-4 py-3 text-left font-medium">Nama Siswa</th>
                                <th className="w-24 px-4 py-3 text-center font-medium">Quick</th>
                                <th className="w-32 px-4 py-3 text-center font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Keterangan</th>
                                <th className="w-28 px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.length > 0 ? (
                                displayedData.map((student, index) => (
                                    <tr key={`${student.siswa.id}-${selectedDate}`} className="border-t">
                                        <td className="px-4 py-2 font-mono text-sm">{student.siswa?.nis}</td>
                                        <td className="px-4 py-2 font-medium">{student.siswa?.name}</td>
                                        
                                        <td className="px-4 py-2 text-center">
                                            <Checkbox
                                                checked={student.status === 'hadir'}
                                                onCheckedChange={(checked) => handleQuickAttendance(index, checked as boolean)}
                                                disabled={editingIndex === index}
                                            />
                                        </td>

                                        {editingIndex === index ? (
                                            <>
                                                <td className="px-2 py-2">
                                                    <Select
                                                        value={editedStatus.status}
                                                        onValueChange={(value: 'hadir' | 'sakit' | 'izin' | 'alpha') => 
                                                            setEditedStatus({ ...editedStatus, status: value })
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="hadir">Hadir</SelectItem>
                                                            <SelectItem value="sakit">Sakit</SelectItem>
                                                            <SelectItem value="izin">Izin</SelectItem>
                                                            <SelectItem value="alpha">Alpha</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <Input
                                                        value={editedStatus.keterangan}
                                                        onChange={(e) => setEditedStatus({ ...editedStatus, keterangan: e.target.value })}
                                                        placeholder="Keterangan (opsional)"
                                                        className="h-8"
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(student.status)}`}>
                                                        {student.status?.toUpperCase() || 'BELUM'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600">{student.keterangan || '-'}</td>
                                            </>
                                        )}

                                        <td className="px-4 py-2 text-right">
                                            {editingIndex === index ? (
                                                <div className="flex gap-1">
                                                    <Button size="sm" onClick={() => handleSaveClick(index)} className="h-8"><Save className="h-3 w-3" /></Button>
                                                    <Button variant="outline" size="sm" onClick={() => setEditingIndex(null)} className="h-8">✕</Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline" size="sm" onClick={() => handleEditClick(index)} className="h-8">Edit</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                                        Tidak ada siswa yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <CalendarCheck className="mr-2 h-4 w-4" /> Input Presensi
                </Button>
            </DialogTrigger>
            <DialogContent 
                className="max-h-screen overflow-y-auto sm:max-w-4xl"
            >
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Input Presensi Siswa
                    </DialogTitle>
                    <DialogDescription>
                        Input presensi untuk pelajaran {pelajaran.nama_pelajaran} pada tanggal yang dipilih.
                    </DialogDescription>
                </DialogHeader>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}

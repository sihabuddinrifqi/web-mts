'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pelajaran as BasePelajaran } from '@/types/pelajaran';
import { APIResponse } from '@/types/response';
import { CalendarCheck, Search, Save, Users, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';


// --- Tipe Data Lokal ---
type Pelajaran = BasePelajaran & {
    pengampu_id?: number;
};

type PresensiState = {
    id?: number;
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    const [presensiList, setPresensiList] = useState<PresensiState[]>([]);
    
    const [editedStatus, setEditedStatus] = useState<{
        status: 'hadir' | 'sakit' | 'izin' | 'alpha';
        keterangan: string;
    }>({ status: 'hadir', keterangan: '' });

    const fetchPresensiData = async (date: string) => {
        if (!pelajaran || !pelajaran.id) {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const url = route('api.detail.pelajaran.presensi', { pelajaran: pelajaran.id, tanggal: date });
            // SOLUSI: Tambahkan 'credentials' untuk menyertakan cookies sesi
            const response = await fetch(url, { credentials: 'same-origin' });
            if (!response.ok) {
                    const text = await response.text();
                    let message = 'Gagal menyimpan data.';
                    try {
                        const errorData = JSON.parse(text);
                        message = errorData.message || message;
                    } catch {
                        message = text; // kalau bukan JSON, pakai plain text
                    }
                    throw new Error(message);
                }

            const resp: APIResponse<PresensiState[]> = await response.json();
            setPresensiList(resp.data || []);
        } catch (err: any) {
            console.error("Gagal mengambil data presensi:", err);
            setError(err.message || 'Terjadi kesalahan.');
            setPresensiList([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            fetchPresensiData(selectedDate);
        }
    }, [isOpen, selectedDate, pelajaran]);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setEditingIndex(null);
            setError(null);
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const displayedData = presensiList.filter(p =>
        p.siswa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.siswa.nis.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const saveAttendance = async (student: PresensiState, newStatus: 'hadir' | 'sakit' | 'izin' | 'alpha', newKeterangan: string) => {
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        if (!csrfToken) {
            setError('CSRF token tidak ditemukan.');
            return false;
        }

        const payload = {
            siswa_id: student.siswa.id,
            pelajaran_id: pelajaran.id,
            guru_id: pelajaran.pengampu_id,
            tanggal: selectedDate,
            status: newStatus,
            keterangan: newKeterangan || null,
        };

        try {
            const response = await fetch(route('api.guru.presensi.store'), {
                method: 'POST',
                credentials: 'same-origin', 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                 const text = await response.text();
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menyimpan data.');
            }

            const result: APIResponse<PresensiState> = await response.json();
            
            setPresensiList(currentList =>
                currentList.map(p => 
                    p.siswa.id === result.data.siswa.id ? result.data : p
                )
            );
            return true;
        } catch (err: any) {
            console.error('Gagal menyimpan presensi:', err);
            setError(err.message);
            return false;
        }
    };
    
    const handleQuickAttendance = async (student: PresensiState, isPresent: boolean) => {
        const newStatus = isPresent ? 'hadir' : 'alpha';
        await saveAttendance(student, newStatus, student.keterangan || '');
    };

    const handleEditClick = (index: number): void => {
        const studentPresensi = displayedData[index];
        setEditingIndex(index);
        setEditedStatus({
            status: studentPresensi.status || 'hadir',
            keterangan: studentPresensi.keterangan || ''
        });
    };

    const handleSaveClick = async (index: number) => {
        const studentToUpdate = displayedData[index];
        const success = await saveAttendance(studentToUpdate, editedStatus.status, editedStatus.keterangan);
        if (success) {
            setEditingIndex(null);
        }
    };
    
    const summary = {
        hadir: presensiList.filter(s => s.status === 'hadir').length,
        sakit: presensiList.filter(s => s.status === 'sakit').length,
        izin: presensiList.filter(s => s.status === 'izin').length,
        alpha: presensiList.filter(s => s.status === 'alpha').length,
        total: presensiList.length
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <CalendarCheck className="mr-2 h-4 w-4" /> Input Presensi
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-4xl">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2">Input Presensi Siswa</DialogTitle>
                    <DialogDescription>
                        Input presensi untuk pelajaran {pelajaran.nama_pelajaran}.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="date-picker" className="text-sm font-medium">Tanggal:</label>
                        <Input
                            id="date-picker"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-auto"
                        />
                    </div>

                    {isLoading ? <div className="py-12 text-center">Memuat data...</div> :
                     error ? <div className="py-12 text-center text-destructive">{error}</div> :
                     (
                        <>
                            <div className="grid grid-cols-2 gap-2 rounded-lg border p-4 sm:grid-cols-5">
                                <div className="text-center"><div className="text-lg font-bold text-green-600">{summary.hadir}</div><div className="text-xs text-gray-500">Hadir</div></div>
                                <div className="text-center"><div className="text-lg font-bold text-yellow-600">{summary.sakit}</div><div className="text-xs text-gray-500">Sakit</div></div>
                                <div className="text-center"><div className="text-lg font-bold text-blue-600">{summary.izin}</div><div className="text-xs text-gray-500">Izin</div></div>
                                <div className="text-center"><div className="text-lg font-bold text-red-600">{summary.alpha}</div><div className="text-xs text-gray-500">Alpha</div></div>
                                <div className="text-center"><div className="text-lg font-bold">{summary.total}</div><div className="text-xs text-gray-500">Total</div></div>
                            </div>
                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">NIS</th>
                                            <th className="px-4 py-3 text-left font-medium">Nama Siswa</th>
                                            <th className="w-24 px-4 py-3 text-center font-medium">Hadir</th>
                                            <th className="w-32 px-4 py-3 text-center font-medium">Status</th>
                                            <th className="px-4 py-3 text-left font-medium">Keterangan</th>
                                            <th className="w-28 px-4 py-3 text-right font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedData.map((student, index) => (
                                            <tr key={student.siswa.id} className="border-t">
                                                <td className="px-4 py-2">{student.siswa.nis}</td>
                                                <td className="px-4 py-2 font-medium">{student.siswa.name}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <Checkbox
                                                        checked={student.status === 'hadir'}
                                                        onCheckedChange={(checked) => handleQuickAttendance(student, checked as boolean)}
                                                        disabled={editingIndex === index}
                                                    />
                                                </td>
                                                {editingIndex === index ? (
                                                    <>
                                                        <td className="px-2 py-2">
                                                            <Select value={editedStatus.status} onValueChange={(v) => setEditedStatus({...editedStatus, status: v as any})}>
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
                                                            <Input value={editedStatus.keterangan} onChange={(e) => setEditedStatus({...editedStatus, keterangan: e.target.value})} className="h-8" />
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-4 py-2 text-center">{String(student.status).toUpperCase()}</td>

                                                        <td className="px-4 py-2">{student.keterangan || '-'}</td>
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                     )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

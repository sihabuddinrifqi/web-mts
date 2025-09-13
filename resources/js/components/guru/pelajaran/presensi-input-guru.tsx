'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pelajaran as BasePelajaran } from '@/types/pelajaran';
import { APIResponse } from '@/types/response';
import { CalendarCheck, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- Tipe Data Lokal ---
type Pelajaran = BasePelajaran & { pengampu_id?: number };
type PresensiState = {
    id?: number;
    siswa: { id: number; name: string; nis: string };
    status: 'hadir' | 'sakit' | 'izin' | 'alpha';
};

export default function PresensiInputGuru({ pelajaran }: { pelajaran: Pelajaran }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [presensiList, setPresensiList] = useState<PresensiState[]>([]);
    const [editedStatus, setEditedStatus] = useState<'hadir' | 'sakit' | 'izin' | 'alpha'>('hadir');

    // Fetch presensi sesuai tanggal
    const fetchPresensiData = async (date: string) => {
        if (!pelajaran?.id) return;

        setIsLoading(true);
        setError(null);
        try {
            const url = route('api.detail.pelajaran.presensi', { pelajaran: pelajaran.id, tanggal: date });
            const response = await fetch(url, { credentials: 'same-origin' });

            if (!response.ok) {
                const text = await response.text();
                let message = 'Gagal mengambil data.';
                try { message = JSON.parse(text).message || message; } catch { message = text; }
                throw new Error(message);
            }

            const resp: APIResponse<PresensiState[]> = await response.json();
            setPresensiList(resp.data || []);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Terjadi kesalahan.');
            setPresensiList([]);
        } finally { setIsLoading(false); }
    };

    // Refresh presensi setiap tanggal berubah
    useEffect(() => {
        if (pelajaran?.id) fetchPresensiData(selectedDate);
    }, [selectedDate, pelajaran]);

    // Reset state saat dialog ditutup
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

    const saveAttendance = async (student: PresensiState, newStatus: 'hadir' | 'sakit' | 'izin' | 'alpha') => {
        let csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
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
        };

        try {
            const response = await fetch(route('api.guru.presensi.store'), {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                let message = 'Gagal menyimpan data.';
                try { 
                    const errorData = JSON.parse(text);
                    message = errorData.message || message;
                    
                    // Handle CSRF token mismatch
                    if (response.status === 419 || message.includes('CSRF')) {
                        // Try to refresh CSRF token and retry once
                        try {
                            const refreshResponse = await fetch('/api/csrf-token', {
                                method: 'GET',
                                credentials: 'same-origin',
                            });
                            
                            if (refreshResponse.ok) {
                                const refreshData = await refreshResponse.json();
                                csrfToken = refreshData.csrf_token;
                                
                                // Update meta tag
                                const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
                                if (meta) {
                                    meta.content = csrfToken;
                                }
                                
                                // Retry the request
                                const retryResponse = await fetch(route('api.guru.presensi.store'), {
                                    method: 'POST',
                                    credentials: 'same-origin',
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                                    body: JSON.stringify(payload),
                                });
                                
                                if (retryResponse.ok) {
                                    const retryResult: APIResponse<PresensiState> = await retryResponse.json();
                                    setPresensiList(currentList => currentList.map(p => p.siswa.id === retryResult.data.siswa.id ? retryResult.data : p));
                                    return true;
                                }
                            }
                        } catch (refreshError) {
                            console.error('Failed to refresh CSRF token:', refreshError);
                        }
                    }
                } catch { message = text; }
                throw new Error(message);
            }

            const result: APIResponse<PresensiState> = await response.json();
            setPresensiList(currentList => currentList.map(p => p.siswa.id === result.data.siswa.id ? result.data : p));
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            return false;
        }
    };

    const handleQuickAttendance = async (student: PresensiState, isPresent: boolean) =>
        await saveAttendance(student, isPresent ? 'hadir' : 'alpha');

    const handleEditClick = (index: number) => {
        const studentPresensi = displayedData[index];
        setEditingIndex(index);
        setEditedStatus(studentPresensi.status || 'hadir');
    };

    const handleSaveClick = async (index: number) => {
        const studentToUpdate = displayedData[index];
        if (await saveAttendance(studentToUpdate, editedStatus))
            setEditingIndex(null);
    };

    const summary = {
        hadir: presensiList.filter(s => s.status === 'hadir').length,
        sakit: presensiList.filter(s => s.status === 'sakit').length,
        izin: presensiList.filter(s => s.status === 'izin').length,
        alpha: presensiList.filter(s => s.status === 'alpha').length,
        total: presensiList.length,
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
                        <Input id="date-picker" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-auto" />
                    </div>

                    {isLoading ? (
                        <div className="py-12 text-center">Memuat data...</div>
                    ) : error ? (
                        <div className="py-12 text-center text-destructive">{error}</div>
                    ) : (
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
                                            <th className="px-4 py-3 text-right font-medium">Aksi</th>
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
                                                    <td className="px-2 py-2" colSpan={2}>
                                                        <Select value={editedStatus} onValueChange={(v) => setEditedStatus(v as any)}>
                                                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="hadir">Hadir</SelectItem>
                                                                <SelectItem value="sakit">Sakit</SelectItem>
                                                                <SelectItem value="izin">Izin</SelectItem>
                                                                <SelectItem value="alpha">Alpha</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                ) : (
                                                    <td className="px-4 py-2 text-center">{student.status.toUpperCase()}</td>
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

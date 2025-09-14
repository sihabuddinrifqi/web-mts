import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Props = {
    pelajaranId: number;
};

interface PresensiData {
    id: number;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpha';
    keterangan?: string;
}

interface SiswaPresensi {
    id: number;
    name: string;
    nis: string;
    presensi: PresensiData[];
}

export default function PresensiModal({ pelajaranId }: Props) {
    const [loading, setLoading] = useState(false);
    const [siswa, setSiswa] = useState<SiswaPresensi[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`api.detail.pelajaran.${pelajaranId}/siswa`, {
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            setSiswa(data);
        } catch (err: any) {
            console.error("Error fetch siswa:", err);
            setError(err.message || 'Gagal mengambil data siswa');
        } finally {
            setLoading(false);
        }
    };

    // Get unique dates from all presensi data
    const getAllDates = () => {
        const dates = new Set<string>();
        siswa.forEach(s => {
            s.presensi.forEach(p => {
                dates.add(p.tanggal);
            });
        });
        return Array.from(dates).sort();
    };

    const allDates = getAllDates();

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    // Get presensi for specific date and siswa
    const getPresensiForDate = (siswa: SiswaPresensi, tanggal: string) => {
        return siswa.presensi.find(p => p.tanggal === tanggal);
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            hadir: 'default',
            sakit: 'secondary',
            izin: 'outline',
            alpha: 'destructive',
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants] || 'default'} className="text-xs">
                {status === 'hadir' ? 'H' :
                 status === 'sakit' ? 'S' :
                 status === 'izin' ? 'I' : 'A'}
            </Badge>
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="default" onClick={loadData}>
                    Lihat Presensi
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Data Presensi Mata Pelajaran</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Memuat data presensi...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="border px-4 py-3 text-left font-medium">NIS</th>
                                    <th className="border px-4 py-3 text-left font-medium">Nama Siswa</th>
                                    {allDates.map((tanggal) => (
                                        <th key={tanggal} className="border px-2 py-3 text-center font-medium min-w-16">
                                            {formatDate(tanggal)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {siswa.map((s) => (
                                    <tr key={s.id}>
                                        <td className="border px-4 py-2 font-medium">{s.nis}</td>
                                        <td className="border px-4 py-2 font-medium">{s.name}</td>
                                        {allDates.map((tanggal) => {
                                            const presensi = getPresensiForDate(s, tanggal);
                                            return (
                                                <td key={tanggal} className="border px-2 py-2 text-center">
                                                    {presensi ? (
                                                        getStatusBadge(presensi.status)
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';

type IzinFormDeleteWaliProps = {
    id: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

// Bentuk data minimal agar title bisa tampil
type TIzin = {
    id: number;
    keterangan?: string;      
    siswa?: { name?: string }; 
};

export default function IzinFormDeleteWali({ id, open, onOpenChange }: IzinFormDeleteWaliProps) {
    const [data, setData] = useState<TIzin | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Ambil detail izin saat dialog dibuka
    useEffect(() => {
        let canceled = false;
        async function load() {
            setErr(null);
            setData(null);
            try {
                const resp = await fetchApi<APIResponse<TIzin>>(route('api.detail.izin', id));
                if (!canceled) setData(resp.data);
            } catch (e) {
                if (!canceled) setErr('Gagal memuat detail izin.');
            }
        }
        if (open && id) load();
        return () => { canceled = true; };
    }, [open, id]);

    const handleDelete = () => {
        setSubmitting(true);
        setErr(null);
        // Gunakan Inertia router.delete
        router.delete(route('wali.izin.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                onOpenChange(false); // Tutup dialog jika berhasil
            },
            onError: () => {
                setSubmitting(false);
                setErr('Gagal menghapus izin. Coba beberapa saat lagi.');
            },
            onFinish: () => setSubmitting(false),
        });
    };

    // Judul dinamis berdasarkan data yang di-fetch
    const judul = data?.keterangan
        ? `Apakah Anda yakin ingin menghapus izin "${data.keterangan}"?`
        : 'Apakah Anda yakin ingin menghapus izin ini?';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-center text-xl font-bold">
                        {/* Menampilkan judul dinamis atau pesan loading */}
                        {!data && !err ? 'Memuat data...' : judul}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tindakan ini akan menghapus data izin dari sistem dan tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                {/* Menampilkan pesan error jika ada */}
                {err && (
                    <div className="mt-2 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle size={16} className="mt-0.5" />
                        <span>{err}</span>
                    </div>
                )}

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <AlertCircle size={16} />
                    <span>Data yang dihapus tidak dapat dikembalikan.</span>
                </div>

                <DialogFooter className="mt-4 flex w-full justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={submitting || !data}>
                        {submitting ? 'Menghapus…' : 'Hapus Data'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';

type IzinFormDeleteAdminProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
id: number;
};

// Bentuk data minimal agar title bisa tampil
type TIzin = {
  id: number;
  keterangan?: string;     // mis: "Sakit", "Izin Acara"
  siswa?: { name?: string }; // opsional, kalau mau tampil nama siswa
};

export default function IzinFormDeleteAdmin({ id, open, onOpenChange }: IzinFormDeleteAdminProps) {
  const [data, setData] = useState<TIzin | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Ambil detail izin saat modal dibuka
  useEffect(() => {
    let canceled = false;
    async function load() {
      setErr(null);
      setData(null);
      try {
        // -> sesuaikan nama rute API detail-mu
        const resp = await fetchApi<APIResponse<TIzin>>(route('api.detail.izin', id));
        if (!canceled) setData(resp.data);
      } catch (e) {
        if (!canceled) setErr('Gagal memuat detail izin.');
      }
    }
    if (open && id) load();
    return () => { canceled = true; };
  }, [open, id]);

  const handleDelete = async () => {
    setSubmitting(true);
    setErr(null);
    // Gunakan Inertia router.delete agar tidak bergantung ke <Link>
    router.delete(route('admin.izin.destroy', { izin: id }), {
    preserveScroll: true,
    onSuccess: () => {
        setSubmitting(false);
        onOpenChange(false);
    },
    onError: (errors: any) => {
        setSubmitting(false);
        setErr('Gagal menghapus izin. Pastikan tidak ada data yang masih terkait (contoh: constraint FK).');
    },
    onFinish: () => setSubmitting(false),
    });
  };

  const judul = data?.keterangan
    ? `Apakah Anda yakin ingin menghapus izin "${data.keterangan}"?`
    : 'Apakah Anda yakin ingin menghapus izin ini?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-xl font-bold">
            {judul}
          </DialogTitle>
          <DialogDescription className="text-center">
            Tindakan ini akan menghapus data izin siswa dari sistem. Proses tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {err && (
          <div className="mt-2 flex items-start gap-2 rounded-md border p-3 text-sm">
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
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Menghapus…' : 'Hapus data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

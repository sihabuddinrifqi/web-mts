import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchApi } from '@/lib/utils';
import { Pelajaran } from '@/types/pelajaran';
import { APIResponse } from '@/types/response';
import { Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

type PelajaranFormDeleteAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
    // Tambahkan prop onDeleteSuccess ke dalam tipe.
    onDeleteSuccess: () => void;
};

export default function PelajaranFormDeleteAdmin({ open, onOpenChange, id, onDeleteSuccess }: PelajaranFormDeleteAdminProps) {
    const [pelajaran, setPelajaran] = useState<Pelajaran | undefined>();

    const handleSuccess = () => {
        // Panggil fungsi callback setelah Inertia berhasil menghapus data.
        onDeleteSuccess();
        // Tutup modal setelah berhasil
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-xl"
                // [PERBAIKAN] Menggunakan fungsi fetchApi yang diimpor secara langsung.
                onOpenAutoFocus={(ev) => fetchApi<APIResponse<Pelajaran>>((window as any).route('api.detail.pelajaran', id)).then((resp) => setPelajaran(resp.data))}
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="text-center text-xl font-bold">
                        Apakah Anda yakin ingin menghapus mata pelajaran "{pelajaran?.nama_pelajaran}"?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tindakan ini akan menghapus semua data terkait seperti nilai siswa untuk pelajaran ini.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 rounded-md border bg-muted/50 p-4">
                    <div>
                        <p className="text-sm text-gray-500">Nama Mata Pelajaran</p>
                        <p className="font-medium">{pelajaran?.nama_pelajaran}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Pengampu</p>
                            <p className="font-medium">{pelajaran?.pengampu?.name || '-'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Semester</p>
                            <p className="font-medium capitalize">{pelajaran?.semester}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                    <AlertCircle size={16} />
                    <span>Data yang telah dihapus tidak dapat dikembalikan.</span>
                </div>

                <DialogFooter className="mt-4 flex w-full justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button variant="destructive" asChild>
                        <Link href={(window as any).route('admin.pelajaran.destroy', id)} method="delete" as="button" onSuccess={handleSuccess}>
                            Ya, Hapus Data
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


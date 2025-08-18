import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Walisiswa } from '@/types/admin/walisiswa';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';

type WalisiswaFormDeleteAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
};

// Nama komponen sudah disesuaikan
export default function WalisiswaFormDeleteAdmin({ open, onOpenChange, id }: WalisiswaFormDeleteAdminProps) {
    // 1. Gunakan state untuk menampung data dinamis dari API
    const [data, setData] = useState<Walisiswa | undefined>(undefined);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-2xl"
                
                onOpenAutoFocus={(ev) =>
                    fetchApi<APIResponse<Walisiswa>>(route('api.detail.walisiswa', id)).then((resp) => setData(resp.data))
                }
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="mx-auto max-w-lg text-center text-xl font-bold">
                        {/* 3. Tampilkan nama secara dinamis dari state 'data' */}
                        Apakah Anda yakin ingin menghapus data wali siswa "{data?.name}"?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tindakan ini akan menghapus semua data yang terkait dengan wali siswa tersebut.
                    </DialogDescription>
                </DialogHeader>

                {/* 4. Tampilkan detail data dari state, gunakan optional chaining (?) untuk keamanan */}
                <div className="grid grid-cols-2 gap-4 border-t py-4">
                    <div>
                        <p className="text-sm text-gray-500">Nomor Telepon</p>
                        <p className="font-medium">{data?.phone_number || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Jumlah Anak</p>
                        <p className="font-medium">{data?.anak?.length || 0}</p>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    <span>Data yang dihapus tidak dapat dikembalikan.</span>
                </div>

                <DialogFooter className="mt-4 flex w-full justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button variant="destructive" asChild>
                        {/* Pastikan nama route sudah benar */}
                        <Link href={route('admin.walisiswa.destroy', id)} method="delete">
                            Hapus data
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
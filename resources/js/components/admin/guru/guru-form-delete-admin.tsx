import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchApi } from '@/lib/utils';
import { Guru } from '@/types/admin/guru';
import { APIResponse } from '@/types/response';
import { Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

type GuruFormDeleteAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
    onDeleteSuccess: () => void;
};

export default function GuruFormDeleteAdmin({ open, onOpenChange , id, onDeleteSuccess }: GuruFormDeleteAdminProps) {
    const [data, setData] = useState<Guru | undefined>(undefined);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="h-screen overflow-y-auto sm:max-w-2xl"
                onOpenAutoFocus={(ev) => fetchApi<APIResponse<Guru>>(route('api.detail.guru', id)).then((resp) => setData(resp.data))}
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="mx-auto max-w-lg text-center text-xl font-bold">
                        Apakah Anda yakin ingin menghapus data guru "{data?.name}"?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tindakan ini akan menghapus semua data yang terkait dengan guru tersebut.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 border-t py-4">
                    <div>
                        <p className="text-sm">Jumlah Anak</p>
                        <p className="font-medium">{data?.anak?.length}</p>
                    </div>
                    <div>
                        <p className="text-sm">Jumlah Pelajaran</p>
                        <p className="font-medium">{data?.pelajaran?.length}</p>
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
                        {/* [PERBAIKAN] Logika handleSuccess dipindahkan ke sini sebagai inline function */}
                        <Link
                            href={(window as any).route('admin.guru.destroy', id)}
                            method="delete"
                            as="button"
                            onSuccess={() => {
                                onDeleteSuccess();
                                onOpenChange(false);
                            }}
                        >
                            Hapus data
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

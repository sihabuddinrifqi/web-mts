import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

type SiswaFormDeleteAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
};

export default function WalisiswaFormDeleteAdmin({ open, onOpenChange, id }: SiswaFormDeleteAdminProps) {
    const waliSiswaData = {
        namaLengkap: 'Ahmad Ridwan Hakim',
        nomorTelpon: '0812 3456 7890',
        jumlahAnak: 2,
        anakList: ['Laila Mardhiyah', 'Akbar Syahputra'],
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-2xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="mx-auto max-w-lg text-center text-xl font-bold">
                        Apakah Anda yakin ingin menghapus data wali siswa "{waliSiswaData.namaLengkap}"?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tindakan ini akan menghapus semua data yang terkait dengan wali siswa tersebut.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="grid grid-cols-2 gap-y-4">
                        <div>
                            <h3 className="text-sm text-gray-500">Nama Lengkap</h3>
                            <p className="font-medium">{waliSiswaData.namaLengkap}</p>
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-500">Nomor Telpon</h3>
                            <p className="font-medium">{waliSiswaData.nomorTelpon}</p>
                        </div>

                        <div className="col-span-2">
                            <h3 className="text-sm text-gray-500">Jumlah Anak</h3>
                            <p className="font-medium">{waliSiswaData.jumlahAnak}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-sm text-gray-500">Siswa yang Diwalikan</h3>
                        <div className="space-y-1">
                            {waliSiswaData.anakList.map((anak, index) => (
                                <p key={index} className="font-medium">
                                    {index + 1}. {anak}
                                </p>
                            ))}
                        </div>
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
                        <Link href={route('admin.walisiswa.destroy', id)} method="delete">
                            Hapus data
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

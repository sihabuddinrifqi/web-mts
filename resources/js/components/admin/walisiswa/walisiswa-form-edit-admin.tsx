import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { WaliSiswa } from '@/types/users';

type SiswaFormEditAdminProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    walisiswa: WaliSiswa;
};

export default function WalisiswaFormEditAdmin({ open, onOpenChange, walisiswa }: SiswaFormEditAdminProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Data Wali Siswa</DialogTitle>
                    <DialogDescription>
                        Ubah informasi terkait wali siswa. Pastikan data yang baru sesuai dengan informasi yang valid untuk keperluan administrasi.
                    </DialogDescription>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-6 border-t py-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama" className="font-medium">
                                Nama Lengkap
                            </label>
                            <Input id="nama" placeholder="Masukan nama lengkap" value={walisiswa.name} />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="no" className="font-medium">
                                Nomor Telepon
                            </label>
                            <Input id="no" placeholder="Masukan telepon" value={walisiswa.phone} />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import IzinFormDeleteWali from './izin-form-delete-wali';

// Definisikan tipe props yang akan diterima oleh komponen
type IzinActionWaliProps = {
    id: number;
    status: 'accepted' | 'rejected' | null;
};

// Ubah menjadi function component biasa yang menerima props
export function IzinActionWali({ id, status }: IzinActionWaliProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={'icon'} className="h-8 w-8 p-0 border">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Tambahkan kondisi 'disabled'.
                      Wali tidak bisa menghapus izin jika statusnya sudah diubah oleh admin (accepted/rejected).
                    */}
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={status !== null}>
                        <Trash2 className="mr-1 h-4 w-4" /> Hapus Izin
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Pastikan 'id' yang diterima dari props diteruskan ke komponen form delete */}
            <IzinFormDeleteWali id={id} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
}
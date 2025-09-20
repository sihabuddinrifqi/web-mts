'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WaliSiswa } from '@/types/users';
import { EllipsisVertical, PenBox, Trash2 } from 'lucide-react';
import { useState } from 'react';
import WalisiswaFormDeleteAdmin from './walisiswa-form-delete-admin';
import WalisiswaFormEditAdmin from './walisiswa-form-edit-admin';
import { router } from '@inertiajs/react';

export const WalisiswaActionAdmin: React.FC<{ walisiswa: WaliSiswa }> = (props) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    /**
     * Fungsi ini akan dipanggil dari dalam form setelah aksi berhasil.
     * Tugasnya adalah memicu Inertia untuk memuat ulang data di halaman.
     */
    const handleActionSuccess = () => {
        console.log(`Aksi untuk wali siswa ID ${props.walisiswa.id} berhasil. Memuat ulang data...`);
        // @ts-ignore - preserveScroll adalah opsi yang valid di Inertia.js
        router.reload({ preserveScroll: true });
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={'icon'} className="h-8 w-8 border p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
                        <PenBox className="mr-1 h-4 w-4" /> Edit Wali Siswa
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-1 h-4 w-4" /> Hapus Wali Siswa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Menghubungkan callback onUpdateSuccess ke form edit */}
            <WalisiswaFormEditAdmin
                id={props.walisiswa.id}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onUpdateSuccess={handleActionSuccess}
            />
            {/* Menghubungkan callback onDeleteSuccess ke form hapus */}
            <WalisiswaFormDeleteAdmin
                id={props.walisiswa.id}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onDeleteSuccess={handleActionSuccess}
            />
        </>
    );
};

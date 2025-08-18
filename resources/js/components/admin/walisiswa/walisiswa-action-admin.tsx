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

export const WalisiswaActionAdmin: React.FC<{ walisiswa: WaliSiswa }> = (props) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                        <PenBox className="mr-1 h-4 w-4" /> Edit Wali Siswa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-1 h-4 w-4" /> Hapus Wali Siswa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <WalisiswaFormEditAdmin id={props.walisiswa.id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
            <WalisiswaFormDeleteAdmin id={props.walisiswa.id} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
};

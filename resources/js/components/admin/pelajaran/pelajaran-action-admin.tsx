'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, PenBox, Trash2 } from 'lucide-react';
import { useState } from 'react';
import PelajaranFormDeleteAdmin from './pelajaran-form-delete-admin';
import PelajaranFormEditAdmin from './pelajaran-form-edit-admin';

export function PelajaranActionAdmin({ id }: { id: number }) {
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
                        <PenBox className="mr-1 h-4 w-4" /> Edit pelajaran
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-1 h-4 w-4" /> Hapus pelajaran
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <PelajaranFormEditAdmin id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
            <PelajaranFormDeleteAdmin id={id} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
}

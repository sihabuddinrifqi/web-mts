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
import { EllipsisVertical, PenBox, Trash2 } from 'lucide-react';
import { useState } from 'react';
import GuruFormDeleteAdmin from './guru-form-delete-admin';
import GuruFormEditAdmin from './guru-form-edit-admin';

export const GuruActionAdmin: React.FC<{ id: number }> = (props) => {
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
                        <PenBox className="mr-1 h-4 w-4" /> Edit Guru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-1 h-4 w-4" /> Hapus Guru
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <GuruFormEditAdmin id={props.id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
            <GuruFormDeleteAdmin id={props.id} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
};

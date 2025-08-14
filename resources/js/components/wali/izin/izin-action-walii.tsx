'use client';

import type React from 'react';

import {  EllipsisVertical, Trash2 } from 'lucide-react';
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
import IzinFormDeleteAdmin from './izin-form-delete-wali';


export const IzinActionWali: React.FC = () => {

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

                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-1 h-4 w-4" /> Hapus Izin
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <IzinFormDeleteAdmin open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
};

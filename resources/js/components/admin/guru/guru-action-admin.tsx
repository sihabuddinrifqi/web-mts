'use client';

import type React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, PenBox, Trash2 } from 'lucide-react';
import { useState } from 'react';
import GuruFormDeleteAdmin from './guru-form-delete-admin';
import GuruFormEditAdmin from './guru-form-edit-admin';
import { router } from '@inertiajs/react';

export const GuruActionAdmin: React.FC<{ id: number }> = (props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /**
   * Fungsi ini akan dipanggil dari dalam form setelah aksi berhasil (edit/hapus).
   * Tugasnya adalah memicu Inertia untuk memuat ulang data di halaman.
   */
  const handleActionSuccess = () => {
    console.log(`Aksi untuk guru ID ${props.id} berhasil. Memuat ulang data...`);
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

          {/* Menggunakan onSelect untuk praktik terbaik dengan komponen DropdownMenu */}
          <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
            <PenBox className="mr-1 h-4 w-4" /> Edit Guru
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-1 h-4 w-4" /> Hapus Guru
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menghubungkan callback onUpdateSuccess ke form edit */}
      <GuruFormEditAdmin
        id={props.id}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateSuccess={handleActionSuccess}
      />
      {/* Menghubungkan callback onDeleteSuccess ke form hapus */}
      <GuruFormDeleteAdmin
        id={props.id}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleteSuccess={handleActionSuccess}
      />
    </>
  );
};


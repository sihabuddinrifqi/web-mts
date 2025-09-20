'use client';

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
import SiswaFormDeleteAdmin from './siswa-form-delete-admin';
import SiswaFormEditAdmin from './siswa-form-edit-admin';
import { router } from '@inertiajs/react';

export function SiswaActionAdmin({ id }: { id: number }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fungsi callback umum untuk menangani sukses (baik edit maupun delete)
  // Ini akan memicu Inertia untuk memuat ulang data dari server.
  const handleActionSuccess = () => {
    console.log(`Aksi untuk siswa ID ${id} berhasil. Memuat ulang data...`);
    // @ts-ignore - preserveScroll adalah opsi yang valid, namun mungkin tidak ada di definisi tipe yang lebih lama.
    router.reload({ preserveScroll: true });
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 border p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
            <PenBox className="mr-1 h-4 w-4" /> Edit siswa
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-1 h-4 w-4" /> Hapus siswa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal edit dengan prop onUpdateSuccess yang sudah terhubung */}
      <SiswaFormEditAdmin
        id={id}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateSuccess={handleActionSuccess}
      />

      {/* Modal delete */}
      <SiswaFormDeleteAdmin
        id={id}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}


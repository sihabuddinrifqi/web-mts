'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Calendar, Printer } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface PresensiData {
    id: number;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpha';
    keterangan?: string;
}

interface Presensi {
    siswa: {
        id: number;
        name: string;
        nis: string;
    };
    pelajaran: {
        id: number;
        nama_pelajaran: string;
    };
    guru: {
        id: number;
        name: string;
    };
    presensi_data: PresensiData[];
    total_hadir: number;
    total_sakit: number;
    total_izin: number;
    total_alpha: number;
    total_presensi: number;
}

interface Pelajaran {
    id: number;
    nama_pelajaran: string;
    pengampu: {
        name: string;
    };
}

interface PresensiPaginationResponse {
    data: Presensi[];
    links: any[];
    meta: any;
}

interface AdminPresensiPageProps {
    presensi: PresensiPaginationResponse;
    pelajaran: Pelajaran[];
    filters: {
        search?: string;
        pelajaran_id?: string;
        tanggal?: string;
        status?: string;
    };
}

export default function AdminPresensiPage({ presensi, pelajaran, filters }: AdminPresensiPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [pelajaranFilter, setPelajaranFilter] = useState(filters.pelajaran_id || '');
    const [tanggalFilter, setTanggalFilter] = useState(filters.tanggal || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('admin.presensi.index'), {
            search: search || undefined,
            pelajaran_id: pelajaranFilter || undefined,
            tanggal: tanggalFilter || undefined,
            status: statusFilter || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            hadir: 'default',
            sakit: 'secondary',
            izin: 'outline',
            alpha: 'destructive',
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants] || 'default'}>
                {status.toUpperCase()}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Data Presensi" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Presensi</h1>
                        <p className="text-muted-foreground">
                            Kelola dan pantau data presensi siswa
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                                const params = new URLSearchParams();
                                if (pelajaranFilter) params.append('pelajaran_id', pelajaranFilter);
                                if (tanggalFilter) params.append('tanggal', tanggalFilter);
                                if (statusFilter) params.append('status', statusFilter);
                                window.open(route('presensi.pdf') + '?' + params.toString(), '_blank');
                            }}
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Laporan Presensi
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Filter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Data
                        </CardTitle>
                        <CardDescription>
                            Gunakan filter di bawah ini untuk mencari data presensi yang spesifik
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cari Siswa</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Nama atau NIS siswa..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mata Pelajaran</label>
                                <Select value={pelajaranFilter} onValueChange={setPelajaranFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mata pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua Mata Pelajaran</SelectItem>
                                        {pelajaran.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.nama_pelajaran}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tanggal</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="date"
                                        value={tanggalFilter}
                                        onChange={(e) => setTanggalFilter(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua Status</SelectItem>
                                        <SelectItem value="hadir">Hadir</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="alpha">Alpha</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">&nbsp;</label>
                                <Button onClick={handleFilter} className="w-full">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Terapkan Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Presensi Siswa per Mata Pelajaran</CardTitle>
                        <CardDescription>
                            Menampilkan {presensi.data.length} dari {presensi.meta.total} data presensi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {presensi.data.map((presensi, index) => (
                                <div key={index} className="rounded-md border p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{presensi.siswa.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                NIS: {presensi.siswa.nis} | {presensi.pelajaran.nama_pelajaran} | Guru: {presensi.guru.name}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="default" className="bg-green-500">
                                                Hadir: {presensi.total_hadir}
                                            </Badge>
                                            <Badge variant="secondary">
                                                Sakit: {presensi.total_sakit}
                                            </Badge>
                                            <Badge variant="outline">
                                                Izin: {presensi.total_izin}
                                            </Badge>
                                            <Badge variant="destructive">
                                                Alpha: {presensi.total_alpha}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tanggal</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Keterangan</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {presensi.presensi_data.map((data) => (
                                                    <TableRow key={data.id}>
                                                        <TableCell className="font-medium">
                                                            {formatDate(data.tanggal)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(data.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.keterangan || '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {presensi.links && presensi.links.length > 3 && (
                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {presensi.meta.from} sampai {presensi.meta.to} dari {presensi.meta.total} data
                                </div>
                                <div className="flex space-x-2">
                                    {presensi.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

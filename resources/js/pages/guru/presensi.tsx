'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Calendar, Users, Printer } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Presensi {
    id: number;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpha';
    keterangan?: string;
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

interface GuruPresensiPageProps {
    presensi: PresensiPaginationResponse;
    pelajaran: Pelajaran[];
    filters: {
        search?: string;
        pelajaran_id?: string;
        tanggal?: string;
        status?: string;
    };
}

export default function GuruPresensiPage({ presensi, pelajaran, filters }: GuruPresensiPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [pelajaranFilter, setPelajaranFilter] = useState(filters.pelajaran_id || '');
    const [tanggalFilter, setTanggalFilter] = useState(filters.tanggal || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('guru.presensi.index'), {
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
            <Head title="Data Presensi Siswa Didik" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Presensi Siswa Didik</h1>
                        <p className="text-muted-foreground">
                            Pantau presensi siswa yang menjadi tanggung jawab Anda sebagai wali kelas
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Data Presensi Siswa Didik
                        </CardTitle>
                        <CardDescription>
                            Menampilkan {presensi.data.length} dari {presensi.meta.total} data presensi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Mata Pelajaran</TableHead>
                                        <TableHead>Guru</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {presensi.data.map((presensi) => (
                                        <TableRow key={presensi.id}>
                                            <TableCell className="font-medium">
                                                {formatDate(presensi.tanggal)}
                                            </TableCell>
                                            <TableCell>{presensi.siswa.nis}</TableCell>
                                            <TableCell className="font-medium">
                                                {presensi.siswa.name}
                                            </TableCell>
                                            <TableCell>{presensi.pelajaran.nama_pelajaran}</TableCell>
                                            <TableCell>{presensi.guru.name}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(presensi.status)}
                                            </TableCell>
                                            <TableCell>
                                                {presensi.keterangan || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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

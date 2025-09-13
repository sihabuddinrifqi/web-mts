'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, BookOpen, Users } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Nilai {
    id: number;
    nilai: number;
    semester: number;
    siswa: {
        id: number;
        name: string;
        nis: string;
    };
    pelajaran: {
        id: number;
        nama_pelajaran: string;
    };
}

interface Pelajaran {
    id: number;
    nama_pelajaran: string;
    pengampu: {
        name: string;
    };
}

interface NilaiPaginationResponse {
    data: Nilai[];
    links: any[];
    meta: any;
}

interface WalisiswaNilaiPageProps {
    nilai: NilaiPaginationResponse;
    pelajaran: Pelajaran[];
    filters: {
        search?: string;
        pelajaran_id?: string;
        semester?: string;
    };
}

export default function WalisiswaNilaiPage({ nilai, pelajaran, filters }: WalisiswaNilaiPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [pelajaranFilter, setPelajaranFilter] = useState(filters.pelajaran_id || '');
    const [semesterFilter, setSemesterFilter] = useState(filters.semester || '');

    const handleFilter = () => {
        router.get(route('wali.nilai.index'), {
            search: search || undefined,
            pelajaran_id: pelajaranFilter || undefined,
            semester: semesterFilter || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getNilaiBadge = (nilai: number) => {
        if (nilai >= 90) {
            return <Badge variant="default" className="bg-green-500">A</Badge>;
        } else if (nilai >= 80) {
            return <Badge variant="default" className="bg-blue-500">B</Badge>;
        } else if (nilai >= 70) {
            return <Badge variant="default" className="bg-yellow-500">C</Badge>;
        } else if (nilai >= 60) {
            return <Badge variant="default" className="bg-orange-500">D</Badge>;
        } else {
            return <Badge variant="destructive">E</Badge>;
        }
    };

    return (
        <>
            <Head title="Data Nilai Anak" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Data Nilai Anak</h1>
                        <p className="text-muted-foreground">
                            Pantau nilai anak Anda di pondok pesantren
                        </p>
                    </div>
                    <div className="flex gap-2">
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
                            Gunakan filter di bawah ini untuk mencari data nilai yang spesifik
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cari Anak</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Nama atau NIS anak..."
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
                                <label className="text-sm font-medium">Semester</label>
                                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua Semester</SelectItem>
                                        <SelectItem value="1">Semester 1</SelectItem>
                                        <SelectItem value="2">Semester 2</SelectItem>
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
                            Data Nilai Anak
                        </CardTitle>
                        <CardDescription>
                            Menampilkan {nilai.data.length} dari {nilai.meta.total} data nilai
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama Anak</TableHead>
                                        <TableHead>Mata Pelajaran</TableHead>
                                        <TableHead>Semester</TableHead>
                                        <TableHead>Nilai</TableHead>
                                        <TableHead>Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nilai.data.map((nilai) => (
                                        <TableRow key={nilai.id}>
                                            <TableCell className="font-medium">
                                                {nilai.siswa.nis}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {nilai.siswa.name}
                                            </TableCell>
                                            <TableCell>{nilai.pelajaran.nama_pelajaran}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    Semester {nilai.semester}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {nilai.nilai}
                                            </TableCell>
                                            <TableCell>
                                                {getNilaiBadge(nilai.nilai)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {nilai.links && nilai.links.length > 3 && (
                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {nilai.meta.from} sampai {nilai.meta.to} dari {nilai.meta.total} data
                                </div>
                                <div className="flex space-x-2">
                                    {nilai.links.map((link, index) => (
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

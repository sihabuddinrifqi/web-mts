// resources/js/components/admin/pelajaran/data-table-pelajaran-admin.tsx

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { router, usePage } from "@inertiajs/react";
import { PelajaranActionAdmin } from "./pelajaran-action-admin";
import { AdminPelajaranResponse, Pelajaran } from "@/types/admin/pelajaran";

type Props = {
  siswaData: AdminPelajaranResponse;
  filters: {
    search: string;
    page: number;
  };
};

export default function DataTablePelajaranAdmin({ siswaData, filters }: Props) {
  const { url } = usePage();
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [filterPengampu, setFilterPengampu] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      url.split("?")[0],
      {
        search: searchInput,
        semester: filterSemester,
        pengampu: filterPengampu,
        page: 1,
      },
      { preserveState: true, replace: true }
    );
  };

  const handlePageChange = (pageUrl: string | null) => {
    if (pageUrl) {
      router.visit(pageUrl, { preserveState: true, replace: true });
    }
  };

  const handleReset = () => {
    setSearchInput("");
    setFilterSemester("");
    setFilterPengampu("");
    router.get(
      url.split("?")[0],
      { search: "", semester: "", pengampu: "", page: 1 },
      { preserveState: true, replace: true }
    );
  };

  // Ambil pengampu unik
  const uniquePengampu = useMemo(() => {
    const list = siswaData.data
      .map((p) => p.pengampu?.name)
      .filter((v): v is string => !!v);
    return Array.from(new Set(list));
  }, [siswaData.data]);

  // Filter data frontend (sementara)
  const filteredData = useMemo(() => {
    return siswaData.data.filter((pelajaran) => {
      const matchSemester =
        !filterSemester || pelajaran.semester.toString() === filterSemester;
      const matchPengampu =
        !filterPengampu || pelajaran.pengampu?.name === filterPengampu;
      return matchSemester && matchPengampu;
    });
  }, [siswaData.data, filterSemester, filterPengampu]);

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search pelajaran..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
      </form>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Filter Semester */}
        <Select
          value={filterSemester}
          onValueChange={(value) => setFilterSemester(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Semester" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2].map((semester) => (
              <SelectItem key={semester} value={semester.toString()}>
                Semester {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Pengampu */}
        <Select
          value={filterPengampu}
          onValueChange={(value) => setFilterPengampu(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Pengampu" />
          </SelectTrigger>
          <SelectContent>
            {uniquePengampu.map((pengampu) => (
              <SelectItem key={pengampu} value={pengampu}>
                {pengampu}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="ml-auto"
          onClick={handleReset}
        >
          Reset Filter
        </Button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Nama Mata Pelajaran</TableHead>
              <TableHead>Pengampu</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Jumlah Siswa</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((pelajaran: Pelajaran) => (
                <TableRow key={pelajaran.id}>
                  <TableCell>{pelajaran.nama_pelajaran}</TableCell>
                  <TableCell>{pelajaran.pengampu?.name}</TableCell>
                  <TableCell>{pelajaran.semester}</TableCell>
                  <TableCell>{pelajaran.siswa_count}</TableCell>
                  <TableCell>
                    <PelajaranActionAdmin id={pelajaran.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {siswaData.links.map((link, index) => (
          <Button
            key={index}
            variant={link.active ? "default" : "outline"}
            size="sm"
            disabled={!link.url}
            dangerouslySetInnerHTML={{ __html: link.label }}
            onClick={() => handlePageChange(link.url)}
            className="min-w-8"
          />
        ))}
      </div>
    </div>
  );
}

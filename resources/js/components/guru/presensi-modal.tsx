import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
    pelajaranId: number;
};

export default function PresensiModal({ pelajaranId }: Props) {
    const [loading, setLoading] = useState(false);
    const [siswa, setSiswa] = useState<any[]>([]);
    const [presensi, setPresensi] = useState<{ [key: number]: string }>({});

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/detail/pelajaran/${pelajaranId}/siswa`);
            const data = await res.json();
            setSiswa(data);
        } catch (err) {
            console.error("Error fetch siswa:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id: number, status: string) => {
        setPresensi(prev => ({ ...prev, [id]: status }));
    };

    const handleSubmit = async () => {
        try {
            await fetch(`/api/detail/pelajaran/${pelajaranId}/presensi`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ presensi }),
            });
            alert("Presensi berhasil disimpan!");
        } catch (err) {
            console.error("Error submit presensi:", err);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="default" onClick={loadData}>
                    Presensi
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Presensi Mata Pelajaran</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-2 py-1">Nama Siswa</th>
                                    <th className="border px-2 py-1">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswa.map((s: any) => (
                                    <tr key={s.id}>
                                        <td className="border px-2 py-1">{s.nama}</td>
                                        <td className="border px-2 py-1">
                                            <select
                                                value={presensi[s.id] || ""}
                                                onChange={(e) =>
                                                    handleChange(s.id, e.target.value)
                                                }
                                                className="border p-1 rounded"
                                            >
                                                <option value="">-</option>
                                                <option value="H">Hadir</option>
                                                <option value="I">Izin</option>
                                                <option value="S">Sakit</option>
                                                <option value="A">Alpha</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

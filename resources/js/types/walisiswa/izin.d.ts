export type WaliIzinPulang = {
    id: number;
    message: string;
    tanggal_pulang: string; // ISO datetime string
    tanggal_kembali: string; // ISO datetime string
    created_by: number;
    target_siswa_id: number;
    opened_by: number;
    status: 'accepted' | 'pending' | 'rejected'; // kalau status memang hanya ini, bisa dibuat lebih ketat
    closed_at: string | null; // bisa null
    created_at: string;
    updated_at: string;
};

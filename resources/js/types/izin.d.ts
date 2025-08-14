import { Siswa, Guru, WaliSiswa } from './users';

export interface Izin {
    id: number;
    message: string;
    tanggal_pulang: string;
    tanggal_kembali: string;
    created_by?: WaliSiswa;
    target_siswa_id: number;
    target_siswa?: Siswa;
    opened_by: number;
    opened_by?: Guru;
    status: 'rejected' | 'accepted' | null;
    closed_at: string;
}

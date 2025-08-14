import { Siswa, Guru } from './users';

export type Nilai = {
    id: number;
    nilai: number;
    semester: number;
    pelajaran_id: number;
    pelajaran?: Pelajaran;
    siswa_id: number;
    siswa?: Siswa;
    created_at: string;
    updated_at: string;
};

export type Pelajaran = {
    id: number;
    nama_pelajaran: string;
    semester: number;
    waktu: string;
    pengampu_id: number;
    created_at: string;
    updated_at: string;
    nilai: Nilai[];
    pengampu?: Guru;
};

export type APINilai = {
    siswa: {
        nama: string;
        angkatan: number;
    };
    nilai: Nilai[];
};

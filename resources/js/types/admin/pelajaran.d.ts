import { Pelajaran } from '../pelajaran';
import { APIPaginateResponse } from '../response';

export type AdminPelajaranResponse = APIPaginateResponse<Pelajaran>;

// resources/js/types/admin/pelajaran.ts

export interface Pelajaran {
    id: number;
    nama_pelajaran: string;
    semester: number;
    pengampu?: {
        id: number;
        name: string;
    } | null;
    nilai?: Array<{
        id: number;
        siswa_id: number;
        pelajaran_id: number;
        semester: number;
        nilai: number | null;
        created_at: string;
        updated_at: string;
    }>;
    siswa_count?: number; // properti ini otomatis dari withCount('siswa')
    created_at?: string;
    updated_at?: string;
}

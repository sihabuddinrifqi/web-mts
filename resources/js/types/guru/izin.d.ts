interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    phone: string;
    role: string;
    alamat: string;
    nis: string | null;
    angkatan: number | null;
    jenis_kelamin: string | null;
    siswa_role: string | null;
    ortu_id: number | null;
    guru_id: number | null;
}

interface TargetSiswa {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    phone: string;
    role: string;
    alamat: string;
    nis: string;
    angkatan: number;
    jenis_kelamin: string;
    siswa_role: string;
    ortu_id: number;
    guru_id: number;
}

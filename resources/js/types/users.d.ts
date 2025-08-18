/**
 * this types contains STI types of current model
 * all the model type should be inheritance of User
 */

import { User } from '.';
import { Pelajaran } from './pelajaran';

export interface Siswa extends User {
    nis: string;
    nik: number;
    alamat: string;
    angkatan: number;
    jenis_kelamin: string;
    siswa_role: string;
    tempat_lahir: string;
    tanggal_lahir: Date;
    ortu_id: number;
    ortu?: WaliSiswa;
    guru_id: number;
    guru?: Guru;
    nilai?: Nilai[];
}

export interface WaliSiswa extends User {
    alamat: string;
    jenis_kelamin: string;
    anak?: Siswa[];
    phone_number: string | null;
}

export interface Guru extends User {
    jenis_kelamin: string;
    pelajaran?: Pelajaran[];
    anak?: Siswa[];
}

export type IzinCreateRequest = {
    message: string;
    photo?: File | null;
    tanggal_pulang: Date | string;
    tanggal_kembali: Date | string;
    created_by: number;
    target_siswa_id: number;
};

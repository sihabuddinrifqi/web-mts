type Clock = 'HH:SS';

export type NilaiRequest = {
    nilai: number;
};

export type PelajaranRequest = {
    nama_pelajaran: string;
    semester: number;
    pengampu_id: number;
    siswa_ids: number[];
};

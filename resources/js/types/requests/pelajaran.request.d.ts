type Clock = 'HH:SS';

export type NilaiRequest = {
    nilai: number;
};

export type PelajaranRequest = {
    nama_pelajaran: string;
    semester: number;
    waktu: string;
    pengampu_id: number;
};

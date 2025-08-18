import { Izin } from '../izin';
import { APIPaginateResponse } from '../response';

export type IzinPulang = Izin;

export type AdminIzinPulangResponse = APIPaginateResponse<Izin>;

export type Izin = {
  id: number;
  nama_siswa: string;
  alasan: string;
  tanggal: string;
  // tambah field lain sesuai tabel izins di database
};

import { SiswaRequest } from '../requests/siswa.request';
import { APIPaginateResponse } from '../response';
import { Siswa as SiswaUser } from '../users';

export type Siswa = SiswaUser;

export type AdminSiswaPaginationResponse = APIPaginateResponse<Siswa>;

export type SiswaRequestType = SiswaRequest;

import { WaliSiswaRequest } from '../requests/walisiswa.request';
import { APIPaginateResponse } from '../response';
import { WaliSiswa } from '../users';

export type AdminWaliSiswaResponse = APIPaginateResponse<WaliSiswa>;

export type WaliSiswaRequestType = WaliSiswaRequest;

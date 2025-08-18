import { WaliSiswaRequest } from '../requests/walisiswa.request';
import { APIPaginateResponse } from '../response';
import { WaliSiswa } from '../users';

export type AdminWaliSiswaResponse = APIPaginateResponse<WaliSiswa>;

export type WaliSiswaRequestType = WaliSiswaRequest;

export interface Walisiswa {
  id: number;
  name: string;
  phone_number?: string;
  anak?: {
    id: number;
    name: string;
  }[];
}

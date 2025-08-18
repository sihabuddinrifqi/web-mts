import { GuruRequest } from '../requests/guru.request';
import { APIPaginateResponse } from '../response';
import { Guru } from '../users';

export type Guru = {
  id: number;
  name: string;
  username: string;
  first_password: string;
  phone: string;
  anak?: any[]; 
  pelajaran?: any[];
};

export type APIPaginateResponse<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
};

export type AdminGuruResponse = APIPaginateResponse<Guru>;
export type GuruRequestType = GuruRequest;

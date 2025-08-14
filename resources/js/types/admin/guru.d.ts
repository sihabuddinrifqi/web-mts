import { GuruRequest } from '../requests/guru.request';
import { APIPaginateResponse } from '../response';
import { Guru } from '../users';

export type AdminGuruResponse = APIPaginateResponse<Guru>;
export type GuruRequestType = GuruRequest;

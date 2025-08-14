import axios, { AxiosRequestConfig } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isUsingNumber(input: string) {
    return;
}

export async function fetchApi<T>(url: string, config?: AxiosRequestConfig) {
    const data = await axios.request<T>({ url: url, ...config });
    return data.data;
}

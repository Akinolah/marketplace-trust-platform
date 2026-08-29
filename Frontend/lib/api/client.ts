import axios, { AxiosError } from 'axios';
import type { APIError } from '@/lib/types';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<APIError>) => {
    const normalized: APIError = {
      message:
        error.response?.data?.message ||
        'Something went wrong while retrieving marketplace information.',
      code: error.code,
    };
    return Promise.reject(normalized);
  }
);

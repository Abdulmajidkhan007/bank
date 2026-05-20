import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '@/services/storage/secure';
import { config } from '@/config/env';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let refreshing: Promise<string | null> | null = null;

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getAccessToken();
    if (token && req.headers) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

      if (error.response?.status === 401 && original && !original._retried) {
        original._retried = true;
        const next = await refreshOnce();
        if (next && original.headers) {
          original.headers.Authorization = `Bearer ${next}`;
          return client.request(original);
        }
      }

      const data = error.response?.data as { message?: string; code?: string } | undefined;
      throw new ApiError(
        data?.message ?? error.message ?? 'Network error',
        error.response?.status ?? 0,
        data?.code ?? 'NETWORK_ERROR',
        data,
      );
    },
  );

  return client;
}

async function refreshOnce(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const refresh = await secureStorage.getRefreshToken();
        if (!refresh) return null;
        const res = await axios.post(`${config.apiBaseUrl}/auth/refresh`, { refresh });
        const { accessToken, refreshToken } = res.data as { accessToken: string; refreshToken: string };
        await secureStorage.setAccessToken(accessToken);
        await secureStorage.setRefreshToken(refreshToken);
        return accessToken;
      } catch {
        await secureStorage.clear();
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

export const api = createApiClient();

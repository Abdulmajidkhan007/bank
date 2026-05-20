import axios, { AxiosInstance, isAxiosError } from 'axios';
import { config } from './config.js';

const BASE_URL = 'https://notify.eskiz.uz/api';

class EskizClient {
  private http: AxiosInstance;
  private token: string | null = null;
  private tokenAcquiredAt = 0;
  private readonly tokenTtlMs = 25 * 24 * 60 * 60 * 1000; // refresh every 25 days

  constructor() {
    this.http = axios.create({ baseURL: BASE_URL, timeout: 15_000 });
  }

  private async ensureToken(): Promise<string> {
    const stale = Date.now() - this.tokenAcquiredAt > this.tokenTtlMs;
    if (this.token && !stale) return this.token;

    const params = new URLSearchParams();
    params.append('email', config.eskiz.email);
    params.append('password', config.eskiz.password);

    const res = await this.http.post('/auth/login', params);
    const token = res.data?.data?.token as string | undefined;
    if (!token) throw new Error('Eskiz auth failed: token missing');
    this.token = token;
    this.tokenAcquiredAt = Date.now();
    return token;
  }

  async sendSms(phone: string, message: string): Promise<{ id?: string; ok: true } | { ok: false; error: string }> {
    if (!config.eskiz.live) {
      console.log(`[eskiz:dev] would send to +${phone}: "${message}"`);
      return { ok: true, id: 'dev-' + Date.now() };
    }
    try {
      const token = await this.ensureToken();
      const body = new URLSearchParams();
      body.append('mobile_phone', phone);
      body.append('message', message);
      body.append('from', config.eskiz.from);

      const res = await this.http.post('/message/sms/send', body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ok: true, id: String(res.data?.id ?? res.data?.data?.id ?? '') };
    } catch (err) {
      let detail = 'unknown';
      if (isAxiosError(err)) {
        detail = `${err.response?.status ?? 'no-status'} ${JSON.stringify(err.response?.data ?? err.message)}`;
        // 401 -> token expired, retry once
        if (err.response?.status === 401) {
          this.token = null;
          try {
            const token = await this.ensureToken();
            const body = new URLSearchParams();
            body.append('mobile_phone', phone);
            body.append('message', message);
            body.append('from', config.eskiz.from);
            const res = await this.http.post('/message/sms/send', body, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { ok: true, id: String(res.data?.id ?? '') };
          } catch (retryErr) {
            detail = `retry-failed ${String(retryErr)}`;
          }
        }
      }
      console.error('[eskiz] send failed:', detail);
      return { ok: false, error: detail };
    }
  }
}

export const eskiz = new EskizClient();

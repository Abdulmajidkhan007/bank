import { Currency } from '@/types/domain';

const CURRENCY_SYMBOL: Record<Currency, string> = {
  UZS: 'so‘m',
  USD: '$',
  EUR: '€',
  RUB: '₽',
};

export function formatMoney(amount: number, currency: Currency, opts?: { compact?: boolean }): string {
  const fractionDigits = currency === 'UZS' ? 0 : 2;
  const abs = Math.abs(amount);
  if (opts?.compact && abs >= 1_000_000) {
    const v = (abs / 1_000_000).toFixed(1);
    return `${v}M ${CURRENCY_SYMBOL[currency]}`;
  }
  const parts = abs.toFixed(fractionDigits).split('.');
  const intPart = parts[0] ?? '0';
  const fracPart = parts[1];
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const num = fracPart ? `${withSpaces},${fracPart}` : withSpaces;
  const sign = amount < 0 ? '-' : '';
  return currency === 'USD' || currency === 'EUR'
    ? `${sign}${CURRENCY_SYMBOL[currency]}${num}`
    : `${sign}${num} ${CURRENCY_SYMBOL[currency]}`;
}

export function formatSignedAmount(amount: number, currency: Currency, direction: 'in' | 'out'): string {
  const signed = direction === 'in' ? amount : -amount;
  const formatted = formatMoney(Math.abs(signed), currency);
  return direction === 'in' ? `+ ${formatted}` : `− ${formatted}`;
}

export function formatCardNumber(masked: string): string {
  return masked;
}

export function formatPhoneUz(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(-9);
  if (d.length === 0) return '';
  const op = d.slice(0, 2);
  const a = d.slice(2, 5);
  const b = d.slice(5, 7);
  const c = d.slice(7, 9);
  let out = `+998 ${op}`;
  if (a) out += ` ${a}`;
  if (b) out += `-${b}`;
  if (c) out += `-${c}`;
  return out;
}

export function formatRelativeDate(iso: string, locale: 'uz' | 'ru' | 'en' = 'uz'): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  const dict = {
    uz: { today: 'Bugun', yesterday: 'Kecha' },
    ru: { today: 'Сегодня', yesterday: 'Вчера' },
    en: { today: 'Today', yesterday: 'Yesterday' },
  } as const;
  const intlLocale = locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-GB';

  if (diffDays === 0) return dict[locale].today;
  if (diffDays === 1) return dict[locale].yesterday;
  return new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'long' }).format(date);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

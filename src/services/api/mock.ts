import { Card, PaymentService, Recipient, Transaction, User } from '@/types/domain';

export const mockUser: User = {
  id: 'u_1',
  fullName: 'Sardor Yusupov',
  phone: '+998 90 123-45-67',
  email: 'sardor.y@uzcard.mock',
  avatarColor: '#00BFA6',
  initials: 'SY',
};

export const mockCards: Card[] = [
  {
    id: 'c_1',
    brand: 'humo',
    style: 'navy',
    holder: 'SARDOR YUSUPOV',
    numberMasked: '9860 •••• •••• 4271',
    lastFour: '4271',
    expiry: '08/29',
    balance: 18_456_300,
    currency: 'UZS',
    frozen: false,
    primary: true,
    limit: 50_000_000,
    cashback: 84_200,
  },
  {
    id: 'c_2',
    brand: 'uzcard',
    style: 'emerald',
    holder: 'SARDOR YUSUPOV',
    numberMasked: '8600 •••• •••• 1849',
    lastFour: '1849',
    expiry: '11/27',
    balance: 4_120_500,
    currency: 'UZS',
    frozen: false,
    primary: false,
    cashback: 23_500,
  },
  {
    id: 'c_3',
    brand: 'visa',
    style: 'platinum',
    holder: 'SARDOR YUSUPOV',
    numberMasked: '4276 •••• •••• 0093',
    lastFour: '0093',
    expiry: '04/28',
    balance: 1_482.55,
    currency: 'USD',
    frozen: false,
    primary: false,
  },
];

const today = new Date();
function daysAgo(d: number, h = 12): string {
  const t = new Date(today);
  t.setDate(t.getDate() - d);
  t.setHours(h, 30, 0, 0);
  return t.toISOString();
}

export const mockTransactions: Transaction[] = [
  {
    id: 't_1', cardId: 'c_1', title: 'Korzinka',
    subtitle: 'Grocery shopping', amount: 248_900, currency: 'UZS',
    direction: 'out', status: 'success', category: 'food', createdAt: daysAgo(0, 19),
  },
  {
    id: 't_2', cardId: 'c_1', title: 'Salary',
    subtitle: 'Monthly payroll', amount: 12_500_000, currency: 'UZS',
    direction: 'in', status: 'success', category: 'salary', createdAt: daysAgo(0, 9),
  },
  {
    id: 't_3', cardId: 'c_2', title: 'Yandex Go',
    subtitle: 'Taxi ride', amount: 32_000, currency: 'UZS',
    direction: 'out', status: 'success', category: 'transport', createdAt: daysAgo(1, 21),
  },
  {
    id: 't_4', cardId: 'c_1', title: 'Beeline',
    subtitle: 'Mobile top-up', amount: 60_000, currency: 'UZS',
    direction: 'out', status: 'success', category: 'mobile', createdAt: daysAgo(1, 14),
  },
  {
    id: 't_5', cardId: 'c_1', title: 'Transfer to Aziza',
    subtitle: 'HUMO •• 7820', amount: 500_000, currency: 'UZS',
    direction: 'out', status: 'success', category: 'transfer', createdAt: daysAgo(2, 10),
  },
  {
    id: 't_6', cardId: 'c_1', title: 'Cashback',
    subtitle: 'October rewards', amount: 84_200, currency: 'UZS',
    direction: 'in', status: 'success', category: 'cashback', createdAt: daysAgo(3, 8),
  },
  {
    id: 't_7', cardId: 'c_2', title: 'Uzbektelecom',
    subtitle: 'Home internet', amount: 145_000, currency: 'UZS',
    direction: 'out', status: 'success', category: 'utilities', createdAt: daysAgo(4, 11),
  },
  {
    id: 't_8', cardId: 'c_3', title: 'Netflix',
    subtitle: 'Subscription', amount: 13.99, currency: 'USD',
    direction: 'out', status: 'pending', category: 'entertainment', createdAt: daysAgo(5, 22),
  },
  {
    id: 't_9', cardId: 'c_1', title: 'Apple Store',
    subtitle: 'AirPods', amount: 1_980_000, currency: 'UZS',
    direction: 'out', status: 'success', category: 'shopping', createdAt: daysAgo(7, 15),
  },
  {
    id: 't_10', cardId: 'c_1', title: 'Hududiy gaz',
    subtitle: 'Gas bill', amount: 220_000, currency: 'UZS',
    direction: 'out', status: 'failed', category: 'utilities', createdAt: daysAgo(9, 12),
  },
];

export const mockRecipients: Recipient[] = [
  { id: 'r_1', name: 'Aziza', phone: '+998 90 777-12-12', cardMasked: 'HUMO •• 7820', avatarColor: '#E04E4E', initials: 'AZ' },
  { id: 'r_2', name: 'Bobur', phone: '+998 93 224-55-09', cardMasked: 'UZCARD •• 9012', avatarColor: '#2D81F7', initials: 'BO' },
  { id: 'r_3', name: 'Dilnoza', phone: '+998 99 808-91-44', cardMasked: 'VISA •• 4456', avatarColor: '#D4AF37', initials: 'DI' },
  { id: 'r_4', name: 'Otabek', phone: '+998 97 110-31-31', cardMasked: 'HUMO •• 2210', avatarColor: '#16A37B', initials: 'OT' },
  { id: 'r_5', name: 'Madina', phone: '+998 88 401-77-09', cardMasked: 'UZCARD •• 6634', avatarColor: '#7A5AF8', initials: 'MA' },
];

export const mockPaymentServices: PaymentService[] = [
  { id: 'p_1', name: 'Beeline', category: 'mobile', icon: 'B', colorFrom: '#FFC700', colorTo: '#FF9F1C' },
  { id: 'p_2', name: 'Ucell', category: 'mobile', icon: 'U', colorFrom: '#7B61FF', colorTo: '#5A3DC9' },
  { id: 'p_3', name: 'Uzmobile', category: 'mobile', icon: 'M', colorFrom: '#00BFA6', colorTo: '#008C7A' },
  { id: 'p_4', name: 'Mobiuz', category: 'mobile', icon: 'X', colorFrom: '#2D81F7', colorTo: '#1A5DBF' },

  { id: 'p_5', name: 'Uztelecom', category: 'internet', icon: 'T', colorFrom: '#10355C', colorTo: '#0B2A4A' },
  { id: 'p_6', name: 'TPS', category: 'internet', icon: 'P', colorFrom: '#16A37B', colorTo: '#0F7C5E' },
  { id: 'p_7', name: 'EVO', category: 'internet', icon: 'E', colorFrom: '#E04E4E', colorTo: '#B53A3A' },

  { id: 'p_8', name: 'Electricity', category: 'utilities', icon: 'E', colorFrom: '#FFC700', colorTo: '#E0A800' },
  { id: 'p_9', name: 'Gas', category: 'utilities', icon: 'G', colorFrom: '#FF6B6B', colorTo: '#D94545' },
  { id: 'p_10', name: 'Water', category: 'utilities', icon: 'W', colorFrom: '#2D81F7', colorTo: '#1A5DBF' },
  { id: 'p_11', name: 'Heating', category: 'utilities', icon: 'H', colorFrom: '#F76B1C', colorTo: '#C7460F' },

  { id: 'p_12', name: 'Tax service', category: 'taxes', icon: 'N', colorFrom: '#5A6A7A', colorTo: '#3F4F62' },
  { id: 'p_13', name: 'Traffic fines', category: 'taxes', icon: 'F', colorFrom: '#0E1B2C', colorTo: '#06101C' },

  { id: 'p_14', name: 'IVI', category: 'tv', icon: 'I', colorFrom: '#E91E63', colorTo: '#B30E48' },
  { id: 'p_15', name: 'Spotify', category: 'tv', icon: 'S', colorFrom: '#1ED760', colorTo: '#159A45' },

  { id: 'p_16', name: 'Bus pass', category: 'transport', icon: 'B', colorFrom: '#00BFA6', colorTo: '#008C7A' },
];

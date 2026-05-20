export type Currency = 'UZS' | 'USD' | 'EUR' | 'RUB';

export type CardBrand = 'humo' | 'uzcard' | 'visa' | 'mastercard';
export type CardStyle = 'navy' | 'midnight' | 'emerald' | 'platinum' | 'gold';

export type Card = {
  id: string;
  brand: CardBrand;
  style: CardStyle;
  holder: string;
  numberMasked: string;
  lastFour: string;
  expiry: string;
  balance: number;
  currency: Currency;
  frozen: boolean;
  primary: boolean;
  limit?: number;
  cashback?: number;
};

export type TxStatus = 'success' | 'pending' | 'failed';
export type TxDirection = 'in' | 'out';

export type TxCategory =
  | 'transfer'
  | 'mobile'
  | 'utilities'
  | 'shopping'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'salary'
  | 'cashback'
  | 'other';

export type Transaction = {
  id: string;
  cardId: string;
  title: string;
  subtitle?: string;
  amount: number;
  currency: Currency;
  direction: TxDirection;
  status: TxStatus;
  category: TxCategory;
  merchantIcon?: string;
  createdAt: string;
};

export type Recipient = {
  id: string;
  name: string;
  phone?: string;
  cardMasked?: string;
  avatarColor: string;
  initials: string;
};

export type PaymentService = {
  id: string;
  name: string;
  category: 'mobile' | 'internet' | 'utilities' | 'taxes' | 'tv' | 'transport';
  icon: string;
  colorFrom: string;
  colorTo: string;
};

export type User = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarColor: string;
  initials: string;
};

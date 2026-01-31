export interface User {
  id: string;
  username: string;
  email: string;
}

export interface TradeJournal {
  id: string;
  date: string;
  tradingPair: string;
  time: string;
  riskReward: string;
  tradeStatus: 'win' | 'loss' | 'breakeven';
  profitLoss: number;
  screenshot?: string;
  learnings: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type TabType = 'add' | 'view' | 'pnl' | 'notes';

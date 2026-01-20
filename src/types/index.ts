export type Category = "Crypto" | "Markets" | "Sports" | "Culture";

export interface Market {
  id: string;
  title: string;
  description: string;
  category: Category;
  endDate: Date;
  yesPrice: number; // Probability 0-100
  volume: number;
  creatorId: string;
  creatorName: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface UserPosition {
  marketId: string;
  shares: number;
  type: "YES" | "NO";
  entryPrice: number;
  currentPrice: number;
}

export interface User {
  id: string;
  name: string;
  balance: number;
  positions: UserPosition[];
}

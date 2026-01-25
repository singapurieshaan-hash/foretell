export type Category = "Crypto" | "Markets" | "Sports" | "Culture" | "Other";

export type ResolutionSourceType = "chainlink" | "official_url" | "exchange_price" | "custom_api";

export interface ResolutionSource {
  type: ResolutionSourceType;
  chainlinkFeed?: string; // e.g., "ETH/USD"
  url?: string; // official announcement or custom API URL
  jsonPath?: string; // e.g., "data.price" for custom APIs
  exchangeName?: string; // e.g., "Binance" for exchange_price
  timestamp?: number; // for specific price point
}

export interface Market {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  endDate: Date;
  yesPrice: number; // Probability 0-100
  volume: number;
  creatorId: string;
  creatorName: string;
  image?: string; // URL or data URI
  rules: string; // detailed resolution rules
  resolutionSource: ResolutionSource;
  featured?: boolean;
  seeded?: boolean; // from Kalshi or other source
  imageUrl?: string;
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

export interface MarketSubmission {
  id: string;
  title: string;
  slug: string;
  image?: string;
  category: Category;
  description: string;
  rules: string;
  resolutionSource: ResolutionSource;
  endDate: Date;
  minLiquidity?: number;
  creatorId: string;
  creatorName: string;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  approvedMarketId?: string;
}

export interface Order {
  id: string;
  marketId: string;
  userId: string;
  side: "BUY" | "SELL"; // of YES or NO
  outcome: "YES" | "NO";
  orderType: "LIMIT" | "MARKET";
  price?: number; // for LIMIT orders
  quantity: number;
  filledQuantity: number;
  status: "OPEN" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";
  createdAt: Date;
}

export interface Trade {
  id: string;
  marketId: string;
  buyerId: string;
  sellerId: string;
  outcome: "YES" | "NO";
  quantity: number;
  price: number; // price at execution
  timestamp: Date;
  fee: number;
}

export interface WalletState {
  address?: string;
  balance: number; // USDC or SOL in decimal units
  network: "ethereum" | "solana" | "demo";
  connected: boolean;
}

export interface AppStore {
  // Markets
  markets: Market[];
  submissions: MarketSubmission[];
  orders: Order[];
  trades: Trade[];

  // Wallet
  wallet: WalletState;

  // Admin
  adminPassword: string;

  // Actions
  createMarketSubmission: (submission: Omit<MarketSubmission, "id" | "submittedAt" | "status">) => MarketSubmission;
  approveSubmission: (submissionId: string, edits?: Partial<Market>) => Market;
  rejectSubmission: (submissionId: string, reason: string) => void;
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "filledQuantity" | "status">) => Order;
  matchOrders: (marketId: string) => void;
  executeTrade: (trade: Omit<Trade, "id" | "timestamp">) => Trade;
  updateWallet: (wallet: Partial<WalletState>) => void;
}

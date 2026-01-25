import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Market,
  MarketSubmission,
  Order,
  Trade,
  WalletState,
  AppStore,
} from '@/types';

const DEFAULT_DEMO_WALLET: WalletState = {
  address: '0xDemoUser',
  balance: 10000,
  network: 'demo',
  connected: true,
};

const autoRejectMinutes = parseInt(
  process.env.NEXT_PUBLIC_ADMIN_AUTO_REJECT_MINUTES || '10',
  10
);

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      markets: [],
      submissions: [],
      orders: [],
      trades: [],
      wallet: DEFAULT_DEMO_WALLET,
      adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',

      createMarketSubmission: (submission) => {
        const newSubmission: MarketSubmission = {
          ...submission,
          id: uuidv4(),
          submittedAt: new Date(),
          status: 'pending',
        };

        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }));

        // Auto-reject after timeout
        setTimeout(() => {
          const current = get().submissions.find((s) => s.id === newSubmission.id);
          if (current && current.status === 'pending') {
            get().rejectSubmission(
              newSubmission.id,
              `No verification of resolution source within ${autoRejectMinutes} minutes.`
            );
          }
        }, autoRejectMinutes * 60 * 1000);

        return newSubmission;
      },

      approveSubmission: (submissionId, edits) => {
        const submission = get().submissions.find((s) => s.id === submissionId);
        if (!submission) throw new Error('Submission not found');

        const market: Market = {
          id: uuidv4(),
          title: submission.title,
          slug: submission.slug,
          description: submission.description,
          category: submission.category,
          endDate: submission.endDate,
          yesPrice: 50, // Start at 50/50
          volume: 0,
          creatorId: submission.creatorId,
          creatorName: submission.creatorName,
          image: submission.image,
          rules: submission.rules,
          resolutionSource: submission.resolutionSource,
          featured: edits?.featured || false,
          seeded: edits?.seeded || false,
          ...(edits || {}),
        };

        set((state) => ({
          markets: [...state.markets, market],
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? {
                  ...s,
                  status: 'approved' as const,
                  approvedMarketId: market.id,
                }
              : s
          ),
        }));

        return market;
      },

      rejectSubmission: (submissionId, reason) => {
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? {
                  ...s,
                  status: 'rejected' as const,
                  rejectionReason: reason,
                }
              : s
          ),
        }));
      },

      placeOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: uuidv4(),
          createdAt: new Date(),
          filledQuantity: 0,
          status: 'OPEN',
        };

        set((state) => ({
          orders: [...state.orders, order],
        }));

        // Auto-match if this is a market order or can be matched
        setTimeout(() => {
          get().matchOrders(orderData.marketId);
        }, 0);

        return order;
      },

      matchOrders: (marketId) => {
        const state = get();
        const market = state.markets.find((m) => m.id === marketId);
        if (!market) return;

        const marketOrders = state.orders.filter(
          (o) => o.marketId === marketId && o.status === 'OPEN'
        );

        // Simple matching: sort by price-time priority
        const bids = marketOrders
          .filter((o) => o.side === 'BUY')
          .sort((a, b) => (b.price || 0) - (a.price || 0) || a.createdAt.getTime() - b.createdAt.getTime());

        const asks = marketOrders
          .filter((o) => o.side === 'SELL')
          .sort((a, b) => (a.price || 0) - (b.price || 0) || a.createdAt.getTime() - b.createdAt.getTime());

        // Match bids and asks
        let newOrders = [...state.orders];
        let newTrades = [...state.trades];
        let updatedMarket = { ...market };

        for (const bid of bids) {
          for (const ask of asks) {
            if (
              bid.outcome === ask.outcome &&
              (bid.price === undefined || ask.price === undefined || bid.price >= ask.price)
            ) {
              const bidRemaining = bid.quantity - bid.filledQuantity;
              const askRemaining = ask.quantity - ask.filledQuantity;
              const tradeQty = Math.min(bidRemaining, askRemaining);

              if (tradeQty > 0) {
                const tradePrice = ask.price !== undefined ? ask.price : bid.price || 0.5;

                const trade: Trade = {
                  id: uuidv4(),
                  marketId,
                  buyerId: bid.userId,
                  sellerId: ask.userId,
                  outcome: bid.outcome,
                  quantity: tradeQty,
                  price: tradePrice,
                  timestamp: new Date(),
                  fee: tradeQty * tradePrice * 0.02, // 2% fee
                };

                newTrades.push(trade);

                // Update orders
                newOrders = newOrders.map((o) => {
                  if (o.id === bid.id) {
                    const newStatus: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' = o.filledQuantity + tradeQty >= o.quantity ? 'FILLED' : 'PARTIALLY_FILLED';
                    return {
                      ...o,
                      filledQuantity: o.filledQuantity + tradeQty,
                      status: newStatus,
                    };
                  }
                  if (o.id === ask.id) {
                    const newStatus: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' = o.filledQuantity + tradeQty >= o.quantity ? 'FILLED' : 'PARTIALLY_FILLED';
                    return {
                      ...o,
                      filledQuantity: o.filledQuantity + tradeQty,
                      status: newStatus,
                    };
                  }
                  return o;
                });

                // Update market
                updatedMarket = {
                  ...updatedMarket,
                  volume: updatedMarket.volume + tradeQty * tradePrice,
                  yesPrice: updatedMarket.volume > 0 ? Math.min(99, Math.max(1, updatedMarket.yesPrice + (tradePrice - updatedMarket.yesPrice) * 0.05)) : 50,
                };
              }
            }
          }
        }

        set((state) => ({
          orders: newOrders,
          trades: newTrades,
          markets: state.markets.map((m) => (m.id === marketId ? updatedMarket : m)),
        }));
      },

      executeTrade: (tradeData) => {
        const trade: Trade = {
          ...tradeData,
          id: uuidv4(),
          timestamp: new Date(),
        };

        set((state) => ({
          trades: [...state.trades, trade],
          markets: state.markets.map((m) =>
            m.id === tradeData.marketId
              ? {
                  ...m,
                  volume: m.volume + tradeData.quantity * tradeData.price,
                  yesPrice: Math.min(99, Math.max(1, m.yesPrice + (tradeData.price - m.yesPrice) * 0.05)),
                }
              : m
          ),
        }));

        return trade;
      },

      updateWallet: (wallet) => {
        set((state) => ({
          wallet: { ...state.wallet, ...wallet },
        }));
      },
    }),
    {
      name: 'foretell-store',
      partialize: (state) => ({
        markets: state.markets,
        submissions: state.submissions,
        orders: state.orders,
        trades: state.trades,
        wallet: state.wallet,
      }),
    }
  )
);

import type { Order, Trade } from '@/types';

interface OrderBookMatch {
  trades: Trade[];
  updatedOrders: Order[];
}

export function matchOrders(
  orders: Order[],
  marketId: string
): OrderBookMatch {
  const trades: Trade[] = [];
  let updatedOrders = [...orders];

  // Separate orders by side
  const buyOrders = updatedOrders
    .filter((o) => o.side === 'BUY' && o.status === 'OPEN')
    .sort(
      (a, b) =>
        (b.price || 0) - (a.price || 0) ||
        a.createdAt.getTime() - b.createdAt.getTime()
    );

  const sellOrders = updatedOrders
    .filter((o) => o.side === 'SELL' && o.status === 'OPEN')
    .sort(
      (a, b) =>
        (a.price || 0) - (b.price || 0) ||
        a.createdAt.getTime() - b.createdAt.getTime()
    );

  // Match orders
  for (const buyOrder of buyOrders) {
    for (const sellOrder of sellOrders) {
      if (
        buyOrder.outcome === sellOrder.outcome &&
        (buyOrder.price === undefined ||
          sellOrder.price === undefined ||
          buyOrder.price >= sellOrder.price)
      ) {
        const buyRemaining = buyOrder.quantity - buyOrder.filledQuantity;
        const sellRemaining = sellOrder.quantity - sellOrder.filledQuantity;
        const tradeQty = Math.min(buyRemaining, sellRemaining);

        if (tradeQty > 0) {
          const tradePrice = sellOrder.price !== undefined ? sellOrder.price : buyOrder.price || 0.5;

          trades.push({
            id: Math.random().toString(36).substr(2, 9),
            marketId,
            buyerId: buyOrder.userId,
            sellerId: sellOrder.userId,
            outcome: buyOrder.outcome,
            quantity: tradeQty,
            price: tradePrice,
            timestamp: new Date(),
            fee: tradeQty * tradePrice * 0.02,
          });

          // Update orders
          updatedOrders = updatedOrders.map((o) => {
            if (o.id === buyOrder.id) {
              const newFilled = o.filledQuantity + tradeQty;
              const newStatus: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' = newFilled >= o.quantity ? 'FILLED' : 'PARTIALLY_FILLED';
              return {
                ...o,
                filledQuantity: newFilled,
                status: newStatus,
              };
            }
            if (o.id === sellOrder.id) {
              const newFilled = o.filledQuantity + tradeQty;
              const newStatus: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' = newFilled >= o.quantity ? 'FILLED' : 'PARTIALLY_FILLED';
              return {
                ...o,
                filledQuantity: newFilled,
                status: newStatus,
              };
            }
            return o;
          });
        }
      }
    }
  }

  return { trades, updatedOrders };
}

export function getOrderBook(orders: Order[], marketId: string) {
  const marketOrders = orders.filter(
    (o) => o.marketId === marketId && o.status !== 'CANCELLED'
  );

  const bids = marketOrders
    .filter((o) => o.side === 'BUY')
    .reduce(
      (acc, order) => {
        const price = order.price || 0.5;
        const existing = acc.find((b) => b.price === price);
        if (existing) {
          existing.quantity += order.quantity - order.filledQuantity;
        } else {
          acc.push({
            price,
            quantity: order.quantity - order.filledQuantity,
            orders: [order],
          });
        }
        return acc;
      },
      [] as Array<{ price: number; quantity: number; orders: Order[] }>
    )
    .sort((a, b) => b.price - a.price);

  const asks = marketOrders
    .filter((o) => o.side === 'SELL')
    .reduce(
      (acc, order) => {
        const price = order.price || 0.5;
        const existing = acc.find((a) => a.price === price);
        if (existing) {
          existing.quantity += order.quantity - order.filledQuantity;
        } else {
          acc.push({
            price,
            quantity: order.quantity - order.filledQuantity,
            orders: [order],
          });
        }
        return acc;
      },
      [] as Array<{ price: number; quantity: number; orders: Order[] }>
    )
    .sort((a, b) => a.price - b.price);

  return { bids, asks };
}

export function calculateSpread(bids: any[], asks: any[]) {
  const bestBid = bids[0]?.price || 0;
  const bestAsk = asks[0]?.price || 1;
  const spread = bestAsk - bestBid;
  const spreadPct = bestBid > 0 ? (spread / bestBid) * 100 : 0;

  return { bestBid, bestAsk, spread, spreadPct };
}

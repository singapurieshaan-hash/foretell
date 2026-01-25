"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { mockMarkets, generatePriceHistory, generateWeeklyHistory, generateMonthlyHistory } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { getOrderBook } from "@/lib/orderMatching";
import { ProbabilityChart } from "@/components/ProbabilityChart";
import { TradingPanel } from "@/components/TradingPanel";
import { PositionsWidget } from "@/components/PositionsWidget";
import { MarketInfo } from "@/components/MarketInfo";
import type { UserPosition } from "@/types";

interface MarketDetailPageProps {
  params: {
    id: string;
  };
}

export default function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = params;
  
  // Get market from store first, fall back to mock data
  const storeMarkets = useStore((state) => state.markets);
  const storeOrders = useStore((state) => state.orders);
  const storeTrades = useStore((state) => state.trades);
  const wallet = useStore((state) => state.wallet);
  
  const market = storeMarkets.find((m) => m.id === id) || mockMarkets.find((m) => m.id === id);

  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M">("1W");
  const [userBalance] = useState(wallet.balance);
  const [positions] = useState<UserPosition[]>([]);
  const [tradeMessage, setTradeMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  if (!market) {
    return (
      <div className="p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-success hover:text-emerald-600 mb-6 font-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Markets
        </Link>
        <div className="text-brand-text-secondary">Market not found</div>
      </div>
    );
  }

  const getPriceHistory = () => {
    if (timeRange === "1D") return generatePriceHistory(market.yesPrice);
    if (timeRange === "1W") return generateWeeklyHistory(market.yesPrice);
    return generateMonthlyHistory(market.yesPrice);
  };

  // Get order book for this market
  const { bids, asks } = useMemo(() => getOrderBook(storeOrders, market.id), [storeOrders, market.id]);
  
  // Get recent trades for this market
  const recentTrades = useMemo(() => 
    storeTrades
      .filter((t) => t.marketId === market.id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10),
    [storeTrades, market.id]
  );

  const handleTrade = (
    type: "buy" | "sell",
    side: "YES" | "NO",
    amount: number
  ) => {
    setTradeMessage({
      type: "success",
      message: `Order placed for ${type === 'buy' ? 'Buy' : 'Sell'} ${side}. Amount: $${amount.toFixed(2)}`,
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <Link href="/" className="inline-flex items-center gap-2 text-brand-success hover:text-emerald-600 mb-6 font-600 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Markets
      </Link>

      {/* Success/Error Message */}
      {tradeMessage && (
        <div
          className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            tradeMessage.type === "success"
              ? "bg-brand-success/10 border-brand-success text-brand-success"
              : "bg-brand-error/10 border-brand-error text-brand-error"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <p className="font-bold text-sm">{tradeMessage.message}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Header */}
          <div className="card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-brand-text mb-2">{market.title}</h1>
                <p className="text-brand-text-secondary max-w-2xl">{market.description}</p>
              </div>
              {market.image && (
                <img src={market.image} alt={market.title} className="w-24 h-24 rounded-lg object-cover" />
              )}
            </div>
            <div className="flex gap-4 pt-4 border-t border-brand-border">
              <div>
                <div className="text-xs font-bold text-brand-text-secondary uppercase">Current Price</div>
                <div className="text-2xl font-bold text-brand-text mt-1">${market.yesPrice}%</div>
              </div>
              <div>
                <div className="text-xs font-bold text-brand-text-secondary uppercase">Market Volume</div>
                <div className="text-2xl font-bold text-brand-text mt-1">${(market.volume / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-xs font-bold text-brand-text-secondary uppercase">Closes</div>
                <div className="text-lg font-bold text-brand-text mt-1">{market.endDate.toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-brand-text">Price History</h2>
              <div className="flex gap-2">
                {(["1D", "1W", "1M"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded text-sm font-600 transition ${
                      timeRange === range
                        ? "bg-brand-success text-white"
                        : "bg-brand-surface text-brand-text-secondary hover:text-brand-text"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ProbabilityChart data={getPriceHistory()} />
          </div>

          {/* Order Book */}
          <div className="card space-y-4">
            <h2 className="text-lg font-bold text-brand-text">Order Book</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Asks (Sell Side) */}
              <div>
                <h3 className="text-sm font-bold text-brand-error uppercase mb-3">Asks (Sell)</h3>
                <div className="space-y-1 text-sm">
                  {asks.length === 0 ? (
                    <p className="text-brand-text-secondary">No asks</p>
                  ) : (
                    asks.map((ask, i) => (
                      <div key={i} className="flex justify-between text-brand-text">
                        <span>${ask.price.toFixed(2)}</span>
                        <span className="text-brand-text-secondary">{ask.quantity.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bids (Buy Side) */}
              <div>
                <h3 className="text-sm font-bold text-brand-success uppercase mb-3">Bids (Buy)</h3>
                <div className="space-y-1 text-sm">
                  {bids.length === 0 ? (
                    <p className="text-brand-text-secondary">No bids</p>
                  ) : (
                    bids.map((bid, i) => (
                      <div key={i} className="flex justify-between text-brand-text">
                        <span>${bid.price.toFixed(2)}</span>
                        <span className="text-brand-text-secondary">{bid.quantity.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          {recentTrades.length > 0 && (
            <div className="card space-y-4">
              <h2 className="text-lg font-bold text-brand-text">Recent Trades</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-brand-text-secondary text-xs font-bold uppercase border-b border-brand-border">
                    <tr>
                      <th className="text-left py-2 px-4">Price</th>
                      <th className="text-left py-2 px-4">Quantity</th>
                      <th className="text-left py-2 px-4">Outcome</th>
                      <th className="text-left py-2 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {recentTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-brand-surface/50">
                        <td className="py-3 px-4 text-brand-text font-bold">${trade.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-brand-text">{trade.quantity.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            trade.outcome === 'YES' 
                              ? 'bg-brand-success/20 text-brand-success' 
                              : 'bg-brand-error/20 text-brand-error'
                          }`}>
                            {trade.outcome}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-brand-text-secondary">{new Date(trade.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Market Rules & Info */}
          <MarketInfo market={market} />
        </div>

        {/* Right Column: Trading Panel & Positions */}
        <div className="space-y-6">
          <TradingPanel market={market} userBalance={userBalance} onTrade={handleTrade} />
          {positions.length > 0 && <PositionsWidget positions={positions} market={market} />}
        </div>
      </div>
    </div>
  );
}

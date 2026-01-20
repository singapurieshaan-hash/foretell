"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockMarkets, generatePriceHistory, generateWeeklyHistory, generateMonthlyHistory } from "@/lib/mockData";
import { ProbabilityChart } from "@/components/ProbabilityChart";
import { TradingPanel } from "@/components/TradingPanel";
import { PositionsWidget } from "@/components/PositionsWidget";
import { MarketInfo } from "@/components/MarketInfo";
import { UserPosition } from "@/types";

interface MarketDetailPageProps {
  params: {
    id: string;
  };
}

export default function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = params;
  const market = mockMarkets.find((m) => m.id === id);

  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M">("1W");
  const [userBalance, setUserBalance] = useState(10000);
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [tradeMessage, setTradeMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  if (!market) {
    return (
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 text-accent mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Markets
        </Link>
        <div className="text-gray-600">Market not found</div>
      </div>
    );
  }

  const getPriceHistory = () => {
    if (timeRange === "1D") return generatePriceHistory(market.yesPrice);
    if (timeRange === "1W") return generateWeeklyHistory(market.yesPrice);
    return generateMonthlyHistory(market.yesPrice);
  };

  const handleTrade = (
    type: "buy" | "sell",
    side: "YES" | "NO",
    amount: number
  ) => {
    const sharePrice = side === "YES" ? market.yesPrice : 100 - market.yesPrice;
    const shares = amount / sharePrice;
    const fee = amount * 0.02;
    const creatorFee = fee * 0.5;
    const platformFee = fee * 0.5;

    const totalCost = amount + fee;

    if (type === "buy") {
      if (userBalance < totalCost) {
        setTradeMessage({
          type: "error",
          message: "Insufficient balance",
        });
        return;
      }

      // Update balance
      setUserBalance((prev) => prev - totalCost);

      // Add or update position
      const existingPosition = positions.find(
        (p) => p.marketId === market.id && p.type === side
      );

      if (existingPosition) {
        const newAvgPrice =
          (existingPosition.entryPrice * existingPosition.shares +
            sharePrice * shares) /
          (existingPosition.shares + shares);

        setPositions(
          positions.map((p) =>
            p.marketId === market.id && p.type === side
              ? {
                  ...p,
                  shares: p.shares + shares,
                  entryPrice: newAvgPrice,
                }
              : p
          )
        );
      } else {
        setPositions([
          ...positions,
          {
            marketId: market.id,
            shares,
            type: side,
            entryPrice: sharePrice,
            currentPrice: sharePrice,
          },
        ]);
      }

      setTradeMessage({
        type: "success",
        message: `Bought ${shares.toFixed(2)} ${side} shares. Fee: $${fee.toFixed(2)} (Creator: $${creatorFee.toFixed(2)}, Platform: $${platformFee.toFixed(2)})`,
      });
    } else {
      // Sell
      const position = positions.find(
        (p) => p.marketId === market.id && p.type === side
      );

      if (!position || position.shares < shares) {
        setTradeMessage({
          type: "error",
          message: "Insufficient shares",
        });
        return;
      }

      setUserBalance((prev) => prev + amount - fee);

      if (position.shares === shares) {
        setPositions(
          positions.filter(
            (p) => !(p.marketId === market.id && p.type === side)
          )
        );
      } else {
        setPositions(
          positions.map((p) =>
            p.marketId === market.id && p.type === side
              ? {
                  ...p,
                  shares: p.shares - shares,
                }
              : p
          )
        );
      }

      setTradeMessage({
        type: "success",
        message: `Sold ${shares.toFixed(2)} ${side} shares. Fee: $${fee.toFixed(2)} (Creator: $${creatorFee.toFixed(2)}, Platform: $${platformFee.toFixed(2)})`,
      });
    }

    setTimeout(() => setTradeMessage(null), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/" className="flex items-center gap-2 text-accent mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back to Markets
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {market.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{market.title}</h1>
          <p className="text-gray-600 text-lg">{market.description}</p>
        </div>
      </div>

      {/* Trade Message */}
      {tradeMessage && (
        <div
          className={`p-4 rounded-lg ${
            tradeMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {tradeMessage.message}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Probability Chart
              </h2>
              <div className="flex gap-2">
                {(["1D", "1W", "1M"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
                      timeRange === range
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ProbabilityChart data={getPriceHistory()} />
          </div>

          {/* Market Info */}
          <MarketInfo market={market} />
        </div>

        {/* Right: Trading & Positions */}
        <div className="space-y-6">
          <TradingPanel
            market={market}
            userBalance={userBalance}
            onTrade={handleTrade}
          />
          <PositionsWidget
            positions={positions.filter((p) => p.marketId === market.id)}
            market={market}
          />
        </div>
      </div>
    </div>
  );
}

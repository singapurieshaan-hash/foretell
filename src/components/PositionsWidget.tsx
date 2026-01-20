
import { Market, UserPosition } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PositionsWidgetProps {
  positions: UserPosition[];
  market: Market;
}

export function PositionsWidget({ positions, market }: PositionsWidgetProps) {
  if (positions.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No positions yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Start trading to see your positions here
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Your Positions</h2>

      <div className="space-y-3">
        {positions.map((pos, idx) => {
          const currentPrice =
            pos.type === "YES" ? market.yesPrice : 100 - market.yesPrice;
          const pl = (currentPrice - pos.entryPrice) * pos.shares;
          const plPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;

          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded font-bold text-white text-sm ${
                      pos.type === "YES"
                        ? "bg-accent"
                        : "bg-red-500"
                    }`}
                  >
                    {pos.type}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {pos.shares.toFixed(2)} shares
                    </div>
                    <div className="text-xs text-gray-500">
                      Entry: ${pos.entryPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-sm flex items-center gap-1 justify-end ${
                      pl >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {pl >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {pl >= 0 ? "+" : ""}${pl.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {plPercent >= 0 ? "+" : ""}
                    {plPercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                <span>Current: ${currentPrice.toFixed(2)}</span>
                <span>Value: ${(pos.shares * currentPrice).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 pt-3">
        <div className="text-xs text-gray-500">
          <div>
            Total Shares:{" "}
            <span className="font-semibold">
              {positions.reduce((acc, p) => acc + p.shares, 0).toFixed(2)}
            </span>
          </div>
          <div className="mt-1">
            Gross Value:{" "}
            <span className="font-semibold">
              $
              {positions
                .reduce((acc, p) => {
                  const price =
                    p.type === "YES" ? market.yesPrice : 100 - market.yesPrice;
                  return acc + p.shares * price;
                }, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

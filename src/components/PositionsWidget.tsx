
import { Market, UserPosition } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PositionsWidgetProps {
  positions: UserPosition[];
  market: Market;
}

export function PositionsWidget({ positions, market }: PositionsWidgetProps) {
  if (positions.length === 0) {
    return (
      <div className="card text-center py-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6 text-brand-text-secondary" />
        </div>
        <p className="text-brand-text-secondary font-500">No positions yet</p>
        <p className="text-xs text-brand-text-secondary mt-1">
          Start trading to see your positions here
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-text">Your Positions</h2>
        <span className="badge text-xs">{positions.length}</span>
      </div>

      <div className="space-y-3">
        {positions.map((pos, idx) => {
          const currentPrice =
            pos.type === "YES" ? market.yesPrice : 100 - market.yesPrice;
          const pl = (currentPrice - pos.entryPrice) * pos.shares;
          const plPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
          const isProfit = pl >= 0;

          return (
            <div
              key={idx}
              className="border border-brand-border rounded-lg p-4 space-y-3 hover:border-brand-success/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span
                    className={`px-3 py-1.5 rounded-lg font-bold text-white text-sm ${
                      pos.type === "YES"
                        ? "bg-brand-success"
                        : "bg-brand-error"
                    }`}
                  >
                    {pos.type}
                  </span>
                  <div>
                    <div className="font-bold text-brand-text">
                      {pos.shares.toFixed(2)} shares
                    </div>
                    <div className="text-xs text-brand-text-secondary">
                      Entry: ${pos.entryPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-sm flex items-center justify-end gap-1 ${
                      isProfit ? "text-brand-success" : "text-brand-error"
                    }`}
                  >
                    {isProfit ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {isProfit ? "+" : ""}${pl.toFixed(2)}
                  </div>
                  <div className={`text-xs ${isProfit ? "text-brand-success" : "text-brand-error"}`}>
                    {plPercent >= 0 ? "+" : ""}
                    {plPercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-brand-text-secondary pt-2 border-t border-brand-border">
                <span>Current: ${currentPrice.toFixed(2)}</span>
                <span>Value: ${(pos.shares * currentPrice).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border-t border-brand-border pt-4 space-y-2 bg-brand-surface p-4 rounded-lg">
        <div className="text-sm font-bold text-brand-text flex justify-between">
          <span>Total Shares</span>
          <span>{positions.reduce((acc, p) => acc + p.shares, 0).toFixed(2)}</span>
        </div>
        <div className="text-sm font-bold text-brand-text flex justify-between">
          <span>Gross Value</span>
          <span>
            $
            {positions
              .reduce((acc, p) => {
                const currentPrice =
                  p.type === "YES" ? market.yesPrice : 100 - market.yesPrice;
                return acc + p.shares * currentPrice;
              }, 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="text-sm font-bold text-brand-text flex justify-between">
          <span>Total Invested</span>
          <span>
            $
            {positions
              .reduce((acc, p) => acc + p.entryPrice * p.shares, 0)
              .toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

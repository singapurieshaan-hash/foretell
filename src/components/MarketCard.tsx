import Link from "next/link";
import { Calendar, Volume2, TrendingUp } from "lucide-react";
import { Market } from "@/types";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const noPrice = 100 - market.yesPrice;
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) {
      return `$${(vol / 1000000).toFixed(1)}M`;
    }
    if (vol >= 1000) {
      return `$${(vol / 1000).toFixed(1)}K`;
    }
    return `$${vol}`;
  };

  const daysUntil = Math.ceil(
    (market.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="card group cursor-pointer border-brand-border bg-white hover:border-brand-success/50 hover:shadow-base transition-all duration-300">
        {/* Category Badge */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-base font-bold text-brand-text flex-1 line-clamp-2 group-hover:text-brand-success transition-colors">
            {market.title}
          </h3>
          <span className="ml-3 px-3 py-1 badge whitespace-nowrap text-xs bg-brand-surface text-brand-text-secondary font-500">
            {market.category}
          </span>
        </div>

        {/* Probability Display */}
        <div className="mb-5 pb-5 border-b border-brand-border">
          <div className="grid grid-cols-2 gap-4">
            {/* YES Price */}
            <div className="group/yes">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-success"></div>
                <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide">YES</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-success">
                  {market.yesPrice}¢
                </span>
                <span className="text-xs text-brand-text-secondary">
                  {market.yesPrice}%
                </span>
              </div>
              <div className="mt-1 h-1 bg-brand-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-success to-emerald-500 rounded-full"
                  style={{ width: `${market.yesPrice}%` }}
                ></div>
              </div>
            </div>

            {/* NO Price */}
            <div className="group/no">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-error"></div>
                <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide">NO</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-error">{noPrice}¢</span>
                <span className="text-xs text-brand-text-secondary">{noPrice}%</span>
              </div>
              <div className="mt-1 h-1 bg-brand-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                  style={{ width: `${noPrice}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-5 pb-5 border-b border-brand-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <Volume2 className="w-4 h-4" />
              <span>Volume</span>
            </div>
            <span className="font-bold text-brand-text">{formatVolume(market.volume)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>Ends</span>
            </div>
            <span className="font-bold text-brand-text">
              {daysUntil > 0 ? `${daysUntil}d` : "Ended"}
            </span>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-brand-text-secondary">
            By <span className="font-600 text-brand-text">{market.creatorName}</span>
          </span>
          <div className="flex items-center gap-1 text-xs text-brand-success opacity-0 group-hover:opacity-100 transition-opacity">
            Trade <TrendingUp className="w-3 h-3" />
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-brand-success hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95">
          Trade
        </button>
      </div>
    </Link>
  );
}

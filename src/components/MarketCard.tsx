import Link from "next/link";
import { Volume2, Clock } from "lucide-react";
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

  const isEnded = daysUntil <= 0;

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="group relative h-full cursor-pointer bg-gradient-to-br from-slate-800 to-slate-700/50 border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 transform">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>

        <div className="relative p-6 space-y-5 h-full flex flex-col backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                {market.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {market.description}
              </p>
            </div>
            <span className="ml-2 px-3 py-1.5 whitespace-nowrap text-xs font-bold bg-slate-700/60 border border-emerald-500/30 text-emerald-300 rounded-lg">
              {market.category}
            </span>
          </div>

          {/* Status Badge */}
          {isEnded && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg w-fit">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-xs font-bold text-red-300">Ended</span>
            </div>
          )}

          {/* Probability Display */}
          <div className="space-y-4 border-y border-slate-700/50 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* YES Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">YES</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                      {market.yesPrice}¢
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden border border-emerald-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 transition-all duration-500"
                      style={{ width: `${market.yesPrice}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* NO Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></div>
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider">NO</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black bg-gradient-to-r from-red-300 to-red-400 bg-clip-text text-transparent">
                      {noPrice}¢
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden border border-red-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-lg shadow-red-500/50 transition-all duration-500"
                      style={{ width: `${noPrice}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Volume2 className="w-4 h-4 text-emerald-400/60" />
                <span className="font-medium">Volume</span>
              </div>
              <span className="font-bold text-white">{formatVolume(market.volume)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-cyan-400/60" />
                <span className="font-medium">Closes In</span>
              </div>
              <span className={`font-bold ${daysUntil > 7 ? 'text-white' : daysUntil > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                {daysUntil > 0 ? `${daysUntil}d` : "Ended"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 border-t border-slate-700/50">
            <button className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 text-sm">
              Trade Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

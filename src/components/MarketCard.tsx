import Link from "next/link";
import { Calendar, Volume2 } from "lucide-react";
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
      <div className="card hover:shadow-lg cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-2">
            {market.title}
          </h3>
          <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap">
            {market.category}
          </span>
        </div>

        {/* Trading Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">
              YES Price
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-accent">
                {market.yesPrice}¢
              </span>
              <span className="text-sm text-gray-600">
                ({market.yesPrice}%)
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">
              NO Price
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-error">{noPrice}¢</span>
              <span className="text-sm text-gray-600">({noPrice}%)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Volume2 className="w-4 h-4" />
            <span>
              Volume:{" "}
              <span className="font-semibold">{formatVolume(market.volume)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Ends in{" "}
              <span className="font-semibold">
                {daysUntil > 0 ? `${daysUntil} days` : "Ended"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 pt-2">
            <span className="text-xs text-gray-500">
              Created by{" "}
              <span className="font-medium text-gray-700">
                {market.creatorName}
              </span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <button className="mt-4 w-full btn-primary">Trade Now</button>
      </div>
    </Link>
  );
}

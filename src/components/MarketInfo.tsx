
import { Market } from "@/types";
import {
  Calendar,
  Volume2,
  TrendingUp,
  Award,
  DollarSign,
} from "lucide-react";

interface MarketInfoProps {
  market: Market;
}

export function MarketInfo({ market }: MarketInfoProps) {
  const daysUntil = Math.ceil(
    (market.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) {
      return `$${(vol / 1000000).toFixed(2)}M`;
    }
    if (vol >= 1000) {
      return `$${(vol / 1000).toFixed(2)}K`;
    }
    return `$${vol.toFixed(2)}`;
  };

  // Estimate creator fees (2% of volume, 50% to creator)
  const estimatedCreatorFees = (market.volume * 0.02 * 0.5).toFixed(2);

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Market Info</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Market Stats */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-0.5">YES Probability</p>
              <p className="text-2xl font-bold text-accent">
                {market.yesPrice}%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-0.5">NO Probability</p>
              <p className="text-2xl font-bold text-red-500">
                {100 - market.yesPrice}%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-0.5">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatVolume(market.volume)}
              </p>
            </div>
          </div>
        </div>

        {/* Dates & Creator */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-0.5">Market Ends</p>
              <p className="text-lg font-bold text-gray-900">
                {market.endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">
                {daysUntil > 0 ? `${daysUntil} days left` : "Ended"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-0.5">Created By</p>
              <p className="font-bold text-gray-900">{market.creatorName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-0.5">Creator Earnings</p>
              <p className="text-lg font-bold text-green-600">
                ≈${estimatedCreatorFees}
              </p>
              <p className="text-xs text-gray-500">50% of 2% fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <h3 className="font-bold text-gray-900 mb-3">Fee Model</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Trading Fee per Transaction</span>
            <span className="font-medium text-gray-900">2.0%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="ml-4">Market Creator (50%)</span>
            <span>1.0%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="ml-4">Foretell Platform (50%)</span>
            <span>1.0%</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <h3 className="font-bold text-gray-900 mb-2">Resolution Criteria</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {market.description}
        </p>
      </div>
    </div>
  );
}

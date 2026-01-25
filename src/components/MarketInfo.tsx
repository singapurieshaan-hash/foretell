import { Market } from "@/types";
import {
  Calendar,
  Volume2,
  TrendingUp,
  Award,
  DollarSign,
  Info,
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

  const estimatedCreatorFees = (market.volume * 0.02 * 0.5).toFixed(2);

  return (
    <div className="card space-y-8">
      <h2 className="text-xl font-bold text-brand-text">Market Information</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-brand-success/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-brand-success" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-1">
                YES Probability
              </p>
              <p className="text-3xl font-bold text-brand-success">
                {market.yesPrice}%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-brand-error/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-brand-error" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-1">
                NO Probability
              </p>
              <p className="text-3xl font-bold text-brand-error">
                {100 - market.yesPrice}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-brand-info/10 rounded-lg">
              <Volume2 className="w-5 h-5 text-brand-info" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-1">
                Total Volume
              </p>
              <p className="text-2xl font-bold text-brand-text">
                {formatVolume(market.volume)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-100 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-1">
                Market Closes
              </p>
              <p className="text-lg font-bold text-brand-text">
                {market.endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-brand-text-secondary mt-1">
                {daysUntil > 0 ? `${daysUntil} days remaining` : "Market ended"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-1">
                Created By
              </p>
              <p className="font-bold text-brand-text">{market.creatorName}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-brand-success/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-brand-success" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wide mb-1">
                Creator Earnings
              </p>
              <p className="text-xl font-bold text-brand-success">
                ≈${estimatedCreatorFees}
              </p>
              <p className="text-xs text-brand-text-secondary mt-1">50% of 2% fees</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-border pt-8">
        <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Fee Structure
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-brand-surface rounded-lg border border-brand-border">
            <span className="text-brand-text-secondary">Trading Fee per Transaction</span>
            <span className="font-bold text-brand-text">2.0%</span>
          </div>
          <div className="space-y-2 ml-3">
            <div className="flex justify-between text-xs">
              <span className="text-brand-text-secondary">Market Creator (50%)</span>
              <span className="font-bold text-brand-text">1.0%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-text-secondary">Platform Fee (50%)</span>
              <span className="font-bold text-brand-text">1.0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-border pt-8">
        <h3 className="font-bold text-brand-text mb-4">Resolution Criteria</h3>
        <p className="text-sm text-brand-text-secondary leading-relaxed bg-brand-surface p-4 rounded-lg border border-brand-border">
          {market.description}
        </p>
      </div>
    </div>
  );
}

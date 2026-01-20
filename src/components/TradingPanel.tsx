"use client";

import React, { useState } from "react";
import { Market } from "@/types";

interface TradingPanelProps {
  market: Market;
  userBalance: number;
  onTrade: (type: "buy" | "sell", side: "YES" | "NO", amount: number) => void;
}

export function TradingPanel({
  market,
  userBalance,
  onTrade,
}: TradingPanelProps) {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("");

  const sharePrice = side === "YES" ? market.yesPrice : 100 - market.yesPrice;
  const shares = amount ? Number(amount) / sharePrice : 0;
  const fee = amount ? Number(amount) * 0.02 : 0;
  const creatorFee = fee * 0.5;
  const platformFee = fee * 0.5;
  const total =
    tradeType === "buy" ? Number(amount) + fee : Number(amount) - fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onTrade(tradeType, side, Number(amount));
    setAmount("");
  };

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Trade</h2>

      {/* Trade Type Tabs */}
      <div className="flex gap-2">
        {(["buy", "sell"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTradeType(type)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              tradeType === type
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Side Selection */}
      <div className="grid grid-cols-2 gap-2">
        {(["YES", "NO"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
              side === s
                ? s === "YES"
                  ? "bg-accent text-white"
                  : "bg-error text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s === "YES" ? (
              <>
                <div className="text-sm font-medium">YES</div>
                <div className="text-xs text-opacity-75">${sharePrice}</div>
              </>
            ) : (
              <>
                <div className="text-sm font-medium">NO</div>
                <div className="text-xs text-opacity-75">${sharePrice}</div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Amount (USD)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Breakdown */}
        {amount && Number(amount) > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Share Price</span>
              <span className="font-medium">${sharePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shares</span>
              <span className="font-medium">{shares.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Fee (2%)</span>
                <span className="font-medium">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="ml-4">Creator (50%)</span>
                <span>${creatorFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="ml-4">Platform (50%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
              <span>Total Cost</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Balance Check */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available Balance</span>
          <span className="font-medium">${userBalance.toFixed(2)}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || Number(amount) <= 0 || total > userBalance}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {tradeType === "buy" ? "Buy" : "Sell"} {side}
        </button>
      </form>

      {/* Fee Disclaimer */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p className="font-medium mb-1">Fee Structure</p>
        <p>2% fee per trade, split 50/50 with market creator</p>
      </div>
    </div>
  );
}

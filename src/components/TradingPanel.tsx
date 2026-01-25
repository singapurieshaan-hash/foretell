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
      <h2 className="text-xl font-bold text-brand-text">Trade Market</h2>

      {/* Trade Type Tabs */}
      <div className="flex gap-2 bg-brand-surface p-1 rounded-lg">
        {(["buy", "sell"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTradeType(type)}
            className={`flex-1 px-4 py-2 rounded font-bold text-sm transition-all duration-200 ${
              tradeType === type
                ? "bg-white text-brand-success shadow-xs"
                : "text-brand-text-secondary hover:text-brand-text"
            }`}
          >
            {type === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* Side Selection */}
      <div className="grid grid-cols-2 gap-3">
        {(["YES", "NO"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`px-4 py-4 rounded-lg font-bold transition-all duration-200 border-2 ${
              side === s
                ? s === "YES"
                  ? "bg-brand-success/10 border-brand-success text-brand-success"
                  : "bg-brand-error/10 border-brand-error text-brand-error"
                : "border-brand-border text-brand-text-secondary hover:border-brand-text-secondary"
            }`}
          >
            <div className="text-sm font-bold">{s}</div>
            <div className="text-xs opacity-75 mt-0.5">${sharePrice}</div>
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-brand-text-secondary uppercase tracking-wide mb-2 block">
            Amount (USD)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-premium text-lg"
          />
        </div>

        {/* Breakdown */}
        {amount && Number(amount) > 0 && (
          <div className="bg-brand-surface rounded-lg p-4 space-y-3 text-sm border border-brand-border">
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Share Price</span>
                <span className="font-bold text-brand-text">${sharePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Shares</span>
                <span className="font-bold text-brand-text">{shares.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-brand-border pt-2.5 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Fee (2%)</span>
                <span className="font-bold text-brand-text">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-text-secondary">
                <span className="ml-4">Creator (50%)</span>
                <span>${creatorFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-text-secondary">
                <span className="ml-4">Platform (50%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-brand-border pt-2.5 flex justify-between font-bold text-brand-text">
              <span>Total Cost</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Balance Check */}
        <div className="flex justify-between text-sm bg-brand-surface p-3 rounded-lg border border-brand-border">
          <span className="text-brand-text-secondary">Available Balance</span>
          <span className={`font-bold ${total > userBalance ? "text-brand-error" : "text-brand-text"}`}>
            ${userBalance.toFixed(2)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || Number(amount) <= 0 || total > userBalance}
          className="w-full btn-primary font-bold py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-success"
        >
          {tradeType === "buy" ? "Buy" : "Sell"} {side}
        </button>
      </form>
    </div>
  );
}

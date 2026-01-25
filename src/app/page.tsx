"use client";

import { Search, TrendingUp, Zap, Plus, Clock } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import { mockMarkets } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";

type Category = "All" | "Crypto" | "Markets" | "Sports" | "Culture" | "Other";

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All");

  // Get markets from store (created via admin approval)
  const storeMarkets = useStore((state) => state.markets);
  const submissions = useStore((state) => state.submissions);
  
  // Combine mock markets with store markets
  const allMarkets = [...mockMarkets, ...storeMarkets];

  const categories: Category[] = ["All", "Crypto", "Markets", "Sports", "Culture", "Other"];

  const filteredMarkets =
    selectedCategory === "All"
      ? allMarkets
      : allMarkets.filter(
          (m) => m.category === selectedCategory
        );

  // Featured markets: featured flag or highest volume
  const featured = [...filteredMarkets]
    .sort((a, b) => {
      if (a.featured === b.featured) {
        return b.volume - a.volume;
      }
      return a.featured ? -1 : 1;
    })
    .slice(0, 3);

  // Trending: highest YES price (most likely to happen)
  const trending = [...filteredMarkets]
    .sort((a, b) => b.yesPrice - a.yesPrice)
    .slice(0, 3);

  // Count pending submissions
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-brand-text mb-3">
              Predict the Future
            </h1>
            <p className="text-lg text-brand-text-secondary max-w-2xl leading-relaxed">
              Trade on the world's most important events with real-time probability markets.
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-6 py-3 bg-brand-success text-white font-semibold rounded-lg hover:bg-brand-success/90 transition whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create Market
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search markets..."
            className="input-premium pl-12"
          />
        </div>

        {/* Pending Submissions Badge */}
        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-success/10 border border-brand-success/30 rounded-lg">
            <Clock className="w-4 h-4 text-brand-success" />
            <span className="text-sm text-brand-text font-semibold">
              {pendingCount} market{pendingCount > 1 ? 's' : ''} pending approval
            </span>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-lg font-600 text-sm transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-brand-success text-white shadow-sm"
                : "bg-brand-surface text-brand-text hover:bg-gray-200 border border-transparent hover:border-brand-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Markets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-brand-success to-emerald-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Featured</h2>
          </div>
          <a href="#" className="text-sm font-600 text-brand-success hover:text-emerald-600 transition-colors">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>

      {/* Trending Markets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-brand-success to-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Trending</h2>
          </div>
          <a href="#" className="text-sm font-600 text-brand-success hover:text-emerald-600 transition-colors">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>

      {/* Filtered Markets */}
      {selectedCategory !== "All" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-brand-text">
              {selectedCategory} Markets
            </h2>
            <span className="px-3 py-1 badge text-xs">
              {filteredMarkets.length} markets
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Search, TrendingUp } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import { mockMarkets } from "@/lib/mockData";
import { useState } from "react";

type Category = "All" | "Crypto" | "Markets" | "Sports" | "Culture";

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All");

  const categories: Category[] = ["All", "Crypto", "Markets", "Sports", "Culture"];

  const filteredMarkets =
    selectedCategory === "All"
      ? mockMarkets
      : mockMarkets.filter(
          (m) => m.category === selectedCategory
        );

  // Featured markets: highest volume
  const featured = [...filteredMarkets]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3);

  // Trending: highest YES price (most likely to happen)
  const trending = [...filteredMarkets]
    .sort((a, b) => b.yesPrice - a.yesPrice)
    .slice(0, 3);

  return (
    <div className="p-8 space-y-12">
      {/* Hero / Search Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Predict the Future
          </h1>
          <p className="text-xl text-gray-600">
            Trade on the world's most important events.
          </p>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search markets..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Markets */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-gray-900">Featured Markets</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>

      {/* Trending Markets */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Trending Markets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>

      {/* All Markets */}
      {selectedCategory !== "All" && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory} Markets
          </h2>
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

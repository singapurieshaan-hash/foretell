"use client";

import { Search, TrendingUp, Zap, Plus, Clock, Sparkles, ArrowUpRight } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import { mockMarkets } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";

type Category = "All" | "Crypto" | "Markets" | "Sports" | "Culture" | "Other";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

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

  const stats = [
    { label: "Total Volume", value: `$${(allMarkets.reduce((a, m) => a + m.volume, 0) / 1000000).toFixed(1)}M` },
    { label: "Active Markets", value: allMarkets.length },
    { label: "24h Volume", value: "$2.4M" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-6 sm:px-8 py-16 max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to Foretell
              </span>
            </div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-tight">
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Predict
                  </span>
                  <br />
                  <span className="text-white">the Future</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl leading-relaxed font-light">
                  Trade on the world's most important events with real-time probability markets. Make informed predictions and earn rewards.
                </p>
              </div>
              <Link
                href="/create"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Create Market</span>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 lg:gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group p-6 bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-emerald-500/20 rounded-xl backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300"
              >
                <p className="text-sm text-slate-400 font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search & Pending Badge Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search markets, events, outcomes..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {pendingCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-lg backdrop-blur-sm animate-pulse">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">
                  {pendingCount} approval{pendingCount > 1 ? 's' : ''} pending
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 snap-x snap-mandatory">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-lg font-700 text-sm transition-all duration-300 transform ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-105"
                    : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-emerald-500/50 hover:text-emerald-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Markets Section */}
        {featured.length > 0 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg shadow-emerald-500/50">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Featured</h2>
                  <p className="text-sm text-slate-400">Trending right now</p>
                </div>
              </div>
              <a href="#trending" className="text-sm font-700 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((market, i) => (
                <div key={market.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Markets Section */}
        {trending.length > 0 && (
          <div id="trending" className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-lg shadow-cyan-500/50">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Trending</h2>
                  <p className="text-sm text-slate-400">Highest probability outcomes</p>
                </div>
              </div>
              <a href="#all" className="text-sm font-700 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((market, i) => (
                <div key={market.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Markets */}
        {selectedCategory !== "All" || filteredMarkets.length > 6 ? (
          <div id="all" className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-white">
                  {selectedCategory === "All" ? "All Markets" : `${selectedCategory} Markets`}
                </h2>
                <span className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-sm font-bold text-emerald-400">
                  {filteredMarkets.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market, i) => (
                <div key={market.id} className="animate-fade-in-up" style={{ animationDelay: `${(i % 6) * 100}ms` }}>
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

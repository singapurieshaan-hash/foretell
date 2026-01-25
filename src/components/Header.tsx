import { BarChart3, Bell, Settings, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald-500/20 px-8 py-5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
      <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 group">
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-500/80 transition-all duration-300">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Foretell</span>
          <p className="text-xs text-emerald-400/60 font-medium">Prediction Markets</p>
        </div>
      </Link>

      <nav className="flex items-center gap-8">
        <Link href="/" className="relative text-emerald-300/80 hover:text-emerald-300 font-600 transition-all duration-300 group">
          Markets
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link href="/create" className="relative text-emerald-300/80 hover:text-emerald-300 font-600 transition-all duration-300 group flex items-center gap-1">
          <Zap className="w-4 h-4" />
          Create
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link href="/admin" className="relative text-emerald-300/80 hover:text-emerald-300 font-600 transition-all duration-300 group flex items-center gap-1 text-sm">
          <TrendingUp className="w-4 h-4" />
          Admin
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </nav>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <div className="text-xs text-emerald-400/60 font-medium">Available Balance</div>
          <div className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">$10,000.00</div>
        </div>
        <button className="p-2.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-300 text-emerald-300/60 hover:text-emerald-300">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-300 text-emerald-300/60 hover:text-emerald-300">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

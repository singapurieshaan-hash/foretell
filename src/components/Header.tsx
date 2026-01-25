import { BarChart3, Bell, Settings } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-brand-border px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
        <div className="bg-gradient-to-br from-brand-success to-emerald-600 p-2 rounded-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-brand-text">Foretell</span>
      </Link>

      <nav className="flex items-center gap-8">
        <Link href="/" className="text-brand-text-secondary hover:text-brand-text font-500 transition-colors">
          Markets
        </Link>
        <Link href="/create" className="text-brand-text-secondary hover:text-brand-text font-500 transition-colors">
          Create
        </Link>
        <Link href="/admin" className="text-brand-text-secondary hover:text-brand-text font-500 transition-colors text-sm">
          Admin
        </Link>
      </nav>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-brand-text-secondary">Available Balance</div>
          <div className="text-lg font-bold text-brand-text">$10,000.00</div>
        </div>
        <button className="p-2 hover:bg-brand-surface rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-brand-text-secondary" />
        </button>
        <button className="p-2 hover:bg-brand-surface rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-brand-text-secondary" />
        </button>
      </div>
    </header>
  );
}

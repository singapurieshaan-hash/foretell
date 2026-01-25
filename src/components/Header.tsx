import { BarChart3, Bell, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-brand-border px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-brand-success to-emerald-600 p-2 rounded-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-brand-text">Foretell</span>
      </div>

      <nav className="flex items-center gap-8">
        <a href="/" className="text-brand-text-secondary hover:text-brand-text font-500 transition-colors">
          Markets
        </a>
        <a href="/" className="text-brand-text-secondary hover:text-brand-text font-500 transition-colors">
          Create
        </a>
        <a href="/" className="text-brand-text-secondary hover:text-brand-text font-500 transition-colors">
          Portfolio
        </a>
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

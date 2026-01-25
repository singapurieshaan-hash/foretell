import { Home, Plus, Briefcase } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-brand-border flex flex-col shadow-xs">
      <div className="p-6 border-b border-brand-border">
        <h2 className="text-sm font-bold text-brand-text-secondary uppercase tracking-widest">Navigation</h2>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-brand-text hover:bg-brand-surface rounded-lg transition-colors font-500 group"
        >
          <Home className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-success transition-colors" />
          All Markets
        </a>
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-brand-text hover:bg-brand-surface rounded-lg transition-colors font-500 group"
        >
          <Plus className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-success transition-colors" />
          Create Market
        </a>
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-brand-text hover:bg-brand-surface rounded-lg transition-colors font-500 group"
        >
          <Briefcase className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-success transition-colors" />
          Portfolio
        </a>
      </nav>

      {/* Quick Stats */}
      <div className="p-6 space-y-4 border-t border-brand-border">
        <div className="bg-brand-surface rounded-lg p-4">
          <div className="text-xs text-brand-text-secondary uppercase tracking-widest font-bold mb-2">Total Markets</div>
          <div className="text-2xl font-bold text-brand-text">2,847</div>
        </div>
        <div className="bg-brand-surface rounded-lg p-4">
          <div className="text-xs text-brand-text-secondary uppercase tracking-widest font-bold mb-2">Trading Volume</div>
          <div className="text-lg font-bold text-brand-success">$842.3M</div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-brand-border text-xs text-brand-text-secondary">
        <p>© 2025 Foretell</p>
        <p className="mt-2">Premium Prediction Markets</p>
      </div>
    </aside>
  );
}

import { BarChart3 } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-accent" />
        <span className="text-2xl font-bold text-gray-900">Foretell</span>
      </div>

      <nav className="flex items-center gap-8">
        <a href="/" className="text-gray-700 hover:text-accent font-medium">
          Markets
        </a>
        <a href="/" className="text-gray-700 hover:text-accent font-medium">
          Create
        </a>
        <a href="/" className="text-gray-700 hover:text-accent font-medium">
          Portfolio
        </a>
      </nav>

      <div className="text-sm text-gray-600">
        Balance: <span className="font-bold">$10,000.00</span>
      </div>
    </header>
  );
}

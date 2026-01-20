

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-900">Navigation</h1>
      </div>

      <nav className="space-y-4 flex-1">
        <a
          href="/"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          All Markets
        </a>
        <a
          href="/"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Create Market
        </a>
        <a
          href="/"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Portfolio
        </a>
      </nav>

      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
        <p>© 2025 Foretell</p>
        <p className="mt-2">Premium Prediction Markets</p>
      </div>
    </aside>
  );
}

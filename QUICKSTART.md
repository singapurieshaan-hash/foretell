# Foretell - Quick Start Guide

Welcome to Foretell! This guide will get you up and running in minutes.

## 🚀 Get Started (5 minutes)

### 1. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Explore the App

- **Home Page**: Browse 6 curated markets with category filters
- **Market Details**: Click "Trade Now" on any market to view details and trade

## 🎮 How to Trade

### Buy Shares
1. Go to any market (click "Trade Now")
2. Select the **Trading Panel** on the right
3. Choose "Buy"
4. Select "YES" or "NO"
5. Enter amount (in dollars)
6. Click "Buy YES/NO"
7. See your position in the **Your Positions** widget

### Sell Shares
1. Click "Sell" in the Trading Panel
2. Select the position type (YES/NO)
3. Enter amount
4. Click "Sell YES/NO"

### Track Profits/Losses
- Your positions appear in the **Your Positions** widget
- Shows current P&L and percentage change
- Updates in real-time as you trade

## 📊 Market Features

### View Probability Charts
1. Open any market
2. See the interactive chart showing probability over time
3. Toggle between time ranges: 1D, 1W, 1M
4. Hover over chart to see exact values

### See Market Information
- Scroll down on market detail page to see:
  - Current YES/NO probabilities
  - Total trading volume
  - Market end date
  - Creator name and fees
  - Resolution criteria

## 💰 Understanding Fees

- **Trading Fee**: 2% per trade
- **Creator Earnings**: 50% of the fee
- **Platform**: 50% of the fee

Example: On a $100 trade:
- Fee: $2
- Creator gets: $1
- Platform gets: $1

## 🎨 UI Navigation

### Top Navigation
- **Foretell Logo**: Return to home
- **Search**: Not yet functional (UI preview)
- **Markets**: Link to home page
- **Create**: Link to home page (feature TBD)
- **Portfolio**: Link to home page (feature TBD)
- **Balance**: Shows your current trading balance

### Left Sidebar
- **All Markets**: View all markets (home)
- **Create Market**: Coming soon
- **Portfolio**: Coming soon
- **© 2025 Foretell**: Footer

## 📱 Mobile Support

Foretell is fully responsive:
- Works on phones, tablets, and desktops
- Touch-friendly buttons and inputs
- Optimized layouts for all screen sizes

## 🔍 Pro Tips

1. **Volume indicates liquidity**: Markets with higher volume tend to have more accurate prices
2. **Featured markets**: High-volume markets are shown first
3. **Trending markets**: Markets with highest YES probability appear in the trending section
4. **Fee calculation**: Always review the fee breakdown before trading
5. **Session data**: All your trades are stored in browser memory (cleared on refresh)

## ❓ Common Questions

### Can I reset my balance?
Refresh the page to start over with a $10,000 balance.

### Where is my data saved?
All data is stored in your browser's memory. It's cleared when you close the tab or refresh the page.

### How accurate are the prices?
Prices are randomly generated to simulate real market movements. They're for demonstration only.

### Can I withdraw my funds?
This is a simulation with mock data. No real money is involved.

### How do I create a market?
Market creation is a feature in development. Currently, you can only trade on existing markets.

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

## 📚 Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # React components
├── lib/             # Mock data and utilities
├── types/           # TypeScript definitions
└── globals.css      # Global styles
```

## 🚀 Deploy to Production

### Option 1: Vercel (Easiest)
```bash
vercel
```

### Option 2: Docker
```bash
docker build -t foretell .
docker run -p 3000:3000 foretell
```

See `DEPLOYMENT.md` for more options.

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

## 🐛 Troubleshooting

### App won't start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Port 3000 is in use
```bash
# Change to different port
PORT=3001 npm run dev
```

### Styles not loading
Clear browser cache (Ctrl+Shift+Delete) and refresh.

## 💡 Next Steps

1. Explore the code in `src/`
2. Try modifying market data in `src/lib/mockData.ts`
3. Customize colors in `tailwind.config.mjs`
4. Add new markets or features
5. Deploy to Vercel

## 📞 Support

For issues or questions:
- Check README.md for architecture details
- Review DEPLOYMENT.md for deployment help
- Examine the source code - it's well-commented
- Read the TypeScript type definitions for API surface

---

**Happy trading!** 🎯

Built with Next.js, React, and Tailwind CSS.

import { Market, PricePoint } from "@/types";

export const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Will Bitcoin reach $100k by end of 2025?",
    slug: "bitcoin-100k-2025",
    description:
      "Resolves YES if Bitcoin closes at $100,000 USD or higher on any day before December 31, 2025.",
    category: "Crypto",
    endDate: new Date("2025-12-31"),
    yesPrice: 72,
    volume: 2500000,
    creatorId: "user-1",
    creatorName: "Alex Chen",
    rules: "Resolves YES if Bitcoin closes at $100,000 USD or higher on any day before December 31, 2025. Resolution source: CoinMarketCap closing price.",
    resolutionSource: {
      type: "exchange_price",
      exchangeName: "CoinMarketCap",
    },
  },
  {
    id: "2",
    title: "Will the S&P 500 exceed 6000 in 2025?",
    slug: "sp500-6000-2025",
    description:
      "Resolves YES if the S&P 500 closes above 6000 points on any day in 2025.",
    category: "Markets",
    endDate: new Date("2025-12-31"),
    yesPrice: 58,
    volume: 1800000,
    creatorId: "user-2",
    creatorName: "Sarah Mitchell",
    rules: "Resolves YES if the S&P 500 closes above 6000 points on any day in 2025. Resolution source: Yahoo Finance closing price.",
    resolutionSource: {
      type: "exchange_price",
      exchangeName: "Yahoo Finance",
    },
  },
  {
    id: "3",
    title: "Will the Kansas City Chiefs win Super Bowl LX?",
    slug: "chiefs-superbowl-2025",
    description:
      "Resolves YES if the Kansas City Chiefs win Super Bowl LX (February 2025).",
    category: "Sports",
    endDate: new Date("2025-02-09"),
    yesPrice: 45,
    volume: 950000,
    creatorId: "user-3",
    creatorName: "Jordan sports",
    rules: "Resolves YES if the Kansas City Chiefs win Super Bowl LX on February 9, 2025. Resolution source: Official NFL announcement.",
    resolutionSource: {
      type: "official_url",
      url: "https://www.nfl.com",
    },
  },
  {
    id: "4",
    title: "Will OpenAI release GPT-5 before December 2025?",
    slug: "openai-gpt5-2025",
    description:
      "Resolves YES if OpenAI releases a model called GPT-5 or later before December 31, 2025.",
    category: "Culture",
    endDate: new Date("2025-12-31"),
    yesPrice: 38,
    volume: 620000,
    creatorId: "user-4",
    creatorName: "Tech Observer",
    rules: "Resolves YES if OpenAI releases a model called GPT-5 or later before December 31, 2025. Resolution source: Official OpenAI announcements.",
    resolutionSource: {
      type: "official_url",
      url: "https://openai.com",
    },
  },
  {
    id: "5",
    title: "Will Ethereum reach $5000 by June 2025?",
    slug: "ethereum-5000-2025",
    description:
      "Resolves YES if Ethereum closes at $5000 USD or higher on any day before June 30, 2025.",
    category: "Crypto",
    endDate: new Date("2025-06-30"),
    yesPrice: 42,
    volume: 1200000,
    creatorId: "user-1",
    creatorName: "Alex Chen",
    rules: "Resolves YES if Ethereum closes at $5000 USD or higher on any day before June 30, 2025. Resolution source: CoinMarketCap.",
    resolutionSource: {
      type: "exchange_price",
      exchangeName: "CoinMarketCap",
    },
  },
  {
    id: "6",
    title: "Will the Fed cut rates below 3% in 2025?",
    slug: "fed-rates-2025",
    description:
      "Resolves YES if the Federal Reserve's federal funds rate drops below 3% by December 31, 2025.",
    category: "Markets",
    endDate: new Date("2025-12-31"),
    yesPrice: 62,
    volume: 880000,
    creatorId: "user-5",
    creatorName: "Economics Daily",
    rules: "Resolves YES if the Federal Reserve's federal funds rate drops below 3% by December 31, 2025. Resolution source: Official Federal Reserve announcements.",
    resolutionSource: {
      type: "official_url",
      url: "https://www.federalreserve.gov",
    },
  },
];

export const generatePriceHistory = (basePrice: number): PricePoint[] => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const points: PricePoint[] = [];
  let price = basePrice * 0.8;

  for (let i = 30; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 20;
    price = Math.max(5, Math.min(95, price + variance));

    points.push({
      timestamp: now - i * oneDay,
      price: Math.round(price * 10) / 10,
    });
  }

  // Ensure last point is the current price
  points[points.length - 1].price = basePrice;

  return points;
};

export const generateWeeklyHistory = (basePrice: number): PricePoint[] => {
  const now = Date.now();
  const fourHours = 4 * 60 * 60 * 1000;

  const points: PricePoint[] = [];
  let price = basePrice * 0.9;

  for (let i = 42; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 15;
    price = Math.max(5, Math.min(95, price + variance));

    points.push({
      timestamp: now - i * fourHours,
      price: Math.round(price * 10) / 10,
    });
  }

  points[points.length - 1].price = basePrice;
  return points;
};

export const generateMonthlyHistory = (basePrice: number): PricePoint[] => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const points: PricePoint[] = [];
  let price = basePrice * 0.7;

  for (let i = 90; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 25;
    price = Math.max(5, Math.min(95, price + variance));

    points.push({
      timestamp: now - i * oneDay,
      price: Math.round(price * 10) / 10,
    });
  }

  points[points.length - 1].price = basePrice;
  return points;
};

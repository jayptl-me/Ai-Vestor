export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  country: string; // 'US' or 'IN'
  currency: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  historicalPrices?: HistoricalPrice[];
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

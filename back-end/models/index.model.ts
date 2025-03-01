// models/index.model.ts

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface IndexData {
  symbol: string;
  name: string;
  currentPrice: number | null;
  change: number | null;
  changePercent: number | null;
  timeframe: string;
  country: string;
  historicalData: HistoricalDataPoint[];
  currency: string;
  error?: string;
}

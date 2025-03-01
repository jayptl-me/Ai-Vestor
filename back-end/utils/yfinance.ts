import type { StockData } from "../models/stock.model";

export async function getStockInfo(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return null;
    }

    const result = data.chart.result[0];
    const quote = result.indicators.quote[0];
    const meta = result.meta;

    return {
      symbol: meta.symbol,
      name: meta.shortName || "",
      exchange: meta.exchangeName || "",
      country: symbol.includes(".NS") ? "IN" : "US",
      currency: meta.currency || (symbol.includes(".NS") ? "INR" : "USD"),
      currentPrice: meta.regularMarketPrice,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent:
        ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) *
        100,
      volume: meta.regularMarketVolume,
      marketCap: meta.marketCap,
    };
  } catch (error) {
    console.error("Error fetching stock info from YFinance:", error);
    return null;
  }
}

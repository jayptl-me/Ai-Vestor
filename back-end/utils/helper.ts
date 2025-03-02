import type { IndexData } from "../models/index.model";

// Define timeframe types and values
type TimeframeKey = "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "ytd" | "all";

const TIMEFRAMES: Record<TimeframeKey, number> = {
  "1d": 86400,
  "1w": 604800,
  "1m": 2592000,
  "3m": 7776000,
  "6m": 15552000,
  "1y": 31536000,
  ytd: 0, // Will be calculated dynamically
  all: 0, // Max available
};

// Define country types and index mappings
type CountryKey = "us" | "in" | "crypto";

interface IndexInfo {
  symbol: string;
  name: string;
}

const INDEXES: Record<CountryKey, IndexInfo[]> = {
  us: [
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^NDX", name: "NASDAQ-100" },
    { symbol: "^DJI", name: "Dow Jones Industrial Average" },
    { symbol: "^RUT", name: "Russell 2000" },
    { symbol: "^VIX", name: "CBOE Volatility Index" },
  ],
  in: [
    { symbol: "^NSEI", name: "NIFTY 50" },
    { symbol: "^BSESN", name: "S&P BSE SENSEX" },
    { symbol: "^CNXIT", name: "Nifty IT" },
    { symbol: "^CNXAUTO", name: "Nifty Auto" },
  ],
  crypto: [
    { symbol: "BTC-USD", name: "Bitcoin" },
    { symbol: "ETH-USD", name: "Ethereum" },
    { symbol: "BNB-USD", name: "Binance Coin" },
    { symbol: "SOL-USD", name: "Solana" },
    { symbol: "XRP-USD", name: "XRP" },
  ],
};

export async function getMarketIndexes(
  country: string = "us",
  timeframe: string = "1m"
): Promise<IndexData[]> {
  try {
    // Validate and convert country to proper type
    const countryKey = country.toLowerCase() as CountryKey;
    if (!INDEXES[countryKey]) {
      throw new Error(`Country not supported: ${country}`);
    }

    // Validate and convert timeframe to proper type
    const tf = timeframe.toLowerCase() as TimeframeKey;
    if (!TIMEFRAMES[tf]) {
      throw new Error(`Timeframe not supported: ${timeframe}`);
    }

    // Calculate time range
    const now = Math.floor(Date.now() / 1000);
    let period1: number;

    if (tf === "ytd") {
      // Year to date: January 1st of current year
      const currentYear = new Date().getFullYear();
      period1 = Math.floor(new Date(currentYear, 0, 1).getTime() / 1000);
    } else if (tf === "all") {
      // Use a very old date for "all" timeframe
      period1 = 0;
    } else {
      // Standard timeframe
      period1 = now - TIMEFRAMES[tf];
    }

    // Define interval based on timeframe
    let interval = "1d"; // Default daily
    if (tf === "1d") interval = "5m";
    else if (tf === "1w") interval = "1h";
    else if (tf === "all") interval = "1wk";

    // Get indexes for the specified country
    const indexes = INDEXES[countryKey];

    // Fetch data for each index
    const results = await Promise.all(
      indexes.map(async (index) => {
        try {
          const url = new URL(
            "https://query1.finance.yahoo.com/v8/finance/chart/" + index.symbol
          );

          url.searchParams.append("period1", period1.toString());
          url.searchParams.append("period2", now.toString());
          url.searchParams.append("interval", interval);

          const response = await fetch(url.toString());
          const data = await response.json();

          if (
            !data.chart ||
            !data.chart.result ||
            data.chart.result.length === 0
          ) {
            throw new Error(`No data found for ${index.symbol}`);
          }

          const result = data.chart.result[0];
          const quote = result.indicators.quote[0];
          const meta = result.meta;
          const timestamps = result.timestamp || [];

          // Get first and last valid prices
          let startPrice = null;
          let endPrice = meta.regularMarketPrice || meta.previousClose;

          // Find first valid price
          if (timestamps.length > 0 && quote.close) {
            for (let i = 0; i < quote.close.length; i++) {
              if (quote.close[i] !== null && quote.close[i] !== undefined) {
                startPrice = quote.close[i];
                break;
              }
            }
          }

          // Calculate change
          const change = endPrice - (startPrice || meta.chartPreviousClose);
          const changePercent =
            (change / (startPrice || meta.chartPreviousClose)) * 100;

          // Extract historical data for chart
          const historicalData = [];
          if (timestamps.length > 0 && quote.close) {
            // Sample data to keep response size reasonable
            const sampleInterval = Math.max(
              1,
              Math.floor(timestamps.length / 100)
            );

            for (let i = 0; i < timestamps.length; i += sampleInterval) {
              if (quote.close[i] !== null && quote.close[i] !== undefined) {
                historicalData.push({
                  date: new Date(timestamps[i] * 1000).toISOString(),
                  price: quote.close[i],
                });
              }
            }

            // Ensure we include the last point
            const lastIdx = timestamps.length - 1;
            if (
              quote.close[lastIdx] !== null &&
              quote.close[lastIdx] !== undefined
            ) {
              historicalData.push({
                date: new Date(timestamps[lastIdx] * 1000).toISOString(),
                price: quote.close[lastIdx],
              });
            }
          }

          return {
            symbol: index.symbol,
            name: index.name,
            currentPrice: endPrice,
            change: change,
            changePercent: changePercent,
            timeframe: tf,
            country: countryKey,
            historicalData: historicalData,
            currency: meta.currency || (countryKey === "in" ? "INR" : "USD"),
          };
        } catch (error) {
          console.error(`Error fetching data for ${index.symbol}:`, error);
          return {
            symbol: index.symbol,
            name: index.name,
            currentPrice: null,
            change: null,
            changePercent: null,
            timeframe: tf,
            country: countryKey,
            historicalData: [],
            currency: countryKey === "in" ? "INR" : "USD",
            error: "Failed to fetch data",
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error("Error in getMarketIndexes:", error);
    throw error;
  }
}

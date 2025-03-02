import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Map market values to API country codes
const marketToCountryCode = {
  US: "us",
  IND: "in",
  CRYPTO: "crypto",
};

// Function to fetch market data from the API
const fetchMarketData = async (country: string, timeframe: string) => {
  const countryCode = marketToCountryCode[country as keyof typeof marketToCountryCode] || "us";
  try {
    const response = await fetch(
      `https://odoo-charusat-ai-vestor-2025-wgl2.onrender.com/api/hotdata/indexes?country=${countryCode}&timeframe=${timeframe}&format=full`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${country} market data`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${country} market data:`, error);
    return { indexes: [] };
  }
};

// Market index fallback data
const marketIndices = {
  US: [
    { id: 1, name: "S&P 500", value: "4,927.11", change: "+0.87%", positive: true },
    { id: 2, name: "NASDAQ", value: "15,628.95", change: "+1.12%", positive: true },
    { id: 3, name: "DOW", value: "38,503.69", change: "+0.59%", positive: true },
    { id: 4, name: "FTSE 100", value: "7,652.08", change: "-0.23%", positive: false },
  ],
  IND: [
    { id: 1, name: "NIFTY 50", value: "22,756.31", change: "+1.15%", positive: true },
    { id: 2, name: "SENSEX", value: "75,143.65", change: "+0.94%", positive: true },
    { id: 3, name: "NIFTY BANK", value: "48,367.45", change: "+0.76%", positive: true },
    { id: 4, name: "BSE MIDCAP", value: "39,917.33", change: "-0.42%", positive: false },
  ],
  CRYPTO: [
    { id: 1, name: "Bitcoin", value: "67,253.11", change: "+2.34%", positive: true },
    { id: 2, name: "Ethereum", value: "3,842.65", change: "+1.56%", positive: true },
    { id: 3, name: "Solana", value: "152.32", change: "-3.21%", positive: false },
    { id: 4, name: "Cardano", value: "0.54", change: "-1.87%", positive: false },
  ],
};

// Chart titles by market
const chartTitles = {
  US: "S&P 500 Performance",
  IND: "NIFTY 50 Performance",
  CRYPTO: "Bitcoin Performance",
};

interface MarketOverviewProps {
  market?: string;
  portfolioData?: any[];
}

const MarketOverview = ({ market = "US", portfolioData = [] }: MarketOverviewProps) => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [indices, setIndices] = useState(marketIndices[market as keyof typeof marketIndices]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1w");
  const timeframes = ["1w", "1m", "3m", "1y"];

  useEffect(() => {
    const loadMarketData = async () => {
      const data = await fetchMarketData(market, selectedTimeframe);

      if (data && data.indexes && data.indexes.length > 0) {
        const primaryIndex = data.indexes[0];
        const chartData = primaryIndex.historicalData.map((entry: any) => ({
          date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: Math.round(entry.price),
        }));
        setMarketData(chartData);

        const updatedIndices = data.indexes.slice(0, 4).map((index: any, i: number) => ({
          id: i + 1,
          name: index.name,
          value: index.currentPrice.toLocaleString(),
          change: `${index.changePercent > 0 ? "+" : ""}${index.changePercent.toFixed(2)}%`,
          positive: index.changePercent > 0,
        }));
        setIndices(updatedIndices);
      } else {
        setMarketData(portfolioData.length > 0 ? portfolioData : []);
        setIndices(marketIndices[market as keyof typeof marketIndices]);
      }

      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    };

    loadMarketData();
  }, [market, selectedTimeframe, portfolioData]);

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const chartTitle = chartTitles[market as keyof typeof chartTitles] || chartTitles.US;

  return (
    <section className="mt-1">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{market} Market Overview</h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            Stay informed with real-time market data and trends from major indices
            {market === "CRYPTO" ? " in cryptocurrency markets." : " around the world."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div
              className={`glass-morphism rounded-2xl p-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <h3 className="text-xl font-semibold mb-6">
                {market === "CRYPTO" ? "Top Cryptocurrencies" : "Major Indices"}
              </h3>
              <div className="space-y-6">
                {indices.map((index) => (
                  <div key={index.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{index.name}</p>
                      <p className="text-sm text-foreground/70">
                        {market === "CRYPTO" ? (index.name === "Bitcoin" || index.name === "Ethereum" ? "$" : "") : ""}
                        {index.value}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-sm font-medium ${index.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {index.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-3 order-1 lg:order-2 glass-morphism rounded-2xl p-6 transition-all duration-500 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{chartTitle}</h3>
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => handleTimeframeChange(timeframe)}
                    className={`px-3 py-1 text-sm rounded-md ${selectedTimeframe === timeframe
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/60 hover:bg-secondary/20"
                      }`}
                  >
                    {timeframe.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={["dataMin - 1000", "dataMax + 1000"]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(tick) => tick.toLocaleString()}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${market === "CRYPTO" ? "$" : ""}${value.toLocaleString()}`, "Value"]}
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketOverview;
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/use-toast";
import MarketOverview from "../components/MarketOverview";
import NewsSentiment from "../components/NewsSentiment";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";

// Map market values to API country codes
const marketToCountryCode = {
  US: "us",
  IND: "in",
  CRYPTO: "crypto", // Adjust if the API uses a different code for crypto
};

// Function to fetch data from the API
const fetchMarketData = async (market: string, timeframe: string) => {
  const countryCode = marketToCountryCode[market as keyof typeof marketToCountryCode] || "us";
  try {
    const response = await fetch(
      `https://odoo-charusat-ai-vestor-2025-wgl2.onrender.com/api/hotdata/indexes?country=${countryCode}&timeframe=${timeframe}&format=full`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${market} market data`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${market} market data:`, error);
    return null;
  }
};

// Function to fetch sentiment data
const fetchSentimentData = async (market: string) => {
  const countryCode = marketToCountryCode[market as keyof typeof marketToCountryCode] || "us";
  try {
    const response = await fetch(
      `https://odoo-charusat-ai-vestor-2025-wgl2.onrender.com/api/analysis/overallsentiment/${countryCode}`
    );
    if (!response.ok) throw new Error(`Failed to fetch sentiment data for ${market}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching sentiment data:`, error);
    return null;
  }
};

// Function to generate portfolio data based on fetched market data
const generatePortfolioData = (timeframe: string, marketData: any, market: string) => {
  if (!marketData || !marketData.indexes || marketData.indexes.length === 0) {
    return [];
  }

  // Define primary index based on market
  const primaryIndexSymbol = {
    IND: "^NSEI", // NIFTY 50 for India
    US: "^GSPC",  // S&P 500 for US (adjust based on API response)
    CRYPTO: "BTC", // Bitcoin (adjust based on API response)
  }[market] || "^NSEI";

  const primaryIndexData = marketData.indexes.find(
    (index: any) => index.symbol === primaryIndexSymbol
  );

  if (!primaryIndexData || !primaryIndexData.historicalData) {
    return [];
  }

  const historicalData = primaryIndexData.historicalData.map((entry: any) => {
    const date = new Date(entry.date);
    return {
      name: date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: entry.price,
    };
  });

  switch (timeframe) {
    case "1W":
      return historicalData;
    case "1M":
      return historicalData.slice(-28);
    case "3M":
      return historicalData.slice(-84);
    case "6M":
      return historicalData.slice(-168);
    case "YTD":
      return historicalData.filter((entry: any) => {
        const entryDate = new Date(entry.name);
        return entryDate.getFullYear() === new Date().getFullYear();
      });
    case "1Y":
      return historicalData.slice(-252);
    case "5Y":
      return historicalData;
    default:
      return historicalData;
  }
};

// Dummy watchlist data (generalized for now, replace with API data if available)
const watchlistData = {
  US: [
    { ticker: "AAPL", name: "Apple Inc.", price: "187.63", change: "+1.23", percentChange: "+0.66%", positive: true },
    { ticker: "MSFT", name: "Microsoft Corp.", price: "403.78", change: "+3.45", percentChange: "+0.86%", positive: true },
    { ticker: "GOOGL", name: "Alphabet Inc.", price: "147.92", change: "+0.54", percentChange: "+0.37%", positive: true },
    { ticker: "AMZN", name: "Amazon.com Inc.", price: "174.63", change: "-1.26", percentChange: "-0.72%", positive: false },
    { ticker: "TSLA", name: "Tesla Inc.", price: "175.21", change: "-3.54", percentChange: "-1.98%", positive: false },
  ],
  IND: [
    { ticker: "RELIANCE", name: "Reliance Industries", price: "2987.63", change: "+12.23", percentChange: "+0.41%", positive: true },
    { ticker: "TCS", name: "Tata Consultancy", price: "4098.78", change: "+34.45", percentChange: "+0.85%", positive: true },
    { ticker: "HDFCBANK", name: "HDFC Bank", price: "1447.92", change: "-5.54", percentChange: "-0.38%", positive: false },
    { ticker: "INFY", name: "Infosys", price: "1674.63", change: "+11.26", percentChange: "+0.68%", positive: true },
    { ticker: "ICICIBANK", name: "ICICI Bank", price: "1075.21", change: "-3.54", percentChange: "-0.33%", positive: false },
  ],
  CRYPTO: [
    { ticker: "BTC", name: "Bitcoin", price: "67253.11", change: "+234.23", percentChange: "+2.34%", positive: true },
    { ticker: "ETH", name: "Ethereum", price: "3842.65", change: "+56.45", percentChange: "+1.56%", positive: true },
    { ticker: "SOL", name: "Solana", price: "152.32", change: "-3.21", percentChange: "-3.21%", positive: false },
    { ticker: "ADA", name: "Cardano", price: "0.54", change: "-0.01", percentChange: "-1.87%", positive: false },
    { ticker: "XRP", name: "Ripple", price: "0.62", change: "+0.01", percentChange: "+1.61%", positive: true },
  ],
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioTimeframe, setPortfolioTimeframe] = useState("1W");
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const { toast } = useToast();

  const [selectedMarket, setSelectedMarket] = useState("IND");
  const marketOptions = ["US", "IND", "CRYPTO"];

  const [sentimentData, setSentimentData] = useState<any>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      setIsLoading(true);
      const [marketResponse, sentimentResponse] = await Promise.all([
        fetchMarketData(selectedMarket, portfolioTimeframe),
        fetchSentimentData(selectedMarket),
      ]);
      setMarketData(marketResponse);
      setSentimentData(sentimentResponse); // Store sentiment data
      setPortfolioData(generatePortfolioData(portfolioTimeframe, marketResponse, selectedMarket));
      setIsLoading(false);
    };

    loadMarketData();
  }, [selectedMarket, portfolioTimeframe]);

  const handleTimeframeChange = (timeframe: string) => {
    if (timeframe === portfolioTimeframe) return;
    setPortfolioTimeframe(timeframe);
    toast({
      title: "Timeframe Updated",
      description: `Portfolio data now showing ${timeframe === "YTD" ? "year-to-date" : timeframe} performance.`,
      duration: 2000,
    });
  };

  const handleMarketChange = (market: string) => {
    if (market === selectedMarket) return;
    setSelectedMarket(market);
    toast({
      title: "Market Changed",
      description: `Now showing ${market} market data.`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-end items-center mt-3">
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    {selectedMarket} Market
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  {marketOptions.map((market) => (
                    <DropdownMenuItem
                      key={market}
                      onClick={() => handleMarketChange(market)}
                      className={`cursor-pointer ${selectedMarket === market ? "bg-secondary" : ""}`}
                    >
                      {market}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-8">
            {isLoading ? (
              <p>Loading market data...</p>
            ) : (
              <>
                <MarketOverview market={selectedMarket} portfolioData={portfolioData} />
                <NewsSentiment market={selectedMarket} sentimentData={sentimentData} />                <div className="glass-morphism rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">{selectedMarket} Hot Stocks</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 font-medium text-foreground/70">Symbol</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground/70">Name</th>
                          <th className="text-right py-3 px-4 font-medium text-foreground/70">Price</th>
                          <th className="text-right py-3 px-4 font-medium text-foreground/70">Change</th>
                          <th className="text-right py-3 px-4 font-medium text-foreground/70">% Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchlistData[selectedMarket as keyof typeof watchlistData].map((stock, index) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="py-4 px-4 font-medium">{stock.ticker}</td>
                            <td className="py-4 px-4 text-foreground/70">{stock.name}</td>
                            <td className="py-4 px-4 text-right">
                              {selectedMarket === "CRYPTO" ? "$" : "₹"}{stock.price}
                            </td>
                            <td className={`py-4 px-4 text-right ${stock.positive ? "text-green-600" : "text-red-600"}`}>
                              {stock.change}
                            </td>
                            <td className={`py-4 px-4 text-right ${stock.positive ? "text-green-600" : "text-red-600"}`}>
                              {stock.percentChange}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
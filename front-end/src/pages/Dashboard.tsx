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

// Sample data for different timeframes
const generatePortfolioData = (timeframe: string) => {
  // Base values for starting points
  const baseValue = 15000;

  // Define data structure for each timeframe
  const valuesByTimeframe: Record<string, any[]> = {
    "1M": [],
    "3M": [],
    "6M": [],
    "YTD": [],
    "1Y": [
      { name: "Jan", value: 15000 },
      { name: "Feb", value: 16200 },
      { name: "Mar", value: 15800 },
      { name: "Apr", value: 17300 },
      { name: "May", value: 18900 },
      { name: "Jun", value: 19200 },
      { name: "Jul", value: 20100 },
      { name: "Aug", value: 21500 },
      { name: "Sep", value: 22800 },
      { name: "Oct", value: 23200 },
      { name: "Nov", value: 24600 },
      { name: "Dec", value: 26000 },
    ],
    "5Y": []
  };

  // Generate 1M data with weekly intervals
  const monthlyValues = [baseValue * 1.71, baseValue * 1.73, baseValue * 1.70, baseValue * 1.73];
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Populate 1M data
  for (let i = 0; i < monthlyValues.length; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - ((monthlyValues.length - 1 - i) * 7));
    valuesByTimeframe["1M"].push({
      name: `${monthNames[date.getMonth()]} ${date.getDate()}`,
      value: monthlyValues[i]
    });
  }

  // Populate 3M data
  const threeMonthValues = [baseValue * 1.55, baseValue * 1.60, baseValue * 1.63, baseValue * 1.67, baseValue * 1.70, baseValue * 1.73];
  for (let i = 0; i < threeMonthValues.length; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - ((threeMonthValues.length - 1 - i) * 14));
    valuesByTimeframe["3M"].push({
      name: `${monthNames[date.getMonth()]} ${date.getDate()}`,
      value: threeMonthValues[i]
    });
  }

  // Populate 6M data
  const sixMonthValues = [baseValue * 1.40, baseValue * 1.43, baseValue * 1.49, baseValue * 1.55, baseValue * 1.60, baseValue * 1.63, baseValue * 1.67, baseValue * 1.70, baseValue * 1.73];
  for (let i = 0; i < sixMonthValues.length; i++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (sixMonthValues.length - 1 - i));
    valuesByTimeframe["6M"].push({
      name: monthNames[date.getMonth()],
      value: sixMonthValues[i]
    });
  }

  // Populate YTD data
  const ytdValues = [baseValue * 1.47, baseValue * 1.52, baseValue * 1.55, baseValue * 1.60, baseValue * 1.63, baseValue * 1.67, baseValue * 1.70, baseValue * 1.73];
  const currentMonth = now.getMonth();
  for (let i = 0; i <= currentMonth; i++) {
    if (i < ytdValues.length) {
      valuesByTimeframe["YTD"].push({
        name: monthNames[i],
        value: ytdValues[i]
      });
    }
  }

  // Create 5Y data with a general uptrend and some volatility
  let fiveYearValue = baseValue * 0.65; // Starting at a lower point 5 years ago
  const startDate = new Date(now);
  startDate.setFullYear(now.getFullYear() - 5);

  for (let year = 1; year <= 5; year++) {
    for (let month = 1; month <= 12; month++) {
      const growth = 1 + (Math.random() * 0.04 - 0.01); // Random growth between -1% and 3%
      fiveYearValue *= growth;

      if (year === 5 && month > 3) continue; // Only show up to current month in the 5th year

      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + ((year - 1) * 12) + (month - 1));

      valuesByTimeframe["5Y"].push({
        name: date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' }),
        value: Math.round(fiveYearValue * 100) / 100
      });
    }
  }

  // Return the appropriate data for the selected timeframe
  return valuesByTimeframe[timeframe] || valuesByTimeframe["1Y"];
};


const watchlistData = [
  { ticker: "AAPL", name: "Apple Inc.", price: "187.63", change: "+1.23", percentChange: "+0.66%", positive: true },
  { ticker: "MSFT", name: "Microsoft Corp.", price: "403.78", change: "+3.45", percentChange: "+0.86%", positive: true },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: "147.92", change: "+0.54", percentChange: "+0.37%", positive: true },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: "174.63", change: "-1.26", percentChange: "-0.72%", positive: false },
  { ticker: "TSLA", name: "Tesla Inc.", price: "175.21", change: "-3.54", percentChange: "-1.98%", positive: false },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioTimeframe, setPortfolioTimeframe] = useState("1Y");
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Market selection state
  const [selectedMarket, setSelectedMarket] = useState("IND");
  const marketOptions = ["US", "IND", "CRYPTO"];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);

    const timer = setTimeout(() => {
      setPortfolioData(generatePortfolioData(portfolioTimeframe));
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [portfolioTimeframe]);

  const handleTimeframeChange = (timeframe: string) => {
    if (timeframe === portfolioTimeframe) return;

    setPortfolioTimeframe(timeframe);
    toast({
      title: "Timeframe Updated",
      description: `Portfolio data now showing ${timeframe === "YTD" ? "year-to-date" : timeframe} performance.`,
      duration: 2000,
    });
  };
  
  // Market selection handler
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
          {/* Dashboard header with market selection control */}
          <div className="flex flex-col sm:flex-row justify-end items-center mt-3">
           
            
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              {/* Market Selection Dropdown */}
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
                      className={`cursor-pointer ${
                        selectedMarket === market ? "bg-secondary" : ""
                      }`}
                    >
                      {market}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
         
          
          {/* Display all sections with the selected market */}
          <div className="space-y-8">
            <MarketOverview market={selectedMarket} />
            <NewsSentiment market={selectedMarket} />
            
            <div className="glass-morphism rounded-2xl p-6">
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
                    {watchlistData.map((stock, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-4 font-medium">{stock.ticker}</td>
                        <td className="py-4 px-4 text-foreground/70">{stock.name}</td>
                        <td className="py-4 px-4 text-right">${stock.price}</td>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { ChevronDown, Search, Info, Clock, PlusCircle, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

// Sample stock data
const generateStockData = (ticker: string) => {
  const data = [];
  const now = new Date();
  let baseValue = ticker === "AAPL" ? 187 :
    ticker === "MSFT" ? 403 :
      ticker === "GOOGL" ? 147 :
        ticker === "AMZN" ? 174 : 175;

  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    if (i > 30) {
      // Historical data: Create a pattern with some randomness
      const day = i / 30;
      const volatility = ticker === "TSLA" ? 0.04 : 0.015; // Tesla more volatile
      const trend = ticker === "MSFT" || ticker === "GOOGL" ? 0.0003 : 0.0001; // Microsoft and Google with stronger uptrend

      // Create a slightly randomized sine wave pattern with an uptrend
      baseValue = baseValue * (1 + Math.sin(day) * volatility * (Math.random() * 0.5 + 0.8)) + baseValue * trend;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat(baseValue.toFixed(2)),
        prediction: null
      });
    } else {
      // Recent data: Create a pattern with some randomness
      const volatility = ticker === "TSLA" ? 0.03 : 0.01;
      const trend = ticker === "AMZN" ? -0.0002 : 0.0002; // Amazon with a slight downtrend

      baseValue = baseValue * (1 + (Math.random() * 2 - 1) * volatility) + baseValue * trend;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat(baseValue.toFixed(2)),
        prediction: null
      });
    }
  }

  // Add prediction for next 30 days
  let lastValue = data[data.length - 1].value;
  const uptrend = ticker === "AAPL" || ticker === "MSFT" || ticker === "GOOGL";
  const trendFactor = uptrend ? 1.00015 : 0.99985;
  const volatility = ticker === "TSLA" ? 0.02 : 0.008;

  for (let i = 1; i <= 30; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);

    lastValue = lastValue * trendFactor * (1 + (Math.random() * 2 - 1) * volatility);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: null,
      prediction: parseFloat(lastValue.toFixed(2))
    });
  }

  return data;
};

// Available stocks
const availableStocks = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
];

const StockPrediction = () => {
  const [selectedStock, setSelectedStock] = useState(availableStocks[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1Y");
  const [confidence, setConfidence] = useState(85);
  const { toast } = useToast();

  // Load stock data when selected stock changes
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      setStockData(generateStockData(selectedStock.ticker));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedStock]);

  // Filter data based on timeframe
  const getFilteredData = () => {
    if (!stockData.length) return [];

    const cutoffIndex = stockData.findIndex(item => item.prediction !== null) - 1;

    switch (timeframe) {
      case "1M":
        return stockData.slice(cutoffIndex - 30);
      case "3M":
        return stockData.slice(cutoffIndex - 90);
      case "6M":
        return stockData.slice(cutoffIndex - 180);
      case "1Y":
      default:
        return stockData;
    }
  };

  const filteredData = getFilteredData();

  // Calculate current price and prediction
  const currentPrice = stockData.length ?
    stockData.find(item => item.prediction === null && item.value !== null)?.value?.toFixed(2) : null;

  const latestPrediction = stockData.length ?
    stockData.filter(item => item.prediction !== null)[0]?.prediction?.toFixed(2) : null;

  const finalPrediction = stockData.length ?
    stockData[stockData.length - 1]?.prediction?.toFixed(2) : null;

  const predictionChange = currentPrice && finalPrediction ?
    ((parseFloat(finalPrediction) - parseFloat(currentPrice)) / parseFloat(currentPrice) * 100).toFixed(2) : null;

  const isPredictionPositive = predictionChange ? parseFloat(predictionChange) > 0 : null;

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${selectedStock.ticker} has been added to your watchlist.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Stock Price Prediction</h1>
            <p className="text-foreground/70">
              Use our AI model to predict future stock prices based on historical data and market patterns.
            </p>
          </div>

          {/* Stock selector and prediction panel */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Left side - controls */}
            <div className="lg:col-span-1">
              <div className="glass-morphism rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Stock</h3>

                {/* Stock dropdown */}
                <div className="relative mb-6">
                  <button
                    className="w-full flex items-center justify-between bg-white dark:bg-background border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                        <span className="font-semibold text-primary">{selectedStock.ticker.substring(0, 1)}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{selectedStock.ticker}</div>
                        <div className="text-xs text-foreground/60">{selectedStock.name}</div>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-foreground/60" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-background rounded-lg shadow-lg border border-border overflow-hidden">
                      <div className="p-2">
                        <div className="flex items-center bg-secondary/50 rounded-md px-3 py-2">
                          <Search className="h-4 w-4 text-foreground/60 mr-2" />
                          <input
                            type="text"
                            placeholder="Search stocks..."
                            className="bg-transparent border-none w-full focus:outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {availableStocks.map((stock) => (
                          <button
                            key={stock.ticker}
                            className="w-full flex items-center p-3 hover:bg-secondary/50 transition-colors"
                            onClick={() => {
                              setSelectedStock(stock);
                              setDropdownOpen(false);
                            }}
                          >
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                              <span className="font-semibold text-primary">{stock.ticker.substring(0, 1)}</span>
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{stock.ticker}</div>
                              <div className="text-xs text-foreground/60">{stock.name}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeframe selector */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Timeframe</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["1M", "3M", "6M", "1Y"].map((period) => (
                      <button
                        key={period}
                        className={`py-2 px-3 text-sm rounded-md transition-colors ${timeframe === period
                            ? "bg-primary text-white"
                            : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                          }`}
                        onClick={() => setTimeframe(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleAddToWatchlist}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add to Watchlist
                  </Button>
                </div>
              </div>

              {/* AI Confidence */}
              <div className="glass-morphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">AI Confidence</h3>
                  <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-1">
                    High
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Confidence Score</span>
                    <span className="font-medium">{confidence}%</span>
                  </div>
                  <div className="w-full bg-secondary/80 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mt-0.5 mr-3 text-foreground/60" />
                    <div className="text-sm">
                      <p className="font-medium">Recent data analyzed</p>
                      <p className="text-foreground/60 text-xs">Last updated 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 mt-0.5 mr-3 text-foreground/60" />
                    <div className="text-sm">
                      <p className="font-medium">Market volatility: Low</p>
                      <p className="text-foreground/60 text-xs">Stable conditions for prediction</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mt-0.5 mr-3 text-foreground/60" />
                    <div className="text-sm">
                      <p className="font-medium">Prediction model</p>
                      <p className="text-foreground/60 text-xs">Advanced neural network with technical and fundamental analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - chart and predictions */}
            <div className="lg:col-span-3">
              {/* Stock price and prediction summary */}
              <div className="glass-morphism rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedStock.ticker}: {selectedStock.name}</h2>
                  {isPredictionPositive !== null && (
                    <div className={`flex items-center ${isPredictionPositive ? "text-green-600" : "text-red-600"
                      }`}>
                      {isPredictionPositive ? (
                        <TrendingUp className="h-5 w-5 mr-2" />
                      ) : (
                        <TrendingDown className="h-5 w-5 mr-2" />
                      )}
                      <span className="font-bold">{predictionChange}%</span>
                      <span className="text-sm text-foreground/60 ml-1">30-day forecast</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-foreground/60 text-sm mb-1">Current Price</div>
                    <div className="text-3xl font-bold">${currentPrice || "—"}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60 text-sm mb-1">30-Day Prediction</div>
                    <div className="text-3xl font-bold">${finalPrediction || "—"}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60 text-sm mb-1">Confidence Level</div>
                    <div className="text-3xl font-bold">
                      {confidence}%
                      <span className="text-sm font-normal text-foreground/60 ml-2">High</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price chart */}
              <div className="glass-morphism rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Price Prediction Chart</h3>
                  <p className="text-sm text-foreground/70">
                    Historical price data with AI-generated 30-day price prediction
                  </p>
                </div>

                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={filteredData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          domain={['auto', 'auto']}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(tick) => {
                            return `$${tick.toFixed(0)}`;
                          }}
                        />
                        <Tooltip
                          formatter={(value: any) => value ? [`$${value.toFixed(2)}`, 'Price'] : ['-', 'Price']}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <ReferenceLine
                          x={filteredData.findIndex(item => item.prediction !== null)}
                          stroke="#888"
                          strokeDasharray="3 3"
                          label={{ value: 'Today', position: 'insideTopRight', fill: '#888', fontSize: 12 }}
                        />
                        <Line
                          name="Historical Price"
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          name="AI Prediction"
                          type="monotone"
                          dataKey="prediction"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="mt-6 p-4 bg-secondary/30 rounded-lg text-sm">
                  <p className="flex items-start">
                    <Info className="h-4 w-4 mt-0.5 mr-2 text-foreground/70" />
                    <span>
                      Our AI model predicts that {selectedStock.ticker} will
                      {isPredictionPositive ? " increase " : " decrease "}
                      by {predictionChange ? Math.abs(parseFloat(predictionChange)).toFixed(2) : "—"}%
                      over the next 30 days. This prediction is based on historical data, market trends, and sentiment analysis.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockPrediction;

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { ChevronDown, Search, Info, Clock, PlusCircle, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

interface PredictionResponse {
  ticker: string;
  timeframe: string;
  interval: string;
  lstm_predictions: number[];
  predicted_price_range: string;
  current_price: number;
  projected_change: string;
  quantitative_analysis: string;
}

const availableStocks = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "BTC-USD", name: "Bitcoin" }
];

const timeframeOptions = [
  { value: "1 minutes", label: "1 Min" },
  { value: "5 minutes", label: "5 Min" },
  { value: "1 hour", label: "1 Hour" },
  { value: "1 day", label: "1 Day" },
];

const intervalOptions = [
  { value: "1m", label: "1 Min" },
  { value: "5m", label: "5 Min" },
];

const StockPrediction = () => {
  const [selectedStock, setSelectedStock] = useState(availableStocks[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("5m"); // Set to match your API response
  const [interval, setInterval] = useState("1m");   // Set to match your API response
  const [confidence, setConfidence] = useState(85);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);

    const fetchPredictionData = async () => {
      try {
        const baseUrl = "http://141.148.216.88:8000"; // Replace with your actual base URL
        const url = `${baseUrl}/predict/${selectedStock.ticker}?timeframe=${encodeURIComponent(timeframe)}&interval=${interval}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPredictionData(data);
        const chartData = generateChartData(data);
        setStockData(chartData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch prediction data. Using mock data instead.",
          duration: 3000,
        });

        // Fallback mock data
        const mockResponse: PredictionResponse = {
          ticker: selectedStock.ticker,
          timeframe: timeframe,
          interval: interval,
          lstm_predictions: [241.82846069335938, 240.99771118164062, 239.925048828125, 239.5954132080078, 239.3077850341797],
          predicted_price_range: "$239.31 - $241.83",
          current_price: 241.83999633789062,
          projected_change: "-1.05%",
          quantitative_analysis: "LSTM model projects a fall to approximately $239.31"
        };
        setPredictionData(mockResponse);
        const chartData = generateChartData(mockResponse);
        setStockData(chartData);
        setIsLoading(false);
      }
    };

    fetchPredictionData();
  }, [selectedStock, timeframe, interval, toast]);

  const generateChartData = (data: PredictionResponse) => {
    if (!data) return [];

    const chartData = [];
    const now = new Date();

    // Add current price as the starting point
    chartData.push({
      time: "Now",
      value: data.current_price,
      prediction: null
    });

    // Add prediction points
    data.lstm_predictions.forEach((prediction, index) => {
      const minutesAhead = (index + 1);
      chartData.push({
        time: `+${minutesAhead}m`,
        value: null,
        prediction: prediction
      });
    });

    return chartData;
  };

  const filteredData = stockData;

  const predictionChange = predictionData?.projected_change || null;
  const isPredictionPositive = predictionChange ? predictionChange.includes('+') : null;

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${selectedStock.ticker} has been added to your watchlist.`,
      duration: 3000,
    });
  };

  const getTimeframeDisplay = (tf: string) => {
    const option = timeframeOptions.find(o => o.value === tf);
    return option ? option.label : tf;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Stock Price Prediction</h1>
            <p className="text-foreground/70">
              Use our AI model to predict future stock prices based on historical data and market patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="glass-morphism rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Stock</h3>
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

                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Prediction Timeframe</h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {timeframeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`py-2 px-3 text-sm rounded-md transition-colors ${timeframe === option.value
                          ? "bg-primary text-white"
                          : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                          }`}
                        onClick={() => setTimeframe(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <h4 className="text-sm font-medium mb-2">Data Interval</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {intervalOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`py-2 px-3 text-sm rounded-md transition-colors ${interval === option.value
                          ? "bg-primary text-white"
                          : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                          }`}
                        onClick={() => setInterval(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>


            </div>

            <div className="lg:col-span-3">
              <div className="glass-morphism rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedStock.ticker}: {selectedStock.name}</h2>
                  {isPredictionPositive !== null && (
                    <div className={`flex items-center ${isPredictionPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPredictionPositive ? (
                        <TrendingUp className="h-5 w-5 mr-2" />
                      ) : (
                        <TrendingDown className="h-5 w-5 mr-2" />
                      )}
                      <span className="font-bold">{predictionChange}</span>
                      <span className="text-sm text-foreground/60 ml-1">{getTimeframeDisplay(timeframe)} forecast</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-foreground/60 text-sm mb-1">Current Price</div>
                    <div className="text-3xl font-bold">${predictionData?.current_price.toFixed(2) || "—"}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60 text-sm mb-1">Predicted Range</div>
                    <div className="text-3xl font-bold">{predictionData?.predicted_price_range || "—"}</div>
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

              <div className="glass-morphism rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Price Prediction Chart</h3>
                  <p className="text-sm text-foreground/70">
                    Current price with AI-generated {getTimeframeDisplay(timeframe)} price prediction using {intervalOptions.find(i => i.value === interval)?.label} intervals
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
                          dataKey="time"
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
                          tickFormatter={(tick) => `$${tick.toFixed(0)}`}
                        />
                        <Tooltip
                          formatter={(value: any) => value ? [`$${value.toFixed(2)}`, 'Price'] : ['-', 'Price']}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Legend />
                        <ReferenceLine
                          x={0}
                          stroke="#888"
                          strokeDasharray="3 3"
                          label={{ value: 'Current', position: 'insideTopRight', fill: '#888', fontSize: 12 }}
                        />
                        <Line
                          name="Current Price"
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          name="LSTM Prediction"
                          type="monotone"
                          dataKey="prediction"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg text-sm">
                  <p className="flex items-start">
                    <Info className="h-4 w-4 mt-0.5 mr-2 text-foreground/70" />
                    <span>{predictionData?.quantitative_analysis || "No analysis available"}</span>
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


import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import Navbar from "../components/Navbar";
import { ArrowUp, ArrowDown, BarChart3, TrendingUp, AlertTriangle, Briefcase } from "lucide-react";
import { useToast } from "../hooks/use-toast";

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

const allocationData = [
  { name: "Technology", value: 35 },
  { name: "Healthcare", value: 20 },
  { name: "Financials", value: 15 },
  { name: "Consumer", value: 10 },
  { name: "Energy", value: 10 },
  { name: "Other", value: 10 },
];

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#3b82f6", "#0ea5e9", "#06b6d4"];

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Dashboard header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/70">
              Welcome back! Here's an overview of your investment portfolio.
            </p>
          </div>

          {/* Portfolio summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Portfolio Value",
                value: "$26,483.79",
                change: "+$1,245.32 (4.9%)",
                positive: true,
                icon: <Briefcase className="h-6 w-6 text-primary" />,
              },
              {
                title: "Today's Return",
                value: "$324.17",
                change: "+1.2%",
                positive: true,
                icon: <TrendingUp className="h-6 w-6 text-green-500" />,
              },
              {
                title: "Risk Level",
                value: "Moderate",
                change: "Balanced exposure",
                positive: null,
                icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
              },
              {
                title: "AI Confidence",
                value: "High",
                change: "Based on current data",
                positive: null,
                icon: <BarChart3 className="h-6 w-6 text-primary" />,
              },
            ].map((item, index) => (
              <div key={index} className="glass-morphism rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-foreground/70 text-sm mb-1">{item.title}</p>
                    <h3 className="text-2xl font-semibold">{item.value}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                {item.positive !== null && (
                  <div className={`text-sm ${item.positive ? "text-green-600" : "text-red-600"}`}>
                    <span className="flex items-center">
                      {item.positive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {item.change}
                    </span>
                  </div>
                )}
                {item.positive === null && (
                  <div className="text-sm text-foreground/70">{item.change}</div>
                )}
              </div>
            ))}
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Portfolio performance chart */}
            <div className="glass-morphism rounded-2xl p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Portfolio Performance</h3>
                <div className="flex flex-wrap gap-1 sm:space-x-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${portfolioTimeframe === "1Y" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"}`}
                    onClick={() => handleTimeframeChange("1Y")}
                  >
                    1Y
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${portfolioTimeframe === "YTD" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"}`}
                    onClick={() => handleTimeframeChange("YTD")}
                  >
                    YTD
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${portfolioTimeframe === "6M" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"}`}
                    onClick={() => handleTimeframeChange("6M")}
                  >
                    6M
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${portfolioTimeframe === "3M" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"}`}
                    onClick={() => handleTimeframeChange("3M")}
                  >
                    3M
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${portfolioTimeframe === "1M" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"}`}
                    onClick={() => handleTimeframeChange("1M")}
                  >
                    1M
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${portfolioTimeframe === "5Y" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"}`}
                    onClick={() => handleTimeframeChange("5Y")}
                  >
                    5Y
                  </button>
                </div>
              </div>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(tick) => {
                          return `$${(tick / 1000).toFixed(0)}k`;
                        }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                        contentStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={portfolioTimeframe === "5Y" ? false : { strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Asset allocation chart */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Asset Allocation</h3>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value}%`, 'Allocation']}
                        contentStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Watchlist */}
          <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">Watchlist</h3>
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
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Navbar from "../components/Navbar";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";

// Utility functions (unchanged)
const getSentimentColor = (value: number) => {
  if (value >= 60) return "#4ade80"; // green
  if (value >= 40) return "#facc15"; // yellow
  return "#f87171"; // red
};

const getSentimentText = (sentiment: string) => {
  if (sentiment === "positive") return "Positive";
  if (sentiment === "neutral") return "Neutral";
  return "Negative";
};

const getSentimentClass = (sentiment: string) => {
  if (sentiment === "positive") return "bg-green-100 text-green-800";
  if (sentiment === "neutral") return "bg-slate-100 text-slate-800";
  return "bg-red-100 text-red-800";
};

const getImpactClass = (impact: string) => {
  if (impact === "high") return "bg-primary/10 text-primary";
  if (impact === "medium") return "bg-yellow-100 text-yellow-800";
  return "bg-slate-100 text-slate-800";
};

const getDominantSentiment = (sentiment: { bullish: number; bearish: number; neutral: number }) => {
  const { bullish, bearish, neutral } = sentiment;
  if (bullish > bearish && bullish > neutral) return "positive";
  if (bearish > bullish && bearish > neutral) return "negative";
  return "neutral";
};

const getImpact = (sentiment: { bullish: number; bearish: number; neutral: number }) => {
  const maxSentiment = Math.max(sentiment.bullish, sentiment.bearish, sentiment.neutral);
  if (maxSentiment >= 70) return "high";
  if (maxSentiment >= 40) return "medium";
  return "low";
};

const timeAgo = (dateString: string) => {
  const now = new Date();
  const published = new Date(dateString);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Less than an hour ago";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

// Stock data by market with random but plausible values
const stockDataByMarket = {
  IND: [
    { ticker: "RELIANCE", name: "Reliance Industries", sentiment: 60, change: "+5", trending: "up", articles: 50 },
    { ticker: "TCS", name: "Tata Consultancy", sentiment: 70, change: "+8", trending: "up", articles: 40 },
    { ticker: "HDFCBANK", name: "HDFC Bank", sentiment: 45, change: "-3", trending: "down", articles: 30 },
    { ticker: "INFY", name: "Infosys", sentiment: 65, change: "+6", trending: "up", articles: 35 },
    { ticker: "COALINDIA", name: "Coal India", sentiment: 75, change: "+10", trending: "up", articles: 25 },
  ],
  US: [
    { ticker: "AAPL", name: "Apple Inc.", sentiment: 72, change: "+7", trending: "up", articles: 45 },
    { ticker: "MSFT", name: "Microsoft Corp.", sentiment: 68, change: "+4", trending: "up", articles: 38 },
    { ticker: "GOOGL", name: "Alphabet Inc.", sentiment: 55, change: "-2", trending: "down", articles: 32 },
    { ticker: "AMZN", name: "Amazon.com Inc.", sentiment: 63, change: "+5", trending: "up", articles: 40 },
    { ticker: "TSLA", name: "Tesla Inc.", sentiment: 48, change: "-6", trending: "down", articles: 50 },
  ],
  CRYPTO: [
    { ticker: "BTC", name: "Bitcoin", sentiment: 67, change: "+9", trending: "up", articles: 60 },
    { ticker: "ETH", name: "Ethereum", sentiment: 62, change: "+4", trending: "up", articles: 55 },
    { ticker: "SOL", name: "Solana", sentiment: 40, change: "-5", trending: "down", articles: 35 },
    { ticker: "ADA", name: "Cardano", sentiment: 53, change: "-3", trending: "down", articles: 30 },
    { ticker: "XRP", name: "Ripple", sentiment: 70, change: "+6", trending: "up", articles: 45 },
  ],
};

interface NewsSentimentProps {
  market: string;
  sentimentData?: any;
}

const NewsSentiment = ({ market, sentimentData }: NewsSentimentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [marketNews, setMarketNews] = useState<any[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<any[]>([]);
  const [stockSentiments, setStockSentiments] = useState<any[]>([]);

  useEffect(() => {
    if (sentimentData) {
      processSentimentData(sentimentData);
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        // Use hardcoded stock data based on market if no sentimentData
        setStockSentiments(stockDataByMarket[market as keyof typeof stockDataByMarket] || stockDataByMarket.IND);
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [sentimentData, market]);

  const processSentimentData = (data: any) => {
    const overall = [
      { name: "Positive", value: data.overallSentiment.bullish, color: "#4ade80" },
      { name: "Neutral", value: data.overallSentiment.neutral, color: "#94a3b8" },
      { name: "Negative", value: data.overallSentiment.bearish, color: "#f87171" },
    ];
    setOverallSentiment(overall);

    const news = data.articles.map((article: any, index: number) => ({
      id: index + 1,
      title: article.title,
      source: article.source,
      time: timeAgo(article.publishedAt),
      sentiment: getDominantSentiment(article.sentiment),
      impact: getImpact(article.sentiment),
      url: article.url,
    }));
    setMarketNews(news);

    // Set stock sentiments based on market
    setStockSentiments(stockDataByMarket[market as keyof typeof stockDataByMarket] || stockDataByMarket.IND);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-5 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">News & Sentiment Analysis - {market} Market</h1>
          </div>

          {/* Market Moving News */}
          <div className="glass-morphism rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Market Moving News</h3>
              <Button variant="outline" size="sm" className="flex items-center">
                View All News
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div>Loading news...</div>
              ) : (
                marketNews.map((news) => (
                  <a
                    key={news.id}
                    href={news.url}
                    className="block glass-morphism hover:shadow-md transition-shadow rounded-xl overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentClass(news.sentiment)}`}>
                          {getSentimentText(news.sentiment)}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactClass(news.impact)}`}>
                          {news.impact.charAt(0).toUpperCase() + news.impact.slice(1)} Impact
                        </div>
                      </div>
                      <h4 className="font-semibold mb-2 line-clamp-2">{news.title}</h4>
                      <div className="flex items-center text-sm text-foreground/60 mt-4">
                        <div className="flex items-center space-x-4">
                          <div>{news.source}</div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {news.time}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-border/30 text-sm">
                        <button className="flex items-center text-green-600">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Bullish
                        </button>
                        <button className="flex items-center text-red-600">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Bearish
                        </button>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Overall Sentiment */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Overall Sentiment</h3>
              <div className="h-64">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overallSentiment}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {overallSentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Sentiment"]}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-3 mt-4">
                {overallSentiment.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Analysis by Stock */}
            <div className="lg:col-span-3 glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Sentiment Analysis by Stock</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-foreground/70">Stock</th>
                      <th className="text-center py-3 px-4 font-medium text-foreground/70">Sentiment Score</th>
                      <th className="text-center py-3 px-4 font-medium text-foreground/70">Change</th>
                      <th className="text-center py-3 px-4 font-medium text-foreground/70">News Sources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          Loading stock sentiments...
                        </td>
                      </tr>
                    ) : (
                      stockSentiments.map((stock) => (
                        <tr
                          key={stock.ticker}
                          className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${selectedStock === stock.ticker ? "bg-secondary/50" : ""
                            }`}
                          onClick={() =>
                            setSelectedStock(selectedStock === stock.ticker ? null : stock.ticker)
                          }
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="font-medium">{stock.ticker}</div>
                              <div className="text-foreground/60 ml-2 text-sm">{stock.name}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="w-full flex justify-center">
                              <div className="flex items-center justify-center w-14 h-14 relative">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={getSentimentColor(stock.sentiment)}
                                    strokeWidth="3"
                                    strokeDasharray={`${stock.sentiment}, 100`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-semibold">{stock.sentiment}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div
                              className={`flex items-center justify-center ${stock.trending === "up" ? "text-green-600" : "text-red-600"
                                }`}
                            >
                              {stock.trending === "up" ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              <span>{stock.change}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">{stock.articles}</td>
                        </tr>
                      ))
                    )}
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

export default NewsSentiment;
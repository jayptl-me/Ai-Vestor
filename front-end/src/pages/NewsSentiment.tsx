
import { useState, useEffect } from "react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import Navbar from "../components/Navbar";
import {
    Search, TrendingUp, TrendingDown, Clock, BarChart3,
    ChevronDown, ExternalLink, ThumbsUp, ThumbsDown, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";

// Sample sentiment data
const sentimentTrend = [
    { date: "Jan 1", positive: 45, neutral: 35, negative: 20 },
    { date: "Jan 8", positive: 42, neutral: 38, negative: 20 },
    { date: "Jan 15", positive: 38, neutral: 40, negative: 22 },
    { date: "Jan 22", positive: 35, neutral: 38, negative: 27 },
    { date: "Jan 29", positive: 30, neutral: 40, negative: 30 },
    { date: "Feb 5", positive: 38, neutral: 36, negative: 26 },
    { date: "Feb 12", positive: 45, neutral: 33, negative: 22 },
    { date: "Feb 19", positive: 50, neutral: 30, negative: 20 },
    { date: "Feb 26", positive: 55, neutral: 28, negative: 17 },
    { date: "Mar 5", positive: 52, neutral: 30, negative: 18 },
    { date: "Mar 12", positive: 48, neutral: 32, negative: 20 },
    { date: "Mar 19", positive: 58, neutral: 27, negative: 15 },
    { date: "Mar 26", positive: 62, neutral: 25, negative: 13 },
];

const stockSentiments = [
    {
        ticker: "AAPL",
        name: "Apple Inc.",
        sentiment: 78,
        change: "+12",
        trending: "up",
        articles: 386,
        social: 15420
    },
    {
        ticker: "MSFT",
        name: "Microsoft Corp.",
        sentiment: 82,
        change: "+6",
        trending: "up",
        articles: 248,
        social: 8630
    },
    {
        ticker: "GOOGL",
        name: "Alphabet Inc.",
        sentiment: 65,
        change: "-4",
        trending: "down",
        articles: 196,
        social: 7250
    },
    {
        ticker: "AMZN",
        name: "Amazon.com Inc.",
        sentiment: 70,
        change: "+8",
        trending: "up",
        articles: 312,
        social: 12840
    },
    {
        ticker: "TSLA",
        name: "Tesla Inc.",
        sentiment: 58,
        change: "-7",
        trending: "down",
        articles: 428,
        social: 25680
    },
];

const marketNews = [
    {
        id: 1,
        title: "Federal Reserve Signals Rate Cut Possible by September",
        source: "Financial Times",
        time: "2 hours ago",
        sentiment: "positive",
        impact: "high",
        url: "#"
    },
    {
        id: 2,
        title: "Tech Giants Face New Regulatory Challenges in Europe",
        source: "Reuters",
        time: "4 hours ago",
        sentiment: "negative",
        impact: "medium",
        url: "#"
    },
    {
        id: 3,
        title: "AI Sector Sees Record Investment in Q1 2023",
        source: "Bloomberg",
        time: "6 hours ago",
        sentiment: "positive",
        impact: "high",
        url: "#"
    },
    {
        id: 4,
        title: "Oil Prices Stabilize After Recent Volatility",
        source: "CNBC",
        time: "8 hours ago",
        sentiment: "neutral",
        impact: "low",
        url: "#"
    },
    {
        id: 5,
        title: "Chip Shortage Expected to Ease by Year End",
        source: "Wall Street Journal",
        time: "12 hours ago",
        sentiment: "positive",
        impact: "medium",
        url: "#"
    },
    {
        id: 6,
        title: "Inflation Data Shows Signs of Cooling in Major Economies",
        source: "The Economist",
        time: "1 day ago",
        sentiment: "positive",
        impact: "high",
        url: "#"
    },
];

const overallSentiment = [
    { name: "Positive", value: 55, color: "#4ade80" },
    { name: "Neutral", value: 30, color: "#94a3b8" },
    { name: "Negative", value: 15, color: "#f87171" },
];

const COLORS = ["#4ade80", "#94a3b8", "#f87171"];

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

const NewsSentiment = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [timeFrame, setTimeFrame] = useState("3M");

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">News & Sentiment Analysis</h1>
                        <p className="text-foreground/70">
                            Real-time analysis of financial news and social media sentiment to help identify market trends before they become obvious.
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="glass-morphism rounded-2xl p-4 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-5 w-5 text-foreground/50" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for stocks, sectors, or news..."
                                    className="w-full bg-white dark:bg-background border border-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    className="flex items-center whitespace-nowrap"
                                >
                                    Filter
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex items-center whitespace-nowrap"
                                >
                                    Sources
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex items-center whitespace-nowrap"
                                >
                                    Advanced
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        <div className="lg:col-span-3 glass-morphism rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Market Sentiment Trend</h3>
                                <div className="flex space-x-2">
                                    <button
                                        className={`px-3 py-1 text-sm rounded-md ${timeFrame === "1M" ? "bg-primary/10 text-primary" : "text-foreground/60"}`}
                                        onClick={() => setTimeFrame("1M")}
                                    >
                                        1M
                                    </button>
                                    <button
                                        className={`px-3 py-1 text-sm rounded-md ${timeFrame === "3M" ? "bg-primary/10 text-primary" : "text-foreground/60"}`}
                                        onClick={() => setTimeFrame("3M")}
                                    >
                                        3M
                                    </button>
                                    <button
                                        className={`px-3 py-1 text-sm rounded-md ${timeFrame === "6M" ? "bg-primary/10 text-primary" : "text-foreground/60"}`}
                                        onClick={() => setTimeFrame("6M")}
                                    >
                                        6M
                                    </button>
                                    <button
                                        className={`px-3 py-1 text-sm rounded-md ${timeFrame === "1Y" ? "bg-primary/10 text-primary" : "text-foreground/60"}`}
                                        onClick={() => setTimeFrame("1Y")}
                                    >
                                        1Y
                                    </button>
                                </div>
                            </div>
                            <div className="h-80">
                                {isLoading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={sentimentTrend}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(tick) => `${tick}%`}
                                            />
                                            <Tooltip
                                                formatter={(value: any) => [`${value}%`, '']}
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                    border: 'none'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="positive"
                                                stackId="1"
                                                stroke="#4ade80"
                                                fill="#4ade80"
                                                fillOpacity={0.8}
                                                name="Positive"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="neutral"
                                                stackId="1"
                                                stroke="#94a3b8"
                                                fill="#94a3b8"
                                                fillOpacity={0.8}
                                                name="Neutral"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="negative"
                                                stackId="1"
                                                stroke="#f87171"
                                                fill="#f87171"
                                                fillOpacity={0.8}
                                                name="Negative"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

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
                                                formatter={(value) => [`${value}%`, 'Sentiment']}
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
                    </div>

                    {/* Top Stocks Sentiment */}
                    <div className="glass-morphism rounded-2xl p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-6">
                            Sentiment Analysis by Stock
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-3 px-4 font-medium text-foreground/70">Stock</th>
                                        <th className="text-center py-3 px-4 font-medium text-foreground/70">Sentiment Score</th>
                                        <th className="text-center py-3 px-4 font-medium text-foreground/70">Change</th>
                                        <th className="text-center py-3 px-4 font-medium text-foreground/70">News Articles</th>
                                        <th className="text-center py-3 px-4 font-medium text-foreground/70">Social Mentions</th>
                                        <th className="text-right py-3 px-4 font-medium text-foreground/70">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockSentiments.map((stock) => (
                                        <tr
                                            key={stock.ticker}
                                            className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${selectedStock === stock.ticker ? 'bg-secondary/50' : ''
                                                }`}
                                            onClick={() => setSelectedStock(selectedStock === stock.ticker ? null : stock.ticker)}
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
                                                <div className={`flex items-center justify-center ${stock.trending === "up" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {stock.trending === "up" ? (
                                                        <TrendingUp className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 mr-1" />
                                                    )}
                                                    <span>{stock.change}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">{stock.articles}</td>
                                            <td className="py-4 px-4 text-center">{stock.social.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-primary">
                                                    Details
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Latest News */}
                    <div className="glass-morphism rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Market Moving News</h3>
                            <Button variant="outline" size="sm" className="flex items-center">
                                View All News
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {marketNews.map((news) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewsSentiment;

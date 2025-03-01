export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface SentimentAnalysis {
  bullish: number;
  bearish: number;
  neutral: number;
}

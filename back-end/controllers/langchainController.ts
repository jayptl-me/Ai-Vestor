import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  analyzeIndividualSentiments,
  analyzeOverallSentiment,
} from "../services/langchainService";
import { getMarketNews, getStockNews } from "../utils/newsapi";
import { getStockInfo } from "../utils/yfinance";

const langchainRoutes = new Hono();

const paramsValidator = z.object({
  country: z.string().min(1, "Country is required"),
});

langchainRoutes.get(
  "/overallsentiment/:country?",
  zValidator("param", paramsValidator),
  async (c) => {
    const country = c.req.param("country") || "us";

    try {
      const newsArticles = await getMarketNews(country);

      if (newsArticles.length === 0) {
        return c.json(
          {
            success: false,
            message: "No news articles found",
          },
          404
        );
      }

      // Get individual sentiment for each article
      const individualSentiments = await analyzeIndividualSentiments(
        newsArticles
      );

      // Get overall sentiment
      const overallSentiment = await analyzeOverallSentiment(newsArticles);

      // Combine news with their sentiment analysis
      const newsWithSentiment = newsArticles.map((article, index) => ({
        ...article,
        sentiment: individualSentiments[index],
      }));

      return c.json({
        success: true,
        country,
        overallSentiment,
        articles: newsWithSentiment,
      });
    } catch (error) {
      console.error("Error in market sentiment route:", error);
      return c.json(
        {
          success: false,
          message: "Failed to analyze market sentiment",
          error: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }
);

const stockParamsValidator = z.object({
  symbol: z.string().min(1, "Stock symbol is required"),
});

langchainRoutes.get(
  "stocksentiment/:symbol?",
  zValidator("param", stockParamsValidator),
  async (c) => {
    const symbol = c.req.param("symbol");

    try {
      // Get stock information
      const stockInfo = await getStockInfo(symbol!);

      if (!stockInfo) {
        return c.json(
          {
            success: false,
            message: `No stock information found for symbol: ${symbol}`,
          },
          404
        );
      }

      // Get stock-specific news
      const newsArticles = await getStockNews(symbol, stockInfo.name);

      if (newsArticles.length === 0) {
        return c.json(
          {
            success: false,
            message: `No news articles found for symbol: ${symbol}`,
          },
          404
        );
      }

      // Get overall sentiment from the news articles
      const overallSentiment = await analyzeOverallSentiment(newsArticles);

      // Get individual sentiment for each article
      const individualSentiments = await analyzeIndividualSentiments(
        newsArticles
      );

      // Combine news with their sentiment analysis
      const newsWithSentiment = newsArticles.map((article, index) => ({
        ...article,
        sentiment: individualSentiments[index],
      }));

      // Calculate sentiment score out of 100 (using bullish as positive indicator)
      const sentimentScore = overallSentiment.bullish;

      // Create simplified response format
      const simplifiedResponse = {
        ticker: stockInfo.symbol,
        name: stockInfo.name,
        sentimentScore: sentimentScore,
        percentageChange: stockInfo.changePercent.toFixed(2),
      };

      // Create detailed response with all data
      const detailedResponse = {
        success: true,
        stock: stockInfo,
        overallSentiment,
        articles: newsWithSentiment,
        simplified: simplifiedResponse,
      };

      // Check if simplified format is requested
      const format = c.req.query("format");
      if (format === "simple") {
        return c.json(simplifiedResponse);
      }

      return c.json(detailedResponse);
    } catch (error) {
      console.error("Error in stock sentiment route:", error);
      return c.json(
        {
          success: false,
          message: "Failed to analyze stock sentiment",
          error: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }
);

export default langchainRoutes;

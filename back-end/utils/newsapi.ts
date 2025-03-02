import type { NewsArticle } from "../models/news.model";

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

export async function getStockNews(
  symbol?: string,
  company?: string
): Promise<NewsArticle[]> {
  try {
    // Ensure at least one parameter is provided
    if (!symbol && !company) {
      throw new Error("Either symbol or company must be provided");
    }

    // Construct the query based on available parameters
    let query = "";
    if (symbol && company) {
      query = `${symbol} OR "${company}" stock`;
    } else if (symbol) {
      query = `${symbol} stock`;
    } else if (company) {
      query = `"${company}" stock`;
    }

    const url = new URL(`${BASE_URL}/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("lang", "en");
    url.searchParams.append("sortby", "publishedAt");
    url.searchParams.append("apikey", API_KEY as string);
    url.searchParams.append("max", "10"); // Adjust the number of articles as needed

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles) {
      return [];
    }

    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return [];
  }
}

export async function getMarketNews(country = "us"): Promise<NewsArticle[]> {
  try {
    // Adjust the query based on the country
    const query =
      country.toLowerCase() === "in"
        ? "Indian stock market OR BSE OR NSE"
        : "US stock market OR NYSE OR NASDAQ";

    const url = new URL(`${BASE_URL}/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("lang", "en");
    url.searchParams.append("sortby", "publishedAt");
    url.searchParams.append("apikey", API_KEY as string);
    url.searchParams.append("max", "10"); // Adjust the number of articles as needed

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles) {
      return [];
    }

    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching market news:", error);
    return [];
  }
}

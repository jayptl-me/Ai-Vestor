import { batchSentimentPrompt, singleSentimentPrompt } from "../utils/prompts";
import type { NewsArticle, SentimentAnalysis } from "../models/news.model";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxRetries: 2,
});

const singleSentimentChain = singleSentimentPrompt.pipe(llm);
const batchSentimentChain = batchSentimentPrompt.pipe(llm);

// Analyze sentiment for each article individually
export async function analyzeIndividualSentiments(
  newsArticles: NewsArticle[]
): Promise<SentimentAnalysis[]> {
  const sentimentPromises = newsArticles.map((article) =>
    singleSentimentChain
      .invoke({
        title: article.title,
        description: article.description,
        source: article.source,
      })
      .then((response) => {
        try {
          // Parse the JSON response
          const responseText = response.content.toString();
          return JSON.parse(responseText) as SentimentAnalysis;
        } catch (error) {
          console.error("Error parsing sentiment response:", error);
          // Return a neutral sentiment if parsing fails
          return { bullish: 33, bearish: 33, neutral: 34 };
        }
      })
  );

  return Promise.all(sentimentPromises);
}

// Analyze overall sentiment for all articles combined
export async function analyzeOverallSentiment(
  newsArticles: NewsArticle[]
): Promise<SentimentAnalysis> {
  try {
    const response = await batchSentimentChain.invoke({
      articles: newsArticles,
    });

    const responseText = response.content.toString();

    try {
      return JSON.parse(responseText) as SentimentAnalysis;
    } catch (error) {
      console.error("Error parsing batch sentiment response:", error);
      // Return a neutral sentiment if parsing fails
      return { bullish: 33, bearish: 33, neutral: 34 };
    }
  } catch (error) {
    console.error("Error in overall sentiment analysis:", error);
    return { bullish: 33, bearish: 33, neutral: 34 };
  }
}

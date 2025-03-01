import { PromptTemplate } from "@langchain/core/prompts";

export const batchSentimentPrompt = PromptTemplate.fromTemplate(
  "You are a financial analyst specializing in sentiment analysis.\n" +
    "Analyze the following batch of news articles about stocks or financial markets:\n" +
    "\n" +
    "{{#each articles}}\n" +
    "---\n" +
    "Title: {{this.title}}\n" +
    "Description: {{this.description}}\n" +
    "Source: {{this.source}}\n" +
    "---\n" +
    "{{/each}}\n" +
    "\n" +
    "Provide an OVERALL sentiment analysis as a JSON object with the following structure:\n" +
    "{{\n" +
    '  "bullish": [between 0 to 100],\n' +
    '  "bearish": [between 0 to 100],\n' +
    '  "neutral": [between 0 to 100]\n' +
    "}}\n" +
    "The total sum of the three values should be 100.\n" +
    "Your response should ONLY include the JSON object, nothing else. DO NOT format your response as code or use backticks. Don't make any spelling mistakes."
);

// Single article sentiment analysis prompt
export const singleSentimentPrompt = PromptTemplate.fromTemplate(
  "You are a financial analyst specializing in sentiment analysis.\n" +
    "Analyze the following news article about stocks or financial markets:\n" +
    "\n" +
    "Title: {title}\n" +
    "Description: {description}\n" +
    "Source: {source}\n" +
    "\n" +
    "Provide a sentiment analysis as a JSON object with the following structure:\n" +
    "{{\n" +
    '  "bullish": [between 0 to 100],\n' +
    '  "bearish": [between 0 to 100],\n' +
    '  "neutral": [between 0 to 100]\n' +
    "}}\n" +
    "The total sum of the three values should be 100.\n" +
    "Your response should ONLY include the JSON object, nothing else. DO NOT format your response as code or use backticks. Don't make any spelling mistakes."
);

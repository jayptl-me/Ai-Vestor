import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getMarketIndexes } from "../utils/helper";

const marketRoutes = new Hono();

const queryValidator = z.object({
  country: z.enum(["us", "in", "crypto"]).optional().default("us"),
  timeframe: z
    .enum(["1d", "1w", "1m", "3m", "6m", "1y", "ytd", "all"])
    .optional()
    .default("1m"),
  format: z.enum(["full", "simple"]).optional().default("full"),
});

marketRoutes.get("/indexes", zValidator("query", queryValidator), async (c) => {
  try {
    const { country, timeframe, format } = c.req.valid("query");

    const indexes = await getMarketIndexes(country, timeframe);

    if (indexes.length === 0) {
      return c.json(
        {
          success: false,
          message: "No market indexes found",
        },
        404
      );
    }

    // For simple format, return just the essential data
    if (format === "simple") {
      const simplifiedIndexes = indexes.map((index) => ({
        symbol: index.symbol,
        name: index.name,
        price: index.currentPrice,
        changePercent: index.changePercent
          ? Number(index.changePercent.toFixed(2))
          : null,
      }));

      return c.json({
        success: true,
        country,
        timeframe,
        indexes: simplifiedIndexes,
      });
    }

    // Return full data
    return c.json({
      success: true,
      country,
      timeframe,
      indexes,
    });
  } catch (error) {
    console.error("Error in market indexes route:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch market indexes",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Add route for getting a specific index
marketRoutes.get("/indexes/:symbol", async (c) => {
  try {
    const symbol = c.req.param("symbol");
    const timeframe = c.req.query("timeframe") || "1m";

    // Determine likely country based on symbol
    let country: "us" | "in" | "crypto" = "us";
    if (
      symbol.includes("^BSE") ||
      symbol.includes("^CNX") ||
      symbol.includes("^NSE")
    ) {
      country = "in";
    } else if (symbol.includes("-USD")) {
      country = "crypto";
    }

    // Override with query parameter if provided
    const countryParam = c.req.query("country");
    if (countryParam && ["us", "in", "crypto"].includes(countryParam)) {
      country = countryParam as "us" | "in" | "crypto";
    }

    // Get all indexes for the country
    const allIndexes = await getMarketIndexes(country, timeframe);

    // Find the specific index
    const index = allIndexes.find(
      (idx) =>
        idx.symbol.toLowerCase() === symbol.toLowerCase() ||
        idx.name.toLowerCase() === symbol.toLowerCase()
    );

    if (!index) {
      return c.json(
        {
          success: false,
          message: `Index not found: ${symbol}`,
        },
        404
      );
    }

    return c.json({
      success: true,
      index,
    });
  } catch (error) {
    console.error("Error in specific index route:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch index data",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default marketRoutes;

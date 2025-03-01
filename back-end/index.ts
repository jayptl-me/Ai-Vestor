// index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import courseRoutes from "./controllers/courseController";
import lessonRoutes from "./controllers/lessonController";
import { errorHandler } from "./utils/errorHandler";
import langchainRoutes from "./controllers/langchainController";
import progressRoutes from "./controllers/progressController";
import authRoutes from "./controllers/authController";
import marketRoutes from "./controllers/hotdataController";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());
app.use("*", errorHandler());

// Routes
app.route("/api/courses", courseRoutes);
app.route("/api/lessons", lessonRoutes);
app.route("/api/analysis", langchainRoutes);
app.route("/api/progress", progressRoutes)
app.route("/api/auth", authRoutes)
app.route("/api/hotdata", marketRoutes);

// Root route
app.get("/", (c) => {
  return c.json({ message: "API is running" });
});

// Start server
const PORT = process.env.PORT || 3001;
console.log(`Server is running on port ${PORT}`);

export default app;

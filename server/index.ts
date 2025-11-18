import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
// Assuming serveStatic and log are correctly defined in ./vite
import { setupVite, serveStatic, log } from "./vite"; 

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // NOTE: When deploying to Vercel, the internal 'server' is not needed
  // and 'app' is the only necessary object for the Serverless Function.

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // In a serverless environment, throwing an error here is usually fine
    // as the runtime handles the crash gracefully.
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // We pass 'app' and the internal 'server' for development hot-reloading
    await setupVite(app, server); 
  } else {
    // Production: Serve static assets (Vercel deployment)
    // We rely on serveStatic(app) and the routes from registerRoutes(app).
    serveStatic(app); 
  }

  // Vercel handles the port listening internally.
  // We remove the port listening logic entirely.
})();

// REQUIRED FOR VERCEL: Export the Express app instance
export default app;

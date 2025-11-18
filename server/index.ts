import express, { type Request, Response, NextFunction } from "express";
import { createServer as createNetServer } from "net";
import { registerRoutes } from "./routes";
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

async function findAvailablePort(startPort: number, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    const candidate = startPort + i;
    const isFree = await isPortAvailable(candidate);
    if (isFree) {
      return candidate;
    }
  }

  throw new Error(
    `Unable to find an available port starting at ${startPort}. Please set the PORT environment variable.`,
  );
}

function isPortAvailable(port: number) {
  return new Promise<boolean>((resolve, reject) => {
    const tester = createNetServer()
      .once("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE" || err.code === "EACCES") {
          resolve(false);
        } else {
          reject(err);
        }
      })
      .once("listening", () => {
        tester.close(() => resolve(true));
      })
      .listen(port, "0.0.0.0");
  });
}

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const preferredPort = parseInt(process.env.PORT || "5000", 10);
  const port =
    process.env.PORT !== undefined
      ? preferredPort
      : await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    log(
      `preferred port ${preferredPort} in use, falling back to ${port}`,
      "server",
    );
  }

  const listenOptions: Parameters<typeof server.listen>[0] = {
    port,
    host: "0.0.0.0",
    ...(process.platform !== "win32" ? { reusePort: true } : {}),
  };

  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();

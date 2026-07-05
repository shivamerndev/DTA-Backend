import connectDB from "./src/config/db.config.js";
import app from "./src/app.js";
import logger from "./src/utils/logger.js";

const port = process.env.PORT || 3000;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", { stack: err.stack || err });
  process.exit(1);
});

await connectDB()

const server = app.listen(port, () => logger.info(`✅ Server running on port ${port}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", { stack: err.stack || err });
  server.close(() => {
    process.exit(1);
  });
});
import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import { NODE_ENV } from "../config/env.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log level based on environment
const level = NODE_ENV === "development" ? "debug" : "info";

// Define log formats
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }), // Include stack trace if error object is logged
  winston.format.splat(), // For string interpolation support
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ""}`;
  })
);

// Create logger
const logger = winston.createLogger({
  level,
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// If in production, add file transports
if (NODE_ENV === "production") {
  // Define absolute logs directory path relative to project root (backend/logs)
  const logsDir = path.join(__dirname, "../../logs");
  
  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create a stream object for Morgan middleware integration
export const loggerStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
/**
 * Application Logger Utility
 * Provides structured, timestamped console logs
 */
const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, ...args) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`\x1b[33m[${getTimestamp()}] [WARN] ${message}\x1b[0m`, ...args);
  },
  error: (message, ...args) => {
    console.error(`\x1b[31m[${getTimestamp()}] [ERROR] ${message}\x1b[0m`, ...args);
  },
  success: (message, ...args) => {
    console.log(`\x1b[32m[${getTimestamp()}] [SUCCESS] ${message}\x1b[0m`, ...args);
  },
  database: (message, ...args) => {
    console.log(`\x1b[36m[${getTimestamp()}] [DATABASE] ${message}\x1b[0m`, ...args);
  },
};


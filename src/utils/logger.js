/**
 * Logger Utility
 * Configurable logging system for the application
 */

import config from './config';

const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getLogLevelValue = (level) => logLevels[level] || logLevels.info;
const currentLogLevel = getLogLevelValue(config.logging.level);

const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const logMessage = `${prefix} ${message}`;
  
  return data ? [logMessage, data] : [logMessage];
};

const logger = {
  debug: (message, data = null) => {
    if (currentLogLevel <= logLevels.debug && config.logging.logToConsole) {
      console.log(...formatLog('debug', message, data));
    }
  },

  info: (message, data = null) => {
    if (currentLogLevel <= logLevels.info && config.logging.logToConsole) {
      console.info(...formatLog('info', message, data));
    }
  },

  warn: (message, data = null) => {
    if (currentLogLevel <= logLevels.warn && config.logging.logToConsole) {
      console.warn(...formatLog('warn', message, data));
    }
  },

  error: (message, data = null) => {
    if (currentLogLevel <= logLevels.error && config.logging.logToConsole) {
      console.error(...formatLog('error', message, data));
    }
  },
};

export default logger;

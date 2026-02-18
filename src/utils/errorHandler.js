/**
 * Error Handler Utility
 * Centralized error handling and custom errors
 */

import logger from './logger';

export class AppError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message, fields = {}) {
    super(message, 400, { fields });
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

export class ServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

const handleError = (error, context = {}) => {
  let handledError = {
    message: 'An unexpected error occurred',
    statusCode: 500,
    details: {},
  };

  if (error instanceof AppError) {
    handledError = {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  } else if (error instanceof TypeError) {
    handledError = {
      message: 'Invalid input or operation',
      statusCode: 400,
      details: { originalMessage: error.message },
    };
  } else if (error.response) {
    // Axios or fetch error response
    handledError = {
      message: error.response.data?.message || error.message,
      statusCode: error.response.status,
      details: error.response.data,
    };
  } else if (error.message) {
    handledError = {
      message: error.message,
      statusCode: 500,
      details: {},
    };
  }

  logger.error('Error handled', {
    ...handledError,
    context,
    stack: error.stack,
  });

  return handledError;
};

const throwError = (message, statusCode = 500, details = {}) => {
  throw new AppError(message, statusCode, details);
};

export default {
  handleError,
  throwError,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServerError,
};

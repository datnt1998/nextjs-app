/**
 * Custom API Error class for handling application errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  code?: string;
  statusCode: number;
}

/**
 * Handle API errors and return consistent error responses
 */
export const handleAPIError = (error: unknown): ErrorResponse => {
  // Handle APIError instances
  if (error instanceof APIError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
    };
  }

  // Handle unknown errors
  return {
    error: "An unexpected error occurred",
    statusCode: 500,
  };
};

/**
 * Common API error factory functions
 */
export const ApiErrors = {
  badRequest: (message = "Bad request", code?: string) =>
    new APIError(400, message, code),

  unauthorized: (message = "Unauthorized", code?: string) =>
    new APIError(401, message, code),

  forbidden: (message = "Forbidden", code?: string) =>
    new APIError(403, message, code),

  notFound: (message = "Resource not found", code?: string) =>
    new APIError(404, message, code),

  conflict: (message = "Conflict", code?: string) =>
    new APIError(409, message, code),

  unprocessableEntity: (message = "Unprocessable entity", code?: string) =>
    new APIError(422, message, code),

  internalServer: (message = "Internal server error", code?: string) =>
    new APIError(500, message, code),
};

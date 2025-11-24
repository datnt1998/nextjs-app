"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { APIError } from "@/lib/api/errors";

/**
 * Parse error message from various error types
 */
function parseErrorMessage(error: unknown): string {
  // Handle APIError instances
  if (error && typeof error === "object" && "statusCode" in error) {
    const apiError = error as APIError;
    return apiError.message || "An error occurred";
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Handle Response errors from fetch
  if (error && typeof error === "object" && "status" in error) {
    const response = error as Response;
    return `Request failed with status ${response.status}`;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Default fallback
  return "An unexpected error occurred";
}

/**
 * Get error title based on error type
 */
function getErrorTitle(error: unknown): string {
  if (error && typeof error === "object" && "statusCode" in error) {
    const apiError = error as APIError;
    const statusCode = apiError.statusCode;

    if (statusCode >= 400 && statusCode < 500) {
      return "Request Error";
    }
    if (statusCode >= 500) {
      return "Server Error";
    }
  }

  return "Error";
}

/**
 * Handle mutation errors globally
 * Displays toast notifications for all mutation errors
 */
function handleMutationError(error: unknown) {
  console.error("Mutation error:", error);

  const errorMessage = parseErrorMessage(error);
  const errorTitle = getErrorTitle(error);

  toast.error(errorTitle, {
    description: errorMessage,
  });
}

/**
 * Handle query errors globally
 * Can be used in individual queries or as a default handler
 */
export function handleQueryError(error: unknown) {
  console.error("Query error:", error);

  const errorMessage = parseErrorMessage(error);
  const errorTitle = getErrorTitle(error);

  toast.error(errorTitle, {
    description: errorMessage,
  });
}

/**
 * TanStack Query Provider with configured error handling
 *
 * Default configuration:
 * - Queries: 1 retry, no refetch on window focus, 5 minute stale time
 * - Mutations: Global error handler with toast notifications
 * - Errors are logged to console and displayed as toast notifications
 */
export function TanStackProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors (client errors)
              if (error && typeof error === "object" && "statusCode" in error) {
                const apiError = error as APIError;
                if (apiError.statusCode >= 400 && apiError.statusCode < 500) {
                  return false;
                }
              }

              // Retry once for other errors
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Note: Individual queries can override this by providing their own onError
            // or by setting onError to undefined to suppress the global handler
          },
          mutations: {
            // Global error handler for all mutations
            onError: handleMutationError,
            // Individual mutations can override this by providing their own onError
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

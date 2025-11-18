# API Error Handling

This module provides a consistent error handling system for API routes and client-side error management.

## Features

- Custom `APIError` class for structured error responses
- Pre-defined error factory functions for common HTTP errors
- Global error handler for consistent error responses
- Integration with TanStack Query for automatic error notifications

## Usage

### In API Routes

```typescript
import { ApiErrors, handleAPIError } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Your logic here

    // Throw specific errors
    if (!user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    if (!hasPermission) {
      throw ApiErrors.forbidden("You don't have permission");
    }

    if (!item) {
      throw ApiErrors.notFound("Item not found");
    }

    // Validation errors
    if (!validation.success) {
      throw ApiErrors.badRequest(
        `Validation failed: ${validation.error.issues.map((e) => e.message).join(", ")}`
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    // Handle all errors consistently
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}
```

### Available Error Factories

```typescript
// 400 Bad Request
ApiErrors.badRequest("Invalid input");

// 401 Unauthorized
ApiErrors.unauthorized("Authentication required");

// 403 Forbidden
ApiErrors.forbidden("Access denied");

// 404 Not Found
ApiErrors.notFound("Resource not found");

// 409 Conflict
ApiErrors.conflict("Resource already exists");

// 422 Unprocessable Entity
ApiErrors.unprocessableEntity("Cannot process request");

// 500 Internal Server Error
ApiErrors.internalServer("Something went wrong");
```

### Custom Error Codes

You can optionally provide error codes for better error tracking:

```typescript
throw ApiErrors.badRequest("Invalid email format", "INVALID_EMAIL");
throw ApiErrors.unauthorized("Token expired", "TOKEN_EXPIRED");
```

### Client-Side Error Handling

TanStack Query is configured with global error handlers that automatically show toast notifications:

**For Mutations:**
All mutations automatically display error toast notifications. No additional configuration needed:

```typescript
export function useCreateItem() {
  return useMutation({
    mutationFn: createItem,
    // Errors are automatically caught and displayed as toast notifications
    // The global handler shows appropriate error titles based on status codes
  });
}
```

**For Queries:**
Queries can optionally use the `handleQueryError` helper for manual error handling:

```typescript
import { handleQueryError } from "@/app/providers/tanstack-provider";

export function useItems() {
  return useQuery({
    queryKey: itemsKeys.list(),
    queryFn: fetchItems,
    // Option 1: Let errors propagate to error boundaries (recommended)
    // Option 2: Handle manually with toast notification
    onError: handleQueryError,
  });
}
```

**Error Handling Features:**

- **Smart Retry Logic**: Queries automatically retry once, except for 4xx client errors
- **Error Parsing**: Handles APIError, Error, Response, and string error types
- **Contextual Titles**: Shows "Request Error" for 4xx, "Server Error" for 5xx
- **Console Logging**: All errors are logged to console for debugging
- **Toast Notifications**: User-friendly error messages displayed via toast

**Suppressing Global Error Handler:**

If you need to handle errors silently in specific cases:

```typescript
export function useItems() {
  return useQuery({
    queryKey: itemsKeys.list(),
    queryFn: fetchItems,
    onError: () => {
      // Custom silent handling or logging only
      console.log("Error occurred but not showing toast");
    },
  });
}
```

## Error Response Structure

All API errors follow this structure:

```typescript
{
  error: string;      // Human-readable error message
  code?: string;      // Optional error code for tracking
  statusCode: number; // HTTP status code
}
```

## Best Practices

1. **Use specific error types**: Choose the appropriate error factory for the situation
2. **Provide clear messages**: Error messages should be user-friendly and actionable
3. **Add error codes**: Use error codes for tracking and debugging specific error scenarios
4. **Log errors**: Always log errors on the server side for debugging
5. **Handle validation errors**: Convert Zod validation errors to readable messages
6. **Consistent error handling**: Always use the `handleAPIError` function in catch blocks

## Examples

### Validation Error

```typescript
const validation = schema.safeParse(data);
if (!validation.success) {
  throw ApiErrors.badRequest(
    `Validation failed: ${validation.error.issues.map((e) => e.message).join(", ")}`
  );
}
```

### Database Error

```typescript
const { data, error } = await supabase.from("items").select();
if (error) {
  console.error("Database error:", error);
  throw ApiErrors.internalServer("Failed to fetch items");
}
```

### Permission Error

```typescript
if (!hasPermission(user, "items:create")) {
  throw ApiErrors.forbidden("You don't have permission to create items");
}
```

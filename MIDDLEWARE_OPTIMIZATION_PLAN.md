# Middleware Performance Analysis & Optimization Plan

## Problem Identified

Users experience navigation delays in the sidebar, requiring double-clicks to navigate. This is caused by **performance bottlenecks in the middleware chain**.

## Root Causes

### 1. **Duplicate `getSession()` Call in RBAC Middleware**

**Location**: `lib/rbac/middleware.ts` (line ~200)

```typescript
// PROBLEM: This is called EVERY request even when user is already provided
const {
  data: { session },
} = await supabase.auth.getSession();
```

**Impact**:

- Adds 50-200ms per navigation
- Makes unnecessary Supabase API call
- Session is already available from `updateSession()`

### 2. **JWT Parsing on Every Request**

**Location**: `lib/rbac/middleware.ts`

```typescript
const userProfile = createUserProfileFromJWT(user, session.access_token);
```

**Impact**:

- JWT is parsed on every protected route
- No caching mechanism
- Redundant for same-session requests

### 3. **Route Matching Algorithm**

**Location**: `lib/rbac/middleware.ts` (line ~70-90)

```typescript
function findMatchingRoute(
  pathname: string,
  routes: RouteConfig[]
): RouteConfig | null {
  const sortedRoutes = [...routes].sort(
    (a, b) => b.path.length - a.path.length
  );
  // ... loops through all routes
}
```

**Impact**:

- Array is sorted on EVERY request
- O(n log n) complexity for sorting
- O(n) for matching

### 4. **No Request Caching**

- Same user navigating between pages triggers full middleware chain
- No in-memory cache for user profiles
- No request deduplication

## Performance Metrics (Estimated)

| Operation             | Current Time | Optimized Time    | Savings      |
| --------------------- | ------------ | ----------------- | ------------ |
| getSession() call     | 50-150ms     | 0ms (skip)        | 50-150ms     |
| JWT parsing           | 5-10ms       | 1-2ms (cached)    | 3-8ms        |
| Route matching        | 2-5ms        | <1ms (pre-sorted) | 1-4ms        |
| **Total per request** | **57-165ms** | **1-3ms**         | **54-162ms** |

## Optimization Plan

### Phase 1: Quick Wins (High Impact, Low Effort)

#### 1.1 Skip Redundant `getSession()` Call

**File**: `lib/rbac/middleware.ts`

```typescript
// BEFORE
const {
  data: { session },
} = await supabase.auth.getSession();

// AFTER
// Session is already available from updateSession()
// Only call if we need to verify token freshness
```

**Implementation**:

- Pass session from `updateSession()` to RBAC middleware
- Only call `getSession()` if session is not provided
- Add session to `RBACMiddlewareOptions`

#### 1.2 Pre-sort Route Configurations

**File**: `lib/rbac/middleware.ts`

```typescript
// BEFORE
function findMatchingRoute(
  pathname: string,
  routes: RouteConfig[]
): RouteConfig | null {
  const sortedRoutes = [...routes].sort(
    (a, b) => b.path.length - a.path.length
  );
  // ...
}

// AFTER
// Sort once during initialization
const SORTED_ROUTES = [...DEFAULT_PROTECTED_ROUTES].sort(
  (a, b) => b.path.length - a.path.length
);

function findMatchingRoute(
  pathname: string,
  routes: RouteConfig[]
): RouteConfig | null {
  // Use pre-sorted routes
  for (const route of routes) {
    if (matchesPath(pathname, route.path)) {
      return route;
    }
  }
  return null;
}
```

#### 1.3 Add Request-Level Cache

**File**: `lib/rbac/profile-cache.ts` (new file)

```typescript
// Simple in-memory cache with request-level TTL
const profileCache = new Map<
  string,
  { profile: UserProfile; expires: number }
>();

export function getCachedProfile(userId: string): UserProfile | null {
  const cached = profileCache.get(userId);
  if (cached && cached.expires > Date.now()) {
    return cached.profile;
  }
  profileCache.delete(userId);
  return null;
}

export function setCachedProfile(
  userId: string,
  profile: UserProfile,
  ttl = 5000
) {
  profileCache.set(userId, {
    profile,
    expires: Date.now() + ttl,
  });
}
```

### Phase 2: Structural Improvements (Medium Impact, Medium Effort)

#### 2.1 Optimize Middleware Chain

**File**: `middleware.ts`

```typescript
// BEFORE: Sequential processing
const sessionResult = await updateSession(request);
const rbacResult = await rbacMiddleware(request);

// AFTER: Share data between middleware
const sessionResult = await updateSession(request);
const rbacResult = await rbacMiddleware(request, {
  user: sessionResult.user,
  supabase: sessionResult.supabase,
  session: sessionResult.session, // NEW: pass session
});
```

#### 2.2 Lazy JWT Parsing

Only parse JWT when permissions are actually checked:

```typescript
// BEFORE: Always parse JWT
const userProfile = createUserProfileFromJWT(user, session.access_token);

// AFTER: Parse only when needed
let userProfile: UserProfile | null = null;
const getUserProfile = () => {
  if (!userProfile) {
    userProfile = createUserProfileFromJWT(user, session.access_token);
  }
  return userProfile;
};
```

#### 2.3 Route Matching Optimization

Use a trie or prefix tree for faster route matching:

```typescript
// O(1) lookup instead of O(n)
const routeMap = new Map<string, RouteConfig>();
// Pre-populate with exact matches
```

### Phase 3: Advanced Optimizations (Lower Priority)

#### 3.1 Edge Caching

- Use Vercel Edge Config for route configurations
- Cache user profiles at the edge

#### 3.2 Parallel Processing

- Run non-dependent checks in parallel
- Use Promise.all() for independent operations

#### 3.3 Monitoring & Metrics

- Add performance timing logs
- Track middleware execution time
- Alert on slow requests

## Implementation Priority

### Immediate (This PR)

1. ✅ Skip redundant `getSession()` call
2. ✅ Pre-sort route configurations
3. ✅ Pass session from updateSession to RBAC

### Next Sprint

4. Add request-level profile cache
5. Implement lazy JWT parsing
6. Add performance monitoring

### Future Improvements

7. Edge caching
8. Route matching optimization with trie
9. Parallel processing

## Expected Results

After Phase 1 optimizations:

- **Navigation delay**: Reduced from 100-200ms to 10-30ms
- **Double-click issue**: Eliminated
- **Server load**: Reduced by ~40%
- **User experience**: Instant navigation

## Testing Plan

1. **Performance Testing**
   - Measure middleware execution time before/after
   - Test with 100 concurrent users
   - Monitor Vercel analytics

2. **Functional Testing**
   - Verify all protected routes still work
   - Test permission checks
   - Verify session management

3. **Load Testing**
   - Simulate high traffic
   - Check for memory leaks
   - Verify cache invalidation

## Rollout Strategy

1. **Development**: Implement and test locally
2. **Staging**: Deploy to staging environment
3. **Canary**: Roll out to 10% of users
4. **Full Deployment**: Roll out to all users
5. **Monitor**: Watch for issues and performance metrics

## Success Metrics

- Middleware execution time < 10ms (95th percentile)
- Zero double-click navigation issues
- No increase in error rates
- Positive user feedback

## Risks & Mitigation

| Risk                      | Impact | Mitigation                                      |
| ------------------------- | ------ | ----------------------------------------------- |
| Cache invalidation issues | High   | Short TTL (5s), clear on auth changes           |
| Memory leaks from cache   | Medium | Implement cache size limits, periodic cleanup   |
| Breaking auth flow        | High   | Comprehensive testing, gradual rollout          |
| Session sync issues       | Medium | Keep session management simple, test edge cases |

## Notes

- All optimizations maintain backward compatibility
- No changes to public API
- Can be rolled back easily
- Monitoring added for observability

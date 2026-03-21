# Hostinger Build Configuration Guide

## Problem: "Application error: server-side exception has occurred"

This typically occurs when:
1. **Build-time backend unavailability**: Static generation tries to fetch from backend API and times out
2. **Missing environment variables**: Middleware or SDK can't resolve backend URL at runtime
3. **Incorrect backend URL**: Environment variable points to unreachable API

## Solution: Proper Hostinger Environment Setup

### Step 1: Set Environment Variables in Hostinger Dashboard

Before deploying/building on Hostinger, configure these in your hosting environment:

**Critical for Build Time:**
```
# MUST be set before build starts
MEDUSA_BACKEND_URL=https://your-backend-api.com
# OR use one of these alternatives:
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-api.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

**Critical for Runtime:**
```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_DEFAULT_REGION=in
```

**Verify DNS:**
- Ensure `your-backend-api.com` resolves via DNS
- Test: `ping your-backend-api.com` from your local machine
- If it fails, backend isn't publicly accessible

### Step 2: Verify Backend Accessibility

Before pushing a build to Hostinger:

```bash
# Test from your local machine
curl https://your-backend-api.com/health
curl -H "x-publishable-api-key: pk_..." https://your-backend-api.com/store/regions
```

Expected response: `200 OK` (not timeout, not 502/503)

### Step 3: After Deployment

Test the diagnostics endpoint:
```bash
curl https://vridhira.in/api/test-backend
```

Should return:
```json
{
  "MEDUSA_BACKEND_URL": "https://your-backend-api.com",
  "backendUrlSource": "MEDUSA_BACKEND_URL",  // NOT "fallback"
  "health": { "status": 200, "ok": true },
  "regions": { "status": 200, "ok": true }
}
```

## ISR (Incremental Static Regeneration)

After these changes, product/collection/category pages use ISR:
- First visitor after deploy → page generated on-demand ✓
- Revalidates every 60 seconds in background
- No more static generation timeout during build

## Build Log Interpretation

**Before Fix:**
- `● /[countryCode]/products/[handle]` = SSG (requires all params at build time)
- Build times out if backend unavailable

**After Fix:**
- `● /[countryCode]/products/[handle]` = ISR (generates on first request)
- Build completes even if backend temporarily unavailable

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Connect Timeout Error (attempted address: api.vridhira.in:443)` | Backend unreachable or timeout | Verify API is running, check DNS resolution |
| `Application error: server-side exception` | Missing env vars at runtime | Set MEDUSA_BACKEND_URL in Hostinger env vars |
| `backendUrlSource: "fallback"` in /api/test-backend | No env var found | MEDUSA_BACKEND_URL not set in Hostinger |
| Pages show empty (no products) | Publishable key missing | Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY |

## Important Notes

- Environment variables must be set **before** each build
- Changes to environment variables require a rebuild
- Test locally with same env vars: `MEDUSA_BACKEND_URL=https://... npm run build`
- ISR pages cache for 60 seconds (adjust via `revalidate` in page files if needed)

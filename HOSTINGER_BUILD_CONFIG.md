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
MEDUSA_BACKEND_URL=https://api.vridhira.in
```

**Critical for Runtime:**
```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_DEFAULT_REGION=in
NODE_ENV=production
```

**Backend is verified accessible:**
```bash
curl https://api.vridhira.in/health
# Response: OK ✓
```

### Step 2: Backend Already Verified ✓

Backend connectivity confirmed:
```bash
curl https://api.vridhira.in/health
# Response: OK ✓

curl -H "x-publishable-api-key: pk_live_xxxxx" https://api.vridhira.in/store/regions
# Response: List of configured regions
```

Backend is ready for builds.

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

## **For Your Next Hostinger Deploy:**

### **Step 1: In Hostinger Dashboard, Set These Env Vars:**

1. Go to **Hosting Settings** → **Environment Variables**
2. Add each variable (click "Add New Variable"):

| Key | Value | Purpose |
|-----|-------|---------|
| `MEDUSA_BACKEND_URL` | `https://api.vridhira.in` | Build-time API access ✅ |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | `pk_live_xxxxx` | Runtime API authentication ✅ |
| `NEXT_PUBLIC_DEFAULT_REGION` | `in` | Default region for storefront ✅ |
| `NODE_ENV` | `production` | Enable production optimizations ✅ |

### **Step 2: Trigger a New Build**

1. In Hostinger dashboard, go to **Build/Deploy** section
2. Click **"Trigger New Build"** or redeploy from GitHub
3. Build should now complete successfully (no timeouts)

### **Step 3: Test After Deploy**

```bash
# Test backend integration
curl https://vridhira.in/api/test-backend

# Expected response includes:
# {
#   "MEDUSA_BACKEND_URL": "https://api.vridhira.in",
#   "backendUrlSource": "MEDUSA_BACKEND_URL",
#   "health": { "status": 200, "ok": true },
#   "regions": { "status": 200, "ok": true }
# }
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
| `Application error: server-side exception has occurred` | Build failed, missing env vars | Set `MEDUSA_BACKEND_URL=https://api.vridhira.in` in Hostinger |
| `Connect Timeout Error (attempted address: api.vridhira.in:443)` | Build can't reach backend | Backend is up (✓ confirmed), but env var not set correctly |
| `/api/test-backend` shows `backendUrlSource: "fallback"` | No env var found at runtime | MEDUSA_BACKEND_URL not set in Hostinger environment |
| Pages show empty (no products) | Publishable key missing or incorrect | Set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` with correct live key |
| Build still times out | ISR not properly applied | Verify `dynamicParams = true` on routes (already applied) |

## Important Notes

- Environment variables must be set **before** each build
- Changes to environment variables require a rebuild
- Test locally with same env vars: `MEDUSA_BACKEND_URL=https://... npm run build`
- ISR pages cache for 60 seconds (adjust via `revalidate` in page files if needed)

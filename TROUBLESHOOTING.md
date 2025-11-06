# Troubleshooting Guide

## Issue 1: Pages Not Found (404 errors)

### Problem
When clicking navigation links to `shop.html`, `dashboard.html`, etc., you get a "page not found" error.

### Solution
You must run the project through **Vite's development server**, not a simple HTTP server.

#### Correct Way to Run:

```bash
npm run dev
```

This starts Vite on `http://localhost:5173` and properly handles multi-page routing.

#### What NOT to Do:
- ❌ `python3 -m http.server` - Won't work with ES modules
- ❌ Opening `file://index.html` in browser - No server, won't load modules
- ❌ VS Code Live Server extension - May have CORS/module issues
- ❌ Opening individual HTML files directly

### Why This Matters
The site uses ES modules (`import`/`export`), which require a proper web server. Vite provides this and handles routing correctly for all HTML files.

---

## Issue 2: Sign In Works, But Dashboard/Challenge Redirects Back to Sign In

### Problem
After signing in successfully:
1. Page shows success message
2. Redirects to dashboard
3. Dashboard immediately redirects back to auth page
4. Can't access challenge features

### Root Causes & Solutions

#### Cause 1: Supabase Not Initialized Yet
The authentication check runs before Supabase finishes loading.

**Fix**: This is now handled automatically with a 5-second wait. If still occurring:

1. **Clear browser cache/localStorage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Try signing in again**

3. **Check browser console for errors:**
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Look for any red error messages
   - Share these errors if issues persist

#### Cause 2: Supabase Session Not Persisting
Sessions might not be saving to browser storage.

**Fix**:
1. Make sure you're using `npm run dev` (not a file server)
2. Browser must allow localStorage (not in private/incognito mode)
3. Check that Supabase credentials in `.env` are correct

#### Cause 3: Challenge Data Not Created
User signed in but challenge participant record wasn't created.

**Fix**:
1. Go to Supabase dashboard
2. Navigate to Table Editor
3. Check `challenge_participants` table
4. If your email is missing, delete any account and recreate it
5. The system will automatically create the record

---

## Issue 3: Products Not Showing

### Problem
Shop page is blank or says "No products found"

#### Solution 1: Missing Shopify Credentials
Make sure `.env` file has Shopify settings:

```env
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here
```

**How to get them:**
1. Go to Shopify Admin
2. Apps and sales channels → Develop apps
3. Create or select your app
4. Configuration tab → Storefront API
5. Copy the access token and store domain

#### Solution 2: No Products in Shopify Store
1. Log into your Shopify store admin
2. Go to Products
3. Add at least one product
4. Make sure product is Published (not Draft)

#### Solution 3: API Permissions Issue
1. In Shopify, check your app has these permissions:
   - `unauthenticated_read_product_listings` ✓
   - `unauthenticated_read_checkouts` ✓
   - `unauthenticated_write_checkouts` ✓
2. If permissions changed, reinstall the app

#### Solution 4: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors about Shopify API
4. Report these errors for debugging

---

## Issue 4: Can't Add Products to Cart

### Problem
"Add to Cart" button doesn't work or gives errors

#### Solution
1. **Ensure Shopify products exist** (see Issue 3)
2. **Check console for errors** (F12 → Console)
3. **Clear cart data:**
   ```javascript
   localStorage.clear();
   ```
4. **Try again**

---

## Issue 5: Checkout Doesn't Redirect to Shopify

### Problem
Clicking "Proceed to Checkout" does nothing or stays on cart page

#### Solution

1. **Verify Shopify credentials in `.env`:**
   ```env
   VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=token
   ```

2. **Make sure you have items in cart**

3. **Check for JavaScript errors:**
   - F12 → Console → Look for red errors

4. **Try in a different browser** (rules out browser-specific issues)

---

## Issue 6: Workouts Not Showing on Dashboard

### Problem
Challenge dashboard shows calendar but no workout details

#### Solution

1. **Verify Supabase connection:**
   - Check `.env` has correct VITE_SUPABASE_URL and key
   - Test by signing in (should work if connection is good)

2. **Check workouts exist in database:**
   - Go to Supabase dashboard
   - Table Editor → `challenge_workouts`
   - Should see 30 rows (one for each day)
   - If empty, the migration didn't run properly

3. **Reload the page:** Sometimes initial load has timing issues

---

## Issue 7: Authentication Page Doesn't Work

### Problem
Sign in/sign up buttons don't respond or show errors

#### Solution

1. **Check Supabase Email Auth is enabled:**
   - Supabase Dashboard → Authentication → Providers
   - Email provider should be ON

2. **Verify credentials:**
   ```bash
   cat .env | grep SUPABASE
   ```
   Both URL and KEY should be present

3. **Try creating a test account:**
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Wait a few seconds before clicking Sign In

4. **Check browser console for errors** (F12)

---

## Debugging Steps (Use These First!)

Whenever something isn't working, follow this process:

### Step 1: Check Environment Variables
```bash
cat .env
```

Make sure you see all 4 variables:
- ✓ VITE_SUPABASE_URL
- ✓ VITE_SUPABASE_ANON_KEY
- ✓ VITE_SHOPIFY_DOMAIN (optional, can be empty for testing)
- ✓ VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN (optional)

### Step 2: Clear Cache & Restart
```bash
# Stop the dev server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite
# Clear browser cache (F12 → Application → Clear storage)
localStorage.clear()
# Restart
npm run dev
```

### Step 3: Check Browser Console
```
F12 (or right-click → Inspect → Console)
```

Look for:
- Red error messages (save these)
- "Supabase credentials not found"
- Network errors
- Module loading errors

### Step 4: Check Supabase Dashboard
1. Go to https://supabase.com
2. Log in to your project
3. Table Editor → check tables exist and have data
4. Authentication → check users are being created

### Step 5: Check Shopify Admin
1. Go to your Shopify store admin
2. Products → verify products exist and are published
3. Apps → verify Storefront API app is installed

---

## Common Error Messages

### "Supabase credentials not found"
- **Cause**: `.env` file missing or empty
- **Fix**: Copy from `.env.example` and fill in credentials

### "Cannot read property 'signIn' of null"
- **Cause**: Supabase not initialized
- **Fix**: Make sure using `npm run dev`, wait for page to fully load

### "Module not found: './supabase-client.js'"
- **Cause**: Not using proper web server
- **Fix**: Use `npm run dev`, don't open HTML files directly

### "Failed to fetch from Shopify API"
- **Cause**: Invalid Shopify credentials or API permissions
- **Fix**: Verify domain and token in `.env`, check API permissions

### "No rows returned"
- **Cause**: Database query found no data
- **Fix**: Check data exists in Supabase tables, verify user ID matches

---

## Still Not Working?

### Collect This Information:
1. **What's the exact error message?** (Screenshot or copy from console)
2. **Which page/action triggers it?**
3. **What's in your `.env` file?** (Don't share tokens, just show variables present)
4. **Check console** (F12 → Console → right-click → Save as)

### Quick Fixes to Try:
```bash
# Completely clean start
npm install
npm run build
npm run dev

# Then test in fresh browser tab
```

### Use Development Tools
- **Supabase**: https://supabase.com/dashboard - check tables and auth
- **Shopify**: https://admin.shopify.com - check products and apps
- **Browser DevTools**: F12 - check console for errors

---

## Performance Tips

If site is slow:

1. **Don't use private browsing** (localStorage is disabled)
2. **Clear browser cache** often during development
3. **Restart dev server** periodically
4. **Check your internet connection**
5. **Use latest browser version**

---

## Getting Help

When reporting issues, provide:
1. Error message or screenshot
2. What you were trying to do
3. Your `.env` file (without tokens)
4. Browser console errors
5. Steps to reproduce

The more details, the faster we can help!

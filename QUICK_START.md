# Quick Start Guide

Get Virtus Athletics running in 5 minutes.

## 1. Get Your Credentials

### Shopify
1. Go to your Shopify Admin
2. Apps and sales channels → Develop apps → Create an app
3. Enable Storefront API with these permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
4. Copy your **Storefront API access token**

### Supabase
1. Create project at supabase.com
2. Go to Settings → API
3. Copy **Project URL** and **anon public key**

## 2. Configure

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

## 3. Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What Works Now

✅ **Shop Page** - Shows YOUR Shopify products
✅ **Cart** - Add products, view cart, checkout
✅ **Challenge** - Sign up, track 30-day progress
✅ **Dashboard** - Personal challenge calendar
✅ **Authentication** - Sign in/sign up with email

## Key Features

### For Customers
- Browse your Shopify products
- Filter by category and price
- Add to cart and checkout via Shopify
- Join 30-day fitness challenge
- Track daily workout progress
- View progress charts

### For You
- Products auto-sync from Shopify
- Users managed in Supabase
- Challenge progress tracked automatically
- Secure authentication
- Shopping cart persists in browser

## Testing the Challenge

1. Click "Join the Challenge" on Community page
2. Sign up with email/password
3. Go to Dashboard
4. See 30-day calendar
5. Click today's workout
6. Mark as complete
7. View progress chart

## Testing E-Commerce

1. Go to Shop page
2. See your Shopify products
3. Click Add to Cart
4. Go to Cart page
5. Click Proceed to Checkout
6. Redirects to Shopify checkout

## Next Steps

1. Add your products to Shopify
2. Customize the workout programs in Supabase
3. Update colors/branding in CSS
4. Deploy to Netlify or Vercel

## Need Help?

See [SETUP.md](SETUP.md) for detailed instructions.

# Virtus Athletics

A premium athletic wear e-commerce website with an integrated 30-Day Challenge system. Built with Shopify for product management and Supabase for user authentication and challenge tracking.

## Features

### E-Commerce
- Full Shopify integration with Storefront API
- Real-time product syncing from your Shopify store
- Advanced product filtering and search
- Shopping cart with checkout
- Responsive design for all devices

### 30-Day Challenge
- User authentication with Supabase
- Personal challenge dashboard
- 30 days of progressive workouts
- Progress tracking and visualization
- Daily workout completion tracking
- Progress charts and analytics

### Design
- Dark theme with iron-bronze accents
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Professional athletic aesthetic

## Quick Start

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:5173
   ```

3. **Sign up** to join the 30-day challenge
4. **Go to Dashboard** to start tracking your workouts
5. **(Optional) Add Shopify credentials** to `.env` to enable shopping

**See [RUN_PROJECT.md](RUN_PROJECT.md) for detailed instructions!**

### Common Issues?
- Pages not loading? → Make sure you're using `npm run dev`
- Can't access dashboard? → Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Need setup help? → See [SETUP.md](SETUP.md)

## Pages

- **index.html** - Homepage with featured products and hero
- **shop.html** - Full product catalog with filters
- **community.html** - Challenge information and ambassador profiles
- **dashboard.html** - Personal challenge dashboard (requires login)
- **cart.html** - Shopping cart and checkout
- **auth.html** - User authentication (sign in/sign up)

## Technologies

- **Shopify Storefront API** - E-commerce and product management
- **Supabase** - Authentication and database
- **Vite** - Development server and build tool
- **Tailwind CSS** - Styling framework
- **Anime.js** - Smooth animations
- **ECharts** - Progress visualization

## Configuration

All configuration is done through environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_SHOPIFY_DOMAIN` - Your Shopify store domain
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Shopify Storefront API token

## Documentation

- **[RUN_PROJECT.md](RUN_PROJECT.md)** - How to run and test the site (START HERE!)
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix common issues
- **[SETUP.md](SETUP.md)** - Complete setup and configuration guide
- **[QUICK_START.md](QUICK_START.md)** - 5-minute quick reference
- [Design System](design.md) - Visual design guidelines
- [Interaction Design](interaction.md) - UX patterns and flows

## What's Fixed

✅ **Page Routing** - All pages now accessible (Shop, Community, Dashboard, etc.)
✅ **Authentication** - Session persists properly across page reloads
✅ **Challenge Access** - Dashboard loads correctly after sign in
✅ **Build Configuration** - Vite config handles multi-page routing

## How It Works

1. **You sign up** → Account created in Supabase
2. **You join challenge** → Participant record created
3. **Dashboard loads** → 30-day calendar displayed
4. **Complete workouts** → Progress tracked in database
5. **Add products** → Shopify products display in shop
6. **Add to cart** → Items stored in browser
7. **Checkout** → Redirects to Shopify checkout

## License

© 2025 Virtus Athletics. All rights reserved.

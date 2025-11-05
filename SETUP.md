# Virtus Athletics - Setup Guide

This guide will walk you through setting up the Virtus Athletics website with full Shopify integration and the 30-Day Challenge system.

## Prerequisites

1. A Shopify store (create one at https://www.shopify.com if you don't have one)
2. A Supabase account (sign up at https://supabase.com)
3. Node.js and npm installed (for running a local development server)

## Step 1: Shopify Setup

### 1.1 Create Your Shopify Store

1. Go to https://www.shopify.com and create a store
2. Add your products to the store with:
   - Product names
   - Descriptions
   - Images
   - Prices
   - Variants (sizes, colors, etc.)

### 1.2 Get Shopify Storefront API Credentials

1. In your Shopify Admin, go to **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Name your app (e.g., "Virtus Website Integration")
4. Go to **Configuration** → **Storefront API**
5. Check these permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
6. Save and click **Install app**
7. Copy your **Storefront API access token**

Your Shopify domain will be: `your-store-name.myshopify.com`

## Step 2: Supabase Setup

### 2.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click **New Project**
3. Choose your organization and enter:
   - Project name: `virtus-athletics`
   - Database password (save this securely)
   - Region (choose closest to your users)
4. Wait for project to be created

### 2.2 Database Setup

The database schema has already been created through the migration system. The following tables exist:

- `challenge_participants` - Users who joined the 30-day challenge
- `challenge_progress` - Daily progress for each participant
- `challenge_workouts` - 30 days of workout data

### 2.3 Enable Email Authentication

1. In your Supabase project, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Under **Email Templates**, customize if desired
4. **Important**: In **Auth Settings**, you can disable email confirmation for testing by unchecking "Enable email confirmations"

### 2.4 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   ```

## Step 4: Run the Website

### Option 1: Using Vite (Recommended)

1. Install Vite globally:
   ```bash
   npm install -g vite
   ```

2. Run the development server from the project directory:
   ```bash
   vite
   ```

3. Open your browser to `http://localhost:5173`

### Option 2: Using Python Simple Server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`

**Note:** ES modules require a proper web server. The Python server may have CORS issues.

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` and select "Open with Live Server"

## Step 5: Organize Your Shopify Products

### Product Collections (Recommended)

Create collections in Shopify for better organization:

1. In Shopify Admin, go to **Products** → **Collections**
2. Create these collections:
   - **Apparel** (shirts, shorts, hoodies, etc.)
   - **Equipment** (resistance bands, rings, parallettes, etc.)
   - **Accessories** (wrist wraps, chalk, bags, etc.)

### Product Tags

Add these tags to products for filtering:
- `featured` - Shows up on homepage
- Product type tags: `apparel`, `equipment`, `accessories`

## Step 6: Test the Integration

### Test Shopify Products

1. Go to the Shop page
2. Verify your products load from Shopify
3. Test filters and search
4. Add products to cart
5. Click "Proceed to Checkout" (redirects to Shopify checkout)

### Test Challenge System

1. Go to Community page
2. Click "Start Your Challenge"
3. Sign up with email/password
4. You'll be redirected to Dashboard
5. View your 30-day calendar
6. Click on today's workout
7. Mark it as complete

## Architecture Overview

### Files Structure

```
project/
├── index.html              # Homepage
├── shop.html               # Product catalog
├── community.html          # Challenge info and community
├── dashboard.html          # User's challenge dashboard
├── cart.html              # Shopping cart
├── auth.html              # Sign in/Sign up
├── main.js                # Main application logic
├── shopify.js             # Shopify integration
├── supabase-client.js     # Supabase/auth integration
├── .env                   # Environment variables (YOU CREATE THIS)
├── .env.example           # Environment template
└── resources/             # Images and assets
```

### How It Works

1. **Product Loading**: `shopify.js` fetches products from Shopify Storefront API
2. **Cart Management**: Stored in localStorage, synced to Shopify checkout
3. **Authentication**: Supabase Auth handles user accounts
4. **Challenge Data**: Stored in Supabase database with RLS security
5. **Real-time Updates**: Dashboard shows live progress

## Troubleshooting

### Products Not Loading

- Check your Shopify credentials in `.env`
- Verify Storefront API permissions are enabled
- Check browser console for errors
- Make sure your store has products published

### Authentication Issues

- Verify Supabase URL and anon key are correct
- Check that Email auth is enabled in Supabase
- Look for errors in browser console
- Confirm RLS policies are applied (they're created automatically)

### Cart Not Working

- Clear localStorage: `localStorage.clear()` in browser console
- Check Shopify checkout permissions
- Verify variant IDs are being passed correctly

### Module Import Errors

- Make sure you're using a proper web server (Vite, Live Server)
- Don't use `file://` protocol - use `http://localhost`
- Check that all script tags have `type="module"`

## Customization

### Changing Colors

Edit the CSS custom properties in any HTML file:

```css
:root {
    --matte-black: #0A0A0A;
    --slate-gray: #2D2D2D;
    --iron-bronze: #8B6914;
    --charcoal: #1A1A1A;
}
```

### Adding More Workout Days

Add rows to the `challenge_workouts` table in Supabase:

```sql
INSERT INTO challenge_workouts (day_number, title, description, exercises, difficulty)
VALUES (31, 'Bonus Day', 'Extra challenge', '[{"name":"Exercise","reps":"10"}]', 'advanced');
```

### Custom Collections

Modify `shopify.js` to fetch from specific collections:

```javascript
const products = await window.shopifyIntegration.getProductsByCollection('apparel');
```

## Production Deployment

### Netlify

1. Push code to GitHub
2. Connect to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

### Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Important: Environment Variables

Never commit `.env` to version control. Always use platform environment variable features.

## Support

For issues with:
- **Shopify**: Check Shopify documentation or support
- **Supabase**: Visit Supabase docs or Discord
- **Code issues**: Review browser console errors

## Next Steps

1. Add your own products to Shopify
2. Customize workout programs
3. Add more pages (about, blog, etc.)
4. Implement email notifications
5. Add social sharing features
6. Create ambassador program
7. Analytics integration

Congratulations! Your Virtus Athletics website is now fully functional with Shopify e-commerce and the 30-Day Challenge system.

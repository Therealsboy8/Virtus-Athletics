# How to Run Virtus Athletics

## Prerequisites

1. **Node.js and npm installed**
   - Download from https://nodejs.org (LTS version recommended)
   - Verify: `node --version` and `npm --version`

2. **Supabase credentials** in `.env`
   - Already configured in your project

3. **Shopify credentials** (optional, for product display)
   - Can test without Shopify first

---

## Step 1: Start the Development Server

From the project directory, run:

```bash
npm run dev
```

You should see:
```
  VITE v5.4.21  ready in 100 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Step 2: Open in Browser

Click the link or type in browser address bar:

```
http://localhost:5173
```

You should see the **Virtus Athletics homepage** with the hero section.

---

## Step 3: Navigate Pages

Click these links in the navigation bar:

| Page | URL | Works? |
|------|-----|--------|
| Home | `http://localhost:5173/` | ✓ |
| Shop | `http://localhost:5173/shop.html` | ✓ |
| Community | `http://localhost:5173/community.html` | ✓ |
| Cart | `http://localhost:5173/cart.html` | ✓ |
| Auth | `http://localhost:5173/auth.html` | ✓ |
| Dashboard | `http://localhost:5173/dashboard.html` | ✓ (after login) |

**All links in the navigation should work now!**

---

## Step 4: Test Authentication

### Create Account:
1. Click **"Sign In"** link (top right, if not logged in)
2. Click **"Don't have an account? Sign Up"**
3. Enter email: `test@example.com`
4. Enter password: `TestPassword123!`
5. Click **"Create Account"**
6. Wait a moment, then you'll be redirected

### Sign In:
1. Back on **Auth page**
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be redirected to **Community page**

---

## Step 5: Join Challenge

### From Community Page:
1. Look for **"Start Your Challenge"** button
2. Click it
3. You'll be redirected to **Dashboard**

### On Dashboard:
- ✓ See your 30-day calendar
- ✓ See today's workout
- ✓ Mark workout as complete
- ✓ View progress charts
- ✓ Watch calendar update

---

## Step 6: Test Shopping (Optional)

### Add Shopify Credentials First:

1. Go to your Shopify store admin
2. Create or enable Storefront API app
3. Copy these to your `.env` file:
   ```env
   VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
   ```
4. Reload browser (Ctrl+R or Cmd+R)

### Shop for Products:
1. Go to **Shop page**
2. See your Shopify products
3. Click **"Add to Cart"**
4. Go to **Cart page**
5. See items in cart
6. Click **"Proceed to Checkout"**
7. Redirects to Shopify checkout

---

## Stop the Server

To stop the dev server:

```bash
Ctrl + C  (or Cmd + C on Mac)
```

---

## Running Again Later

Every time you want to run the project:

```bash
npm run dev
```

Then open `http://localhost:5173`

---

## What to Test

Use this checklist to verify everything works:

### Navigation
- [ ] Home page loads
- [ ] Shop page accessible via link
- [ ] Community page accessible via link
- [ ] Cart page accessible via link
- [ ] Dashboard page accessible via link (after login)

### Authentication
- [ ] Can sign up with email/password
- [ ] Can sign in with credentials
- [ ] Stays logged in after page reload
- [ ] Can sign out

### Challenge
- [ ] Can join challenge from community page
- [ ] Dashboard loads with 30-day calendar
- [ ] Can see today's workout
- [ ] Can mark workout complete
- [ ] Progress chart updates

### E-Commerce (if Shopify set up)
- [ ] Shop page shows products
- [ ] Can add products to cart
- [ ] Cart count updates
- [ ] Can proceed to Shopify checkout

---

## Troubleshooting

### "Cannot GET /shop.html"
- **Problem**: Not using `npm run dev`
- **Solution**: Kill any running server, run `npm run dev` again

### Sign in loops back to auth page
- **Problem**: Authentication not initialized
- **Solution**: Wait 2-3 seconds before clicking buttons, check console for errors

### Supabase connection errors
- **Problem**: Wrong `.env` credentials
- **Solution**: Copy exact values from Supabase dashboard to `.env`

### Products not showing
- **Problem**: No Shopify credentials or no products in store
- **Solution**: Add products to Shopify store and set `.env` variables

**See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help!**

---

## Project Structure

```
project/
├── index.html              # Homepage
├── shop.html               # Product catalog
├── community.html          # Challenge info
├── dashboard.html          # Challenge dashboard
├── cart.html              # Shopping cart
├── auth.html              # Sign in/up
├── main.js                # Core logic
├── shopify.js             # Shopify integration
├── supabase-client.js     # Auth & database
├── .env                   # Your config (don't share!)
├── package.json           # Project info
└── vite.config.js         # Vite config
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm install` | Install dependencies |

---

## Next Steps

1. ✓ Run the project (`npm run dev`)
2. ✓ Test all pages work
3. ✓ Sign up and join challenge
4. ✓ Add Shopify products (optional)
5. ✓ Deploy to production when ready

See **[SETUP.md](SETUP.md)** for deployment instructions.

**Happy developing! 🚀**

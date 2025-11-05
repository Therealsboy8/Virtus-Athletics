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

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Shopify and Supabase credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

For detailed setup instructions, see [SETUP.md](SETUP.md)

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

- [Setup Guide](SETUP.md) - Complete setup instructions
- [Design System](design.md) - Visual design guidelines
- [Interaction Design](interaction.md) - UX patterns and flows

## License

© 2025 Virtus Athletics. All rights reserved.

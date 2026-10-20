# ArtisanShop recovered website

This repository contains the recovered German-language ArtisanShop storefront pages and their local assets.

## Local preview

Serve the repository root with a static HTTP server, then open `/` in a browser. For example:

```bash
python3 -m http.server 4175
```

The recovered storefront includes routes, images, and theme assets. It depends on the original ArtisanShop/Shopware backend for cart mutations, checkout, search suggestions, account actions, and other POST/API endpoints. A static server (including GitHub Pages) cannot process those requests; a compatible backend or API integration is required for those features.

# ArtisanShop frontend reconstruction

A responsive German-language storefront demo inspired by the 2025 spare-parts shop brief. It includes a modernized ecommerce layout, product listing, search/filter, category shortcuts, product detail dialogs, persisted demo cart/favorites, newsletter feedback, and repair-guide cards.

## Design update
- Modern header with sticky desktop behavior, prominent search, accessible dropdown navigation, and compact mobile scrolling navigation.
- Responsive hero, category tiles, product cards, brand filters, repair guides, footer, and dialogs.
- Mobile breakpoints are included for tablet, phone, and narrow phone widths so product cards, cart controls, and modal content avoid horizontal overflow.
- The styling keeps the spare-parts storefront identity but uses cleaner spacing, stronger cards, better focus states, and a calmer color system.

## Image reliability and best practices
- Product, category, hero, and guide visuals are rendered using HTML `<img>` elements, not CSS background illustrations.
- Product photos use remote raster image URLs where available.
- Every image tagged `data-fallback` switches to `assets/images/product-placeholder.png` after a load failure. The fallback is a local raster PNG, so cards do not become empty when an external host is unavailable.
- Images have meaningful alt text, product-card images use lazy loading, and the fallback handler prevents infinite error loops.
- External image sources are third-party references and may change or block hotlinking. Replace them with licensed, locally hosted product images before production.

## Run locally
Open `index.html` in a browser, or serve the folder with any static web server. No build step or dependencies are required.

Optional static server:

```bash
python3 -m http.server 4175
```

Then open `http://127.0.0.1:4175/index.html`.

## Checks
- `node --check js/app.js`
- `node --check js/catalog.js`

## Scope
This is a demonstration reconstruction, not recovered original 2025 source code. Product data, stock labels, and cart/checkout behavior are demo-only; checkout and backend inventory are not connected.

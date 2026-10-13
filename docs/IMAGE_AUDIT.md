# Image handling audit

- All visible photography is placed in semantic HTML `<img>` elements; CSS is used only for layout, spacing, borders, and sizing.
- Local fallback: `assets/images/product-placeholder.png` (raster PNG).
- Image failure handling: `js/app.js` listens for `error` and switches to the local fallback once per image.
- Product listing images are populated from the demo catalogue; a missing or blocked remote image should show the local fallback rather than an empty frame.
- Before production, replace third-party image URLs with owned/licensed product assets and serve them from a stable CDN or local asset path.

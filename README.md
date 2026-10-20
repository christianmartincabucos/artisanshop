# ArtisanShop recovered website

This is a static recovery of the German-language ArtisanShop site. It contains saved product, category, help, guide, and service pages plus captured media and theme assets.

## Local preview

Run a static file server from this directory, then open `http://localhost:8081/`:

```bash
python3 -m http.server 8081
```

The static archive can render captured pages and the local product catalog. The original Shopware application and database are not included, so account, live search, cart updates, checkout, appliance lookup, reviews, and other backend actions cannot be completed here.

## Recovery notes

- `sitemap.xml` lists the captured public HTML routes.
- `404.html` gives a useful recovery-specific not-found page on hosts that support static 404 files.
- `WEBSITE_QA_REPORT.md` and `WEBSITE_ROUTE_STATUS.csv` document the route, link, and resource checks.

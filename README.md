# ArtisanShop recovered website

This is a static recovery of the German-language ArtisanShop site. It contains saved product, category, help, guide, and service pages plus captured media and theme assets.

## Base URL configuration

Internal links and captured resources use local paths. The early-loading `/site-base.js` resolves them against the current browser origin by default, so a domain change requires no file-by-file edits. To force a deployment origin, set `configuredBaseUrl` near the top of `site-base.js` to the site root, for example `https://example.com/`; local development can use `http://localhost:8081/`. Leave it empty to follow the active host. Do not set it to the former ArtisanShop domain.

## Local preview

Run a static file server from this directory, then open `http://localhost:8081/`:

```bash
python3 -m http.server 8081
```

The static archive can render captured pages and the local product catalog. The original Shopware application and database are not included, so account, live search, cart updates, checkout, appliance lookup, reviews, and other backend actions cannot be completed here.

## Recovery notes

- Sitemap publication is disabled until a verified production domain is configured.
- `404.html` gives a useful recovery-specific not-found page on hosts that support static 404 files.
- `WEBSITE_QA_REPORT.md` and `WEBSITE_ROUTE_STATUS.csv` document the route, link, and resource checks.
- `tools/recover_wayback_resources.py` can recover exact-path files from Internet Archive captures made before `2025-08-25 13:25:36`. Requests are restricted to `web.archive.org`; it never fetches from the live ArtisanShop domain. Captures are selected using the cached CDX indexes under `/tmp/artisanshop-wayback-cdx/`. Run it from the project with `python3 tools/recover_wayback_resources.py`; review `WAYBACK_RECOVERY_INVENTORY.csv` for capture dates and outcomes.
- The current recovery inventory contains 27 archived HTML pages and 244 image variants. It does not imply that all links on those pages are available; remaining missing targets are listed in the QA CSV inventories.
- `site-navigation.js` and `site-navigation.css` provide local desktop and mobile navigation controls because the original Shopware storefront JavaScript is absent. The desktop Navigation control opens the recovered category menu; the mobile menu opens an accessible drawer with the saved category links.

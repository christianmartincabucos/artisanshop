# Website-wide QA and repair report

Audit date: 2026-10-20. Target: local static recovery at `http://localhost:8081/`.

## Test coverage and results

- Directly requested all **2,084 saved HTML routes** from `WEBSITE_ROUTE_STATUS.csv`; all returned HTTP 200 with non-empty HTML responses. The country-state JSON endpoint returned valid JSON and HTTP 200. A representative search query URL also returned HTTP 200.
- The route inventory contains **35,954 entries**: 1,909 `FIXED`, 30 `PASS`, 147 `BLOCKED_CONTENT`, and 33,868 `FAIL`. The FAIL entries are distinct unresolved local link targets; each returned HTTP 404 when requested. They represent 57,733 page-link references from recovered pages. The complete list and referring pages are in `WEBSITE_UNRESOLVED_ROUTES.csv`.
- Added 128 indexes for directories that previously exposed directory listings. These made 642 previously unresolved references reachable as explicit content/listing pages. Missing product/article content is identified as unavailable, not invented.
- Checked the 1,221 distinct backend endpoint paths with safe GET requests: 1,219 returned HTTP 404 and two returned static HTML. A product-page “In den Warenkorb” click POSTed to `/checkout/line-item/add` and reproduced HTTP 501 `Unsupported method ('POST')`.
- In the in-app browser, inspected the homepage, account fallback, search results, product catalog and a product detail page. Global search displayed its backend dependency notice. Catalog filtering for “bosch” returned 265 products; a no-match query displayed the new empty-results message. A product link opened its detail page. Back and forward navigation were exercised on the catalog. The home logo now resolves to `/`.
- Inspected the homepage at the available desktop viewport. Mobile/tablet viewport controls and browser console/network diagnostics were unavailable in the attached browser interface, so those checks remain unverified.
- All **59 JavaScript files** passed `node --check`. The country-state JSON parsed successfully. Sampled CSS, JS, logo and fallback-image assets returned successfully. No build/test configuration or package manifest exists, so no production build or existing test suite could be run.

## Repairs made

- Corrected 3,817 header logo links and 2,869 breadcrumb “Home” links that incorrectly led to `/kueche/`; those now point to `/`.
- Added the empty-results message and live result count behavior to `/produkte/`.
- Added 128 indexes to prevent directory listings, plus honest missing-content notices for unavailable product/article paths.
- Removed self-links masquerading as official company-page links from fallback pages.
- Removed the leftover JSON payload saved as `country/country-state-data/index.html`; the data endpoint is the correctly typed `country/country-state-data.json`.
- Kept page references root-relative. The casino-linked `.ch` host is not used as a production link, and `robots.txt` does not advertise a sitemap until a safe public base URL is configured.

## Files and change groups

- Shared page HTML: corrected header and breadcrumb destinations across the recovered pages.
- `produkte/index.html`: catalog search empty-state message and dynamic result count.
- 128 new directory `index.html` files: section listings or explicit unavailable-content notices.
- `unternehmen/*/index.html`: removed unverified self-links from company fallbacks.
- `country/country-state-data/index.html`: removed malformed JSON-as-HTML; `country/country-state-data.json` is the endpoint.
- `WEBSITE_ROUTE_STATUS.csv`, `WEBSITE_UNRESOLVED_ROUTES.csv`, `WEBSITE_BACKEND_DEPENDENCIES.csv`, `WEBSITE_QA_REPORT.md`, and `README.md`: refreshed route, backend, and audit records.

## Remaining problems

- The recovered project is a static export and has no Shopware server, database, authentication, or payment integration. Cart, checkout, account actions, live search, appliance lookup and other backend operations remain blocked. The POST endpoint still responds with 501 on the current Python static server; implementing a real purchase flow needs the original backend or a deliberate replacement with verified product, inventory, shipping, tax and payment rules.
- **33,868 local page destinations remain missing** (57,733 references). These point mostly to product and editorial pages whose source files were not recovered. The exact list and referring pages are in `WEBSITE_UNRESOLVED_ROUTES.csv`.
- **70,850 asset references across 45,180 distinct URLs** remain unresolved. Missing product media is substantial; fallback imagery cannot restore the originals. See `WEBSITE_MISSING_ASSETS.csv`.
- **146 HTML fallback pages** respond but lack original content/backend data; one is the Impressum placeholder, which is not legally valid. `BLOCKED_CONTENT` entries in the route inventory identify these limits.
- Responsive behavior, browser console/network logs, and a production build remain unverified for the reasons above.

## Status definitions

`FIXED` means a navigation defect was corrected and the route returned HTTP 200. `PASS` means the recovered static page or endpoint was present and served. `BLOCKED_CONTENT` means a fallback responds but the original content/service is unavailable. `FAIL` means a referenced local page target returned HTTP 404.

## Configurable base URL update (2026-10-21)

- Added `site-base.js` and loaded it synchronously at the start of the `<head>` on all 2,085 saved HTML documents. Its `configuredBaseUrl` is the single override; leave it empty to use `window.location.origin`, or set a root URL such as `https://example.com/` or `http://localhost:8081/`. It rejects non-HTTP(S) overrides and falls back to the active origin.
- Replaced 3,134 captured first-party absolute URL references across 1,153 pages with local paths. These included thumbnail/media URLs and captured API/widget URLs; query strings and fragments were retained. The Sentry trace target now uses the configured base URL.
- Fixed 9,229 malformed protocol-relative local URLs (for example `//media/...`) to root-relative paths. Third-party `widget.trustpilot.com` and other external service URLs were preserved.
- Scanned text files for URL-shaped ArtisanShop domains: none remain. Plain `artisanshop.ch` brand text remains in archived page titles/descriptions and metadata; it is not used as a URL or navigation target.
- Ran the local HTTP route check against all 2,086 saved `.html` routes: all returned HTTP 200. `site-base.js` returned HTTP 200 and passed `node --check`. A VM-level origin check confirmed defaults for `localhost:8081` and `preview.example.vercel.app`, and an explicit `https://example.com/` override.
- A resource-path inventory found 14,351 unique local `src`/stylesheet/font targets; 11,698 paths do not exist in this recovered export, consistent with the missing media captured in the existing asset inventory. Browser console/network diagnostics were not available through the attached browser controls. A real custom production domain cannot be tested until deployed; the local origin and explicit override were checked in the resolver simulation.

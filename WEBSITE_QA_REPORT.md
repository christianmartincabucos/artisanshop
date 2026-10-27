# Website-wide recovery and QA report

Audit date: 2026-10-21. Target: local static site at `http://localhost:8081/`. Historical recovery source: Internet Archive captures before `2025-08-25 13:25:36` only. No page or asset was fetched from the current live ArtisanShop domain.

## Recovery completed

- Added `tools/recover_wayback_resources.py`, which searches exact paths in cached 2024/2025 Wayback CDX indexes, accepts only archive-host requests and redirects, validates response type/signatures, and records outcomes in `WAYBACK_RECOVERY_INVENTORY.csv`.
- Recovered **27 HTML pages** and **244 image variants** (243 WebP, 1 JPEG). The page captures are dated 2025-01/04 and the images are generally dated 2025-06; the exact timestamps and local destinations are in the recovery inventory. Captured HTML has first-party absolute URLs normalized to local paths and loads `/site-base.js`.
- All **271 recovered files** returned HTTP 200 from the local server. The 27 archived pages use `text/html`; the image files use `image/webp` or `image/jpeg`.
- Audited local resource references from the 27 recovered pages, including `src`, `srcset`, stylesheet/preload/icon links, and CSS `url(...)`: 1,238 references were checked and 91 distinct paths were still absent. These include unavailable images and one font. Exact-path archive lookup found no further recoverable files for the supplemental paths.

## Local validation

- All **326 `.html` files present on disk** returned HTTP 200 from `http://localhost:8081/`. This count is the actual local file set, not all route-inventory destinations.
- All 3 local CSS files and all 60 JavaScript files were previously checked for successful local serving. All 60 JavaScript files pass `node --check`; `tools/recover_wayback_resources.py` passes Python compilation.
- All 271 Wayback inventory entries were individually checked over HTTP after recovery; none failed.
- The route status inventory has **35,954 entries**: 1,909 `FIXED`, 255 `PASS`, 147 `BLOCKED_CONTENT`, and 33,643 `FAIL`. A filesystem check confirmed none of the remaining `FAIL` routes now exists locally. The unresolved list represents **57,166 references**.
- `WEBSITE_MISSING_ASSETS.csv` currently lists **44,988 distinct missing asset paths** with **70,582 references**. This includes 28 missing font paths (613 references). Missing original media was not replaced with unrelated files.
- Browser console/network diagnostics, responsive viewport checks, and a deployed custom-domain test were not completed in this pass.

## Domain and base URL

- `site-base.js` is the centralized base URL resolver. It defaults to the current browser origin (`window.location.origin`) and accepts a single optional `configuredBaseUrl` override. For example, the same root-relative `/produkte/` path resolves under `https://example.com/produkte/`, `https://example.vercel.app/produkte/`, or `http://localhost:8081/produkte/` as appropriate.
- No active website page, stylesheet, or asset points to the problematic ArtisanShop domain. The only URL-shaped matches in the source scan are intentional historical-host patterns in `tools/recover_wayback_resources.py`; they are used to normalize archived first-party links. The program’s network allow-list permits requests only to `web.archive.org`.
- Plain ArtisanShop brand strings may remain in recovered page copy and metadata; they are not internal URL destinations.

## Repairs and inventories

- Restored the 27 matching archive pages and 244 image variants without overwriting existing local files.
- Fixed the nonresponsive header navigation controls. The recovered HTML referenced Shopware storefront bundles that are missing from this export. Added a local controller and stylesheet to all 2,112 saved HTML documents, so the desktop Navigation control opens/closes the saved rich menu and mobile menu buttons open a keyboard-accessible drawer with the captured category links. Desktop toggle and category-link navigation were checked in the local browser.
- Updated route and asset inventories so recovered paths are no longer represented as unresolved where those records existed. Added supplemental missing image references discovered from the restored pages.
- Retained the earlier website fixes: local root-relative navigation, directory-index and not-found handling, and the dynamic product catalog empty state.
- `README.md` documents the base URL behavior and the archive-only recovery utility.

## Remaining limitations

- **33,643 local page destinations remain unresolved** (57,166 references), mostly missing product and editorial pages. They returned 404 when tested in the earlier full-route audit; no matching content was available in the searched archive captures.
- **44,988 asset paths remain missing** (70,582 references), including product media and 28 font files. The recovered pages themselves still contain 91 distinct absent asset paths; exact-path archive lookup had no additional matches for those paths.
- The project is a static export without the Shopware server, database, authentication, inventory, or payment integrations. Cart submission to `/checkout/line-item/add` still receives HTTP 501 from the static Python server. A functional cart/checkout requires the original backend or a separately designed replacement with verified business rules.
- `BLOCKED_CONTENT` routes respond with fallback content but do not reproduce unavailable source data or services. The static Impressum placeholder is not a verified legal notice.
- Production hosting behavior, browser console/network diagnostics, and responsive layouts remain unverified.

## Status definitions

`FIXED` means a known navigation or fallback issue was repaired and its local file responds. `PASS` means the local route or resource is present and served. `BLOCKED_CONTENT` means a fallback responds but original content or backend functionality is unavailable. `FAIL` means a referenced local page destination remains absent.

## Follow-up recovery improvements (2026-10-27)

- Added `server.py` as the local preview server. It serves from the project root, resolves directory indexes and extensionless `.html` aliases, and returns the recovery `404.html` with status 404 only after those lookups fail. Use `python3 server.py` instead of a bare `python3 -m http.server` when previewing locally.

- Added a local, backend-independent search page at `/search/`. It searches titles and paths for 2,109 saved HTML pages using `local-search-index.json`; existing header search forms submit to this page with either `search` or `q` parameters.
- Added `local-recovery.js` to 2,110 recovered HTML pages. If an image request fails, the page displays an inline neutral placeholder instead of a broken-image icon. This is a visual fallback only; it does not restore original image content or replace source files. The same script now handles static listing pagination client-side over the product cards captured in each category page, with URL/history updates; it does not claim to restore uncaptured Shopware result pages.
- Existing unresolved-route records point to content absent from this recovery. They continue to use the project's 404 page on hosts configured to serve `404.html`; no substitute product content was fabricated.
- The Shopware application/database and external services are not part of this project. Search no longer depends on them, but live cart, checkout, account, payment, reviews, and appliance lookup remain unavailable until a real backend is supplied.

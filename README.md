# ArtisanShop frontend reconstruction

A responsive German-language storefront demo inspired by the 2025 spare-parts shop brief. It includes a modernised ecommerce layout, product listing, search/filter, category shortcuts, product detail dialogs, persisted demo cart/favorites, newsletter feedback, repair-guide cards, and accessible dropdowns.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server. No build step or dependencies are required.

```bash
python3 -m http.server 4175
```

Then open `http://127.0.0.1:4175/index.html`.

## Static checks

```bash
node --check js/app.js
node --check js/catalog.js
```

## Documentation

Comprehensive project documentation designed for modern engineering and AI-native workflows is available in the `docs/` directory:

- [Project Context and AI Guidelines](docs/PROJECT_CONTEXT.md)
- [Architecture and System Design](docs/ARCHITECTURE.md)
- [Product Specification](docs/SPECIFICATION.md)
- [Architecture Decision Records](docs/DECISIONS.md)
- [AI Development Log and Methodology](docs/AI_DEVELOPMENT_LOG.md)
- [Technical Audit and Remediation Log](docs/AUDIT_LOG.md)
- [AI Prompt and Action Execution Log](docs/PROMPT_AND_ACTION_LOG.md)
- [Quality Assurance and Verification](docs/VERIFICATION_AND_QA.md)
- [Engineering Audit Report](docs/ENGINEERING_AUDIT.md) — full itemized findings with severity, fix details, and verification
- [Feature Checklist](docs/FEATURE_CHECKLIST.md) — 12-section status matrix for every visible feature
- [Test Report](docs/TEST_REPORT.md) — 85 test cases across 8 suites, all passing

## Features

- Sticky header with logo, accessible search bar (with clear button), account button, and cart badge.
- Accessible dropdown navigation with Escape, outside-click, and keyboard focus support.
- 16 demo products across all 8 categories (Waschmaschine, Trockner, Geschirrspüler, Kühlschrank, Herd, Staubsauger, Kleingeräte, Zubehör).
- Product search by name, brand, SKU, category, and description.
- Product sort by relevance, price (ascending/descending), and name (A–Z).
- Brand filter buttons with visible active state and ARIA `aria-pressed` support.
- Product detail dialog with image, metadata, price, add-to-cart, and favorites.
- Shopping cart dialog with quantity controls, item removal, running total, and localStorage persistence.
- Favorites system with toggle (heart button) and localStorage persistence.
- Repair guide cards linking to labeled demo info dialogs.
- Footer with Kundenservice, Informationen, and Newsletter sections.
- All footer/guide/info buttons open correctly labeled demo dialogs.
- Demo login dialog with clear demo-only messaging.
- Google Fonts Inter loaded for consistent typography.
- `prefers-reduced-motion` respected for scroll-behavior.
- Open Graph and theme-color meta tags.
- Responsive at 1200px / 1020px / 760px / 420px breakpoints.
- Image fallback: broken or blocked images fall back to `assets/images/product-placeholder.png`.

## Image notes

- Product, category, hero, and guide visuals use `<img>` elements, not CSS backgrounds.
- External image sources (Unsplash, third-party CDNs) may change or block hotlinking.
- Every image with `data-fallback` switches to the local placeholder on error.
- Replace third-party URLs with licensed, locally hosted assets before production.

## Scope and limitations

This is a demonstration reconstruction, not recovered original 2025 source code. Product data, stock labels, and cart/checkout behavior are demo-only. Checkout, authentication, newsletter, and contact require a real backend and are clearly labeled as demos.

## Changelog

### v1.1 (Audit pass — October 2026)

#### Accessibility
- Added `aria-labelledby="cartDialogTitle"` to cart dialog (was missing).
- Added `id="cartDialogTitle"` to cart dialog heading.
- Added `aria-pressed` attribute to all brand filter buttons; toggled by JS.
- Added `id="heroSearchInput"` and `<label>` to hero search input.
- Footer `<b>` column headings changed to `<h3>` for semantic correctness.

#### Security and robustness
- Added null-guard to `data-close-dialog` handler.
- Added defensive `escapeHtml()` call inside `icon()` helper.

#### Bug fixes
- Hero search now syncs the header `#searchInput` value so filter state is consistent.
- Brand filter buttons now show active/selected visual state and clear each other correctly.
- Escape key listener now only runs `closeMenus()` when a menu is actually open.
- Account dialog reopening now clears the previous demo message.
- Mobile cart: `[data-remove]` button given `grid-row: 3` to prevent overlap with quantity controls.
- Cart dialog close button given `data-close-dialog` for consistency with other dialogs.

#### Content
- 5 additional demo products added: Trockner, Herd, Staubsauger, Kleingeräte, and Zubehör. All 8 category tiles now return at least one result.
- Guide card 1 now uses a distinct image instead of reusing the hero photo.

#### Performance and design
- Google Fonts Inter loaded via `<link>` tag.
- Preconnect hints added for Google Fonts and Unsplash.
- `scroll-padding-top` corrected from 20px to 140px for sticky header offset.
- `scroll-behavior: smooth` wrapped in `prefers-reduced-motion` media query.
- Section bottom padding increased from 6px to 32px for better visual rhythm.
- `.brandlist button.active` style added.
- `.searchclear` button style added.
- `.productdetailgrid .eyebrow` margin reset added.
- Open Graph and theme-color meta tags added.

### v1.2 (Engineering audit pass — October 2026)

#### New features
- Sort dropdown added to product section (relevance, price asc/desc, name A–Z).
- `aria-live="polite"` added to result count label and cart quantity spans.
- Product cards include an explicit "Details ansehen" button for touch accessibility.
- Reset filter button added to empty search state.
- Keyboard navigation support (`aria-expanded`, arrow key navigation, Escape key handling) across all main menus.

#### Robustness and UX
- Active category/brand filters now visually synced across all navigation entry points.
- Improved toast feedback system for Cart & Favorites actions.
- Full responsive review and font-weight balance pass (eliminated aggressive bold typography across headings, paragraphs, and UI elements).
- Documentation expanded with comprehensive engineering audit (`docs/ENGINEERING_AUDIT.md`), complete feature matrix (`docs/FEATURE_CHECKLIST.md`), and automated/manual verification suite (`docs/TEST_REPORT.md`).

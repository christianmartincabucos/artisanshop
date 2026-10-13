# Architecture and System Design

## Overview

ArtisanShop is engineered as a zero-dependency, high-performance static web application. It reconstructs a Swiss appliance spare parts storefront while demonstrating contemporary frontend architecture using standards-compliant web technologies.

## Technology Stack

- Markup: Semantic HTML5 with native dialog elements
- Styling: Custom Vanilla CSS with CSS custom properties, grid layouts, and media queries
- Scripting: Vanilla ES6+ JavaScript using module-free direct inclusion
- Iconography: Vector SVG sprite sheet loaded via `<use href="...">`
- Typography: Google Fonts Inter (loaded via preconnected links with system font fallback)

## Architectural Layers

### 1. Presentation Layer (HTML / CSS)

The document is organized into standard landmark sections:
- Service bar (`.servicebar`): Top utility strip showing shipping perks, warranty notice, and hotline link.
- Header (`header.header`): Sticky navigation container containing logo, search bar, and action triggers.
- Navigation bar (`nav.nav`): Multi-tier dropdown menus for appliance categories and spare-part classifications.
- Hero banner (`section.hero`): Value proposition banner with search call-to-action and popular search chips.
- Categories section (`section#categories`): 8-column responsive grid of appliance categories.
- Product catalog (`section#products`): Dynamic grid rendered by JavaScript based on active filters.
- Brand showcase (`section#brands`): Filter buttons for major manufacturer brands.
- Repair guides (`section#guides`): Card grid linking to instructional modal dialogs.
- Footer (`footer#service`): Multi-column link hub and newsletter signup form.

### 2. State Management and Data Flow

Application state is managed in-memory with synchronization to browser localStorage:

- Cart State (`cart` array): Array of cart items with id, name, sku, price, qty, and image. Saved to `artisan_cart` in localStorage.
- Favorites State (`favorites` Set): Set of product IDs marked by the user. Saved to `artisan_favorites` in localStorage.
- Filter State (`activeBrand`, `activeCategory`, `activeSearch`): Managed dynamically during user interaction and reset upon search clearance.

Data flow follows a unidirectional pattern:
1. User interacts with an element (click, input, submit).
2. Event listener dispatches an update to the in-memory state or filter parameters.
3. Dedicated render function updates the target DOM subtree (`renderProducts`, `renderCart`, `updateBadges`).
4. Persistence layer serializes state to localStorage.

### 3. Dialog System

Modal interactions use native HTML `<dialog>` elements rather than custom overlay divs:
- Product details dialog (`#productDialog`)
- Shopping cart drawer (`#cartDialog`)
- Demo account modal (`#accountDialog`)
- Generic information modal (`#infoDialog`)

Benefits of native `<dialog>`:
- Top-layer rendering eliminates z-index stacking issues.
- Native `::backdrop` styling support.
- Built-in keyboard accessibility (Escape closes modal out of the box).
- Focus trapping and restoration handled by the browser engine.

### 4. Iconography Pipeline

All icons are consolidated into `assets/icons.svg` as `<symbol>` tags with unique IDs:
- Search, cart, menu, close, plus, minus, heart, heart-filled, and directional chevrons.
- Loaded dynamically using `<svg class="icon"><use href="assets/icons.svg#id"></use></svg>`.
- Reduces HTTP requests and allows styling via CSS `currentColor`.

### 5. Resilient Image Handling

External product photos rely on a layered fallback mechanism:
1. Primary image: Remote photo loaded via `<img src="..." data-fallback>`.
2. Error listener: When an image request fails (404, rate limit, CORS block), an error handler fires once and swaps `src` to `assets/images/product-placeholder.png`.
3. CSS protection: Sized with `object-fit: contain` so fallbacks never distort card layouts.

## Responsive Design Strategy

The layout is designed mobile-first with four primary breakpoints:
- 1200px: Full desktop view with 8-column category grid and 4-column product grid.
- 1020px: Compact desktop/tablet landscape, search collapses under header bar.
- 760px: Tablet portrait and mobile landscape, header stacks, navigation scrolls horizontally.
- 420px: Small smartphone display, single-column product and guide layouts.

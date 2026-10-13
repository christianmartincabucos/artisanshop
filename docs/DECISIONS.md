# Architecture Decision Records (ADRs)

This document records the architectural and design decisions made throughout the reconstruction of ArtisanShop, including rationale, trade-offs, and outcomes.

## ADR-001: Zero-Framework Vanilla Architecture

### Status
Accepted

### Context
Modern web development frequently defaults to large frameworks like React, Vue, or Next.js. However, the client brief was to reconstruct a fast, lightweight Swiss appliance storefront that demonstrates technical craftsmanship and clean fundamentals without build complexity.

### Decision
Implement the entire application in standard HTML5, CSS3, and ES6+ JavaScript without external npm dependencies, compilation steps, or bundlers.

### Consequences
- Advantages: Zero build time, instant local execution, ultra-fast page load, transparent code review, zero supply-chain security risks.
- Trade-offs: State management and DOM updates must be maintained deliberately through structured render functions rather than virtual DOM reconcilers.

---

## ADR-002: Native HTML `<dialog>` for Modal Interfaces

### Status
Accepted

### Context
Accessible modals traditionally require third-party libraries (e.g. Radix, Headless UI) or intricate JavaScript implementations to manage z-index, inert backgrounds, and focus trapping.

### Decision
Use standard HTML5 `<dialog>` elements for the product detail, shopping cart, customer account, and info modals.

### Consequences
- Advantages: Native keyboard support (Escape key), built-in focus trapping, top-layer rendering avoiding z-index conflicts, and native `::backdrop` styling.
- Trade-offs: Requires a lightweight defensive check to ensure `close()` is only invoked when an ancestor dialog is present.

---

## ADR-003: Vector SVG Symbol Sprites

### Status
Accepted

### Context
Icon fonts or large third-party icon packages add unnecessary HTTP payload and styling friction. Inlining identical SVGs across multiple cards causes markup bloat.

### Decision
Consolidate all iconography into `assets/icons.svg` using `<symbol>` definitions, referenced via `<svg class="icon"><use href="assets/icons.svg#id"></use></svg>`.

### Consequences
- Advantages: High performance, browser cacheability, crisp rendering at all display densities, and styling with CSS `currentColor`.
- Trade-offs: Requires a helper function in JavaScript (`icon(id)`) to inject icon references cleanly into dynamically rendered cards.

---

## ADR-004: Resilient Client-Side Persistence with localStorage

### Status
Accepted

### Context
Users expect shopping carts and favorites to remain intact across page reloads and tab closures, even without a persistent backend database in demo mode.

### Decision
Store serialized cart and favorites states in browser `localStorage` using keys `artisan_cart` and `artisan_favorites`, wrapped in defensive JSON parse checks.

### Consequences
- Advantages: Smooth user experience during interactive evaluation, immediate feedback, no backend dependencies.
- Trade-offs: State is isolated to the user's current browser instance and clearable by browser cache cleaning.

---

## ADR-005: Defensive HTML Escaping in Template Literals

### Status
Accepted

### Context
Dynamic strings from catalog datasets or user inputs rendered into template literals risk cross-site scripting (XSS) if not handled cautiously.

### Decision
Implement a centralized `escapeHtml` utility in `js/app.js` that sanitizes strings using DOM text nodes before interpolating into template literals.

### Consequences
- Advantages: Prevents code injection and broken markup when product titles or SKU values contain special characters (`&`, `<`, `>`, `"`).
- Trade-offs: Dynamic HTML builders must consistently wrap string interpolations with the helper.

---

## ADR-006: Balanced Typographic Hierarchy

### Status
Accepted

### Context
Early iterations overused heavy font weights (weights 750, 800, and 850, as well as unstyled `<b>` tags), causing the interface to look visually cluttered and overly bold.

### Decision
Rebalance typography using Google Fonts Inter with a refined weight scale:
- Regular body text: 400
- Navigation items, labels, category titles, and buttons: 500
- Section headings, dialog titles, and card headers: 600
- Top brand mark and main hero header: 700

### Consequences
- Advantages: Clean, sophisticated Swiss aesthetic, increased readability, and natural hierarchy.
- Trade-offs: Required an intentional audit pass across `styles.css` to eliminate legacy 850/800 font weights.

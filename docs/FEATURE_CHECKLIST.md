# Feature Checklist

Project: ArtisanShop Frontend Reconstruction
Version: 1.2
Date: October 2026
Purpose: Tracking implementation status for all features visible in the original artisanshop.ch reference

Legend: DONE = implemented and verified | PARTIAL = present but incomplete | N/A = intentionally excluded | TODO = not yet implemented

---

## 1. Navigation and Header

| Feature | Status | Notes |
|---|---|---|
| Sticky header with logo | DONE | Backdrop blur, position sticky |
| Search bar in header | DONE | Form with submit, clear button |
| Search clear (×) button | DONE | Shown only when input has value |
| Cart button with count badge | DONE | Updates on add/remove/change |
| Account / sign-in button | DONE | Opens demo dialog |
| Service bar (truck, box, headset) | DONE | SVG icons, 3 USPs, contact link |
| Primary navigation with dropdowns | DONE | Keyboard + pointer, Escape key |
| All Categories menu | DONE | 7 category links |
| Haushaltsgeräte dropdown | DONE | 5 appliance type links |
| Ersatzteile dropdown | DONE | 5 part-type links |
| Brand / quick-search popular links | DONE | Hero section, data-query |
| aria-expanded on nav triggers | DONE | Set correctly on open/close |
| Focus management in dropdowns | DONE | First link focused on open |
| Close on outside click | DONE | Document click delegation |
| Mobile navigation (hamburger) | PARTIAL | CSS responsive but no hamburger; nav collapses at 768px |

---

## 2. Hero Section

| Feature | Status | Notes |
|---|---|---|
| Hero background image | DONE | Unsplash, data-fallback |
| H1 heading with tagline | DONE | "Ersatzteile und Zubehör" |
| Lead paragraph | DONE | "Schnell. Einfach. Passend." |
| Hero search form | DONE | Syncs to header search, scrolls to products |
| Popular search tags | DONE | Bosch, Siemens, Miele, Samsung |
| Eyebrow label | DONE | "FÜR EIN LÄNGERES GERÄTELEBEN" |

---

## 3. Category Grid

| Feature | Status | Notes |
|---|---|---|
| 8-column grid layout | DONE | Responsive to 4/2 on mobile |
| Waschmaschinen tile | DONE | Unsplash image, count label |
| Trockner tile | DONE | Unsplash image |
| Geschirrspüler tile | DONE | Unsplash image |
| Kühlschränke tile | DONE | Unsplash image |
| Herde & Backöfen tile | DONE | Unsplash image |
| Staubsauger tile | DONE | Unsplash image |
| Kleingeräte tile | DONE | Unsplash image |
| Zubehör tile | DONE | Unsplash image |
| data-fallback on all category images | DONE | Fallback to placeholder |
| Click navigates to products section | DONE | data-query triggers search + scroll |

---

## 4. Product Catalog

| Feature | Status | Notes |
|---|---|---|
| Product grid (4 columns) | DONE | Responsive to 2 on mobile |
| 16 demo products | DONE | All 8 appliance categories covered |
| Product image with fallback | DONE | data-fallback on all cards |
| Brand label | DONE | Teal, uppercase, letter-spacing |
| Product name | DONE | h3, font-weight 500 |
| Article number / SKU | DONE | "Art.-Nr.:" prefix |
| Stock availability badge | DONE | Green dot, "Lieferbar" |
| Price in CHF format | DONE | de-CH locale, CHF currency |
| Favorite (heart) button | DONE | Toggle, aria-pressed, localStorage |
| Add to cart button | DONE | Icon + label, feedback animation |
| Add to cart disabled during feedback | DONE | 1.2s lock to prevent double-add |
| Hover card lift animation | DONE | translateY(-2px), box-shadow |
| Image width/height attributes | DONE | 280×190 — reduces CLS |
| Empty state message with guidance | DONE | Includes "oder wählen Sie eine Kategorie" |
| aria-live on product grid | DONE | aria-live="polite" on #productGrid |

---

## 5. Sorting and Filtering

| Feature | Status | Notes |
|---|---|---|
| Text search | DONE | Searches name, brand, sku, category, description |
| Sort by relevance (default) | DONE | Catalog insertion order |
| Sort by price ascending | DONE | getSortedItems('price-asc') |
| Sort by price descending | DONE | getSortedItems('price-desc') |
| Sort by name A–Z | DONE | localeCompare('de') |
| Sort select in section header | DONE | #sortSelect, triggers re-render |
| Result count label | DONE | "N Artikel" with aria-live="polite" |
| Brand filter buttons | DONE | aria-pressed, active class |
| Active brand deselects on clear | DONE | Clear button resets all |
| Search clear resets brand state | DONE | Clears aria-pressed and .active |
| Category tiles trigger search | DONE | data-query click |
| Nav dropdown links trigger search | DONE | data-query click + dropdown close |
| Pagination | N/A | Out of scope for demo; 16 products shown in full |

---

## 6. Product Detail Dialog

| Feature | Status | Notes |
|---|---|---|
| Native <dialog> element | DONE | #productDialog, aria-labelledby |
| Product image | DONE | 260×260 with data-fallback |
| Brand eyebrow | DONE | Teal eyebrow class |
| Product description | DONE | All 16 products have descriptions |
| Metadata grid (dl/dt/dd) | DONE | Artikelnummer, Kategorie, Verfügbarkeit, Preis |
| Stock inline indicator | DONE | Green dot + "Lieferbar" |
| Price in detail view | DONE | detail-price class, CHF format |
| Add to cart from detail | DONE | data-add, feedback animation |
| Favorite toggle in detail | DONE | aria-pressed, label reflects state |
| Close button | DONE | data-close-dialog, aria-label |
| Backdrop click closes | DONE | Dialog click === dialog check |
| Escape key closes | DONE | Native <dialog> Escape handling |
| aria-labelledby pointing to h2 | DONE | Correct association |
| Focus trap inside dialog | DONE | Native browser <dialog> behavior |

---

## 7. Shopping Cart Dialog

| Feature | Status | Notes |
|---|---|---|
| Cart count badge | DONE | Updates on any cart change |
| Cart dialog (native <dialog>) | DONE | #cartDialog, aria-labelledby |
| Cart line items with image | DONE | width/height 58×58, fallback |
| Item name display | DONE | .cartitem-name, font-weight 500 |
| Quantity × price summary | DONE | "N × CHF X.XX" format |
| Quantity increase button | DONE | data-increase, aria-label |
| Quantity decrease button | DONE | data-decrease; removes at qty=0 |
| Quantity aria-live | DONE | aria-live="polite" on qty span |
| Remove item button | DONE | data-remove, aria-label |
| Cart total in CHF | DONE | Recalculates on every update |
| Empty cart message | DONE | "Ihr Warenkorb ist noch leer." |
| Demo checkout button | DONE | Opens info dialog with explanation |
| Demo disclaimer note | DONE | Visible beneath checkout button |
| localStorage persistence | DONE | artisanshop.cart key |
| Cart restored on page reload | DONE | Filtered for valid product IDs |

---

## 8. Account Dialog

| Feature | Status | Notes |
|---|---|---|
| Account dialog opens from header | DONE | #accountOpen click |
| Email and password inputs | DONE | type=email, type=password |
| Required + minlength validation | DONE | Native HTML5 constraint |
| Demo submit message | DONE | Clears form, shows notice |
| autocomplete attributes | DONE | email + current-password |
| aria-labelledby on dialog | DONE | #accountTitle |

---

## 9. Info / Content Dialogs

| Feature | Status | Notes |
|---|---|---|
| Kontakt | DONE | User-facing copy with demo disclaimer |
| Versand & Lieferung | DONE | CHF thresholds and delivery time |
| Rückgabe & Umtausch | DONE | 30-day return policy copy |
| FAQ | DONE | Placeholder with user-facing tone |
| Über uns | DONE | Brand description with disclaimer |
| AGB | DONE | Legal placeholder |
| Datenschutz | DONE | Privacy placeholder |
| Impressum | DONE | Legal notice placeholder |
| Reparaturanleitungen (all) | DONE | List with disclaimer |
| Guide — Türmanschette | DONE | Step-by-step demo teaser |
| Guide — Spülmaschine | DONE | Diagnosis demo teaser |
| Guide — Backofen | DONE | Cleaning demo teaser |
| Demo-Checkout | DONE | Explains missing backend |

---

## 10. Footer

| Feature | Status | Notes |
|---|---|---|
| Logo + tagline | DONE | Same brand component as header |
| Kundenservice links (4) | DONE | Open info dialogs |
| Informationen links (4) | DONE | Open info dialogs |
| Newsletter form | DONE | Demo submit with confirmation |
| Copyright notice | DONE | "© 2025 ArtisanShop" |
| Footer h3 headings | DONE | Semantic headings per column |

---

## 11. Accessibility

| Feature | Status | Notes |
|---|---|---|
| Skip link | N/A | Not present in original reference |
| All interactive elements keyboard accessible | DONE | Tabindex natural order |
| focus-visible outline | DONE | 2px solid #79b9d6 |
| aria-label on all icon-only buttons | DONE | Cart, close, favorite, qty |
| aria-expanded on nav triggers | DONE | |
| aria-pressed on brand buttons | DONE | |
| aria-live on result count | DONE | |
| aria-live on cart quantity | DONE | |
| aria-labelledby on all dialogs | DONE | |
| prefers-reduced-motion | DONE | smooth scroll disabled |
| Font size ≥ 11px body copy | DONE | min 11px used (service bar) |
| Color contrast — main body text | DONE | #142432 on #f5f7f9, ratio > 10:1 |
| Color contrast — muted text | PARTIAL | #61707d on white ~5.1:1 — passes AA |
| Color contrast — placeholder text | PARTIAL | ~3:1 — acceptable for placeholders |

---

## 12. Performance and Code Quality

| Feature | Status | Notes |
|---|---|---|
| Zero dependencies | DONE | No npm packages, no frameworks |
| Single CSS file | DONE | 19+ KB, no preprocessor |
| Script defer | DONE | Both JS files loaded with defer |
| preconnect hints | DONE | fonts.googleapis.com, fonts.gstatic.com, images.unsplash.com |
| Google Fonts (Inter) | DONE | Loaded via link element |
| Lazy loading on product images | DONE | loading="lazy" on all catalog images |
| Image width/height to prevent CLS | DONE | Explicit on all JS-rendered images |
| Open Graph meta tags | DONE | og:type, og:title, og:description |
| theme-color meta | DONE | #0c2437 |
| Meta description | DONE | Matches page content |
| No console.log or debug output | DONE | |
| 'use strict' in app.js | DONE | |
| HTML/JS ID reference integrity | DONE | All IDs verified with script |
| Unique product IDs | DONE | No duplicates in catalog |
| Duplicate HTML ID check | DONE | No duplicates |

# Product Specification and Functional Requirements

## Context and Purpose

ArtisanShop is a Swiss e-commerce portal focused on spare parts, accessories, and maintenance solutions for major household appliance brands (washing machines, dryers, dishwashers, refrigerators, ovens, vacuum cleaners, and kitchen appliances).

The goal of this reconstruction project is to provide a clean, accessible, modern storefront implementation based on the 2025 specification brief.

## Target Audience and Localization

- Region: Switzerland (CH)
- Language: Swiss Standard German (`de-CH`)
- Currency: Swiss Franc (`CHF`), formatted with two decimal places (e.g. `CHF 48.90`)
- Tone: Professional, service-oriented, reliable, emphasizing longevity and repairability over premature replacement.

## Functional Requirements

### 1. Storefront Navigation and Discovery

- Fast search input in header and hero section with real-time text synchronization.
- Clear search control (`searchClear`) allowing one-click filter reset.
- Category shortcuts for the top 8 appliance categories:
  - Waschmaschinen (Washing machines)
  - Trockner (Dryers)
  - Geschirrspüler (Dishwashers)
  - Kühlschränke (Refrigerators)
  - Herde & Backöfen (Stoves and ovens)
  - Staubsauger (Vacuum cleaners)
  - Kleingeräte (Small appliances)
  - Zubehör (Accessories)
- Brand filter strip for leading manufacturers: Bosch, Siemens, Miele, Electrolux, Samsung, AEG, Beko, and LG.
- Visual active state and ARIA `aria-pressed` indication on selected filters.

### 2. Product Catalog and Display

- Minimum of 13 representative spare parts covering every appliance category.
- Product card components displaying:
  - Product photograph with error fallback.
  - Manufacturer brand tag.
  - Clear product title.
  - Stock availability status badge.
  - Manufacturer SKU / article number.
  - Price in CHF.
  - Favorite toggle button.
  - Add to cart button.
- Detail modal presenting high-resolution imagery, detailed specifications, and quick purchasing actions.

### 3. Shopping Cart and Persistence

- Floating or header-docked cart button displaying a live item count badge.
- Slide-over or modal cart displaying line items, thumbnail, quantity selectors, unit price, and subtotal.
- Ability to increase, decrease, or remove items.
- Real-time cart total calculation.
- Local persistence using browser localStorage so items remain across page refreshes.

### 4. Customer Trust and Demo Disclaimers

- Visible disclaimers that checkout, account authentication, and order processing are demonstration features.
- Newsletter signup validation with simulated success messaging.
- Informational modals providing demo policies for shipping, warranty, returns, terms of service, and imprint (Impressum).

## Non-Functional Requirements

- Performance: Zero external runtime dependencies; load time under 1 second on standard broadband.
- Accessibility: Adherence to WCAG 2.1 Level AA standards, semantic headings, ARIA attributes, keyboard navigation, and focus management.
- Compatibility: Support for modern browsers (Chrome, Safari, Firefox, Edge).
- Motion: Respect for user prefers-reduced-motion preferences for all transitions and scrolling behavior.

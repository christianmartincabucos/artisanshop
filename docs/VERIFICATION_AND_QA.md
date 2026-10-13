# Quality Assurance and Verification Protocols

## Overview

This document provides testing procedures, QA checklists, and verification commands used to validate the stability, accessibility, and correctness of the ArtisanShop reconstruction.

## Automated Verification Commands

The following commands should be executed during CI/CD pipelines or before any release tag:

### 1. JavaScript Syntax Validation

Checks syntax across all scripts without executing side effects:
```bash
node --check js/app.js
node --check js/catalog.js
```

### 2. Static Integrity Audit

Validates asset references, IDs, and image attributes using Node.js:
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/app.js', 'utf8');
const catalog = fs.readFileSync('js/catalog.js', 'utf8');
const svg = fs.readFileSync('assets/icons.svg', 'utf8');

// Ensure all SVG symbols used in JS exist in icons.svg
const symbolMatches = [...svg.matchAll(/id=\"([^\"]+)\"/g)].map(m => m[1]);
const iconCalls = [...js.matchAll(/icon\('([^']+)'\)/g)].map(m => m[1]);
const missingIcons = iconCalls.filter(id => !symbolMatches.includes(id));
if (missingIcons.length > 0) {
  console.error('Missing SVG icons:', missingIcons);
  process.exit(1);
}

// Ensure unique IDs in index.html
const idMatches = [...html.matchAll(/id=\"([^\"]+)\"/g)].map(m => m[1]);
const duplicates = idMatches.filter((id, index) => idMatches.indexOf(id) !== index);
if (duplicates.length > 0) {
  console.error('Duplicate HTML IDs:', duplicates);
  process.exit(1);
}

console.log('Static integrity checks passed.');
"
```

## Manual QA Verification Checklist

### Navigation and Search
- Typing in header search filters products by name, SKU, or brand.
- Clearing the search input with the clear button restores the full product catalog.
- Category dropdown menus open on click and close on Escape key or outside click.
- Submitting search from the hero input updates the header input and filters the catalog.

### Product Catalog and Details
- All 8 category shortcut cards filter the catalog to that category.
- Clicking any brand button filters products to that manufacturer and toggles active state.
- Clicking a product card opens the product detail dialog with matching image, SKU, and price.
- Broken image URLs fall back gracefully to the local placeholder image without layout disruption.

### Cart and Favorites
- Clicking the heart button toggles favorite state and saves to localStorage.
- Clicking "In den Warenkorb" increases quantity and updates the header cart badge.
- Opening the cart dialog displays line items, quantity modifiers, and subtotal.
- Modifying quantities recalculates the total immediately in CHF.
- Removing an item updates both the cart dialog and header badge.
- Refreshing the browser preserves cart items and favorites.

### Accessibility (WCAG 2.1 AA)
- All interactive controls have accessible names (via text, aria-label, or labels).
- Native dialogs manage focus trap and return focus on close.
- Visual focus rings are clearly visible on keyboard tab navigation (`:focus-visible`).
- Color contrast between text and background meets or exceeds 4.5:1 ratio.
- Animations and smooth scrolling respect system `prefers-reduced-motion` settings.

### Security
- Dynamic values injected via template literals pass through `escapeHtml`.
- Dialog close handlers check for parent dialog element existence before calling `.close()`.
- Form inputs validate emails and password lengths before submission.
- Demo data notifications clearly state that no private data is sent to external servers.

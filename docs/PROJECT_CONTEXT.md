# Project Context and AI Collaboration Guide

This document defines the repository context, constraints, and operational patterns for AI agents and human developers collaborating on this project.

## Repository Overview

- Project: ArtisanShop reconstruction
- Domain: Swiss e-commerce storefront for household appliance spare parts
- Target Locale: de-CH (German, Switzerland)
- Currency: Swiss Francs (CHF)
- Tech Stack: Vanilla HTML5, Modern CSS, Vanilla ES6+ JavaScript
- Dependencies: Zero runtime packages, zero build tools

## Directory Structure

- `index.html`: Core single-page storefront markup with accessible landmarks and dialogs
- `css/styles.css`: Custom design system, responsive breakpoints, layout grids, and interactive states
- `js/catalog.js`: Product dataset with categories, SKUs, pricing, and image URLs
- `js/app.js`: Application logic, DOM manipulation, search/filter pipeline, cart, and dialog handlers
- `assets/icons.svg`: SVG symbol sprite containing all UI icons
- `assets/images/`: Local brand marks and fallback product placeholders
- `docs/`: Comprehensive technical, specification, and AI methodology documentation

## Core Engineering Principles

1. Zero build step: Everything runs directly in any modern web browser or static HTTP server.
2. Progressive enhancement: Base HTML semantic structures remain functional if scripts fail.
3. Accessible by default: Semantic elements, ARIA attributes where needed, keyboard navigation, and focus management.
4. Resilient data handling: Safe HTML escaping for dynamic content, null guards on DOM lookups, and image error fallbacks.
5. Typographic balance: Clean font hierarchy using Inter, avoiding heavy bold weights across body and navigation text.

## Local Development and Verification

Run local static server:
```bash
python3 -m http.server 4175
```
Access at: http://127.0.0.1:4175/index.html

Syntax verification:
```bash
node --check js/app.js
node --check js/catalog.js
```

## Guidelines for AI Assistants

- Never introduce node_modules or build dependencies unless explicitly instructed.
- Maintain existing naming conventions and design token variables in `css/styles.css`.
- Ensure all dynamic HTML insertions pass through the `escapeHtml` helper.
- Verify that every icon referenced in `app.js` exists in `assets/icons.svg`.
- Avoid blanket bold text formatting across copy, code comments, and documentation.

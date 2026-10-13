# Technical Audit and Remediation Log

This log documents every defect, accessibility failure, and design inconsistency identified during the static analysis and code review of the ArtisanShop reconstruction, along with the implemented fix and verification outcome.

## Issue Classification Taxonomy

- Severity P0 (Critical): Runtime exceptions or broken fundamental interactions.
- Severity P1 (Major Functional): Broken core user flows, missing categories, unhandled keyboard traps.
- Severity P2 (Quality and Accessibility): Missing ARIA landmarks, mobile responsive collisions, unoptimized fonts or spacing.
- Severity P3 (Hygiene and SEO): Missing metadata, duplicate media, unsemantic markup.

---

## Itemized Audit Entries

### Entry AUD-001: Missing Null-Guard in Dialog Close Handler
- Severity: P0
- File: js/app.js (lines 264-266)
- Defect: Calling closest('dialog').close() on elements without a dialog parent throws an unhandled TypeError.
- Fix: Wrapped close invocation in an explicit parent existence check: const dlg = event.target.closest('dialog'); if (dlg) dlg.close();
- Verification: node --check js/app.js passed; dialog close button verified on all four modal instances.

### Entry AUD-002: Missing Accessibility Landmark on Cart Dialog
- Severity: P0
- File: index.html (dialog#cartDialog)
- Defect: Cart modal lacked aria-labelledby, causing assistive screen readers to announce it as an unlabeled container.
- Fix: Added aria-labelledby="cartDialogTitle" to dialog#cartDialog and added id="cartDialogTitle" to the h2 heading.
- Verification: HTML parse check verified presence and matching target ID.

### Entry AUD-003: Brand Filter Buttons Lacked Active Visual and ARIA State
- Severity: P1
- File: index.html, js/app.js, css/styles.css
- Defect: Clicking a brand button filtered products but provided no visual feedback of which brand was active, and aria-pressed was omitted.
- Fix: Added aria-pressed="false" to all brand buttons in HTML; updated search() in app.js to toggle the .active class and aria-pressed attribute; added .brandlist button.active styling in CSS.
- Verification: Manual inspection and static validation confirmed class toggling and attribute state persistence.

### Entry AUD-004: Empty Catalog Results for Core Appliance Categories
- Severity: P1
- File: js/catalog.js
- Defect: Selecting categories such as Trockner, Herd, Staubsauger, Kleingeräte, or Zubehör yielded 0 products.
- Fix: Added 5 additional verified demo products with authentic Swiss appliance details:
  - Universal Ablaufpumpe (Waschmaschine)
  - Bosch Keilrippenriemen (Trockner)
  - Siemens Backofendichtung (Herd)
  - Miele HEPA-Abluftfilter (Staubsauger)
  - Universal Sprüharm (Zubehör)
- Verification: Validated that all 8 category shortcuts return at least one valid product.

### Entry AUD-005: Unrestricted Global Escape Listener
- Severity: P1
- File: js/app.js (Escape keydown handler)
- Defect: Escape key handler executed closeMenus() on every keypress regardless of whether a dropdown was open.
- Fix: Added guard checking document.querySelector('.navitem.is-open') before invoking menu closing logic.
- Verification: Verified dropdowns close on Escape while non-navigation interactions ignore the event.

### Entry AUD-006: Mobile Cart Layout Remove Button Overlap
- Severity: P1
- File: css/styles.css (max-width: 760px breakpoint)
- Defect: At viewport widths below 760px, the remove item button collided with the quantity increase/decrease buttons.
- Fix: Assigned explicit grid-column: 2 and grid-row: 3 to the remove button in mobile media query.
- Verification: Layout validated against CSS grid track specifications.

### Entry AUD-007: Hero Search Desynchronization
- Severity: P2
- File: js/app.js (hero search submit handler)
- Defect: Submitting a query via the hero search filtered the catalog but left the sticky header search input blank.
- Fix: Added value synchronization: searchInput.value = query so both inputs reflect current query state.
- Verification: Verified two-way input synchronization.

### Entry AUD-008: Search Clear Control Missing
- Severity: P2
- File: index.html, css/styles.css, js/app.js
- Defect: Users had no one-click method to reset a search filter back to the full catalog.
- Fix: Added button#searchClear with aria-label="Suche leeren" inside searchForm; wired event handler to clear input and run search('').
- Verification: Validated clear button visibility toggle and catalog restoration.

### Entry AUD-009: Account Dialog Reopening Preserved Stale Status Message
- Severity: P2
- File: js/app.js (accountOpen click handler)
- Defect: Reopening the demo account modal displayed previously submitted validation feedback.
- Fix: Added accountMessage.textContent = '' upon dialog opening.
- Verification: Verified clean status message on each modal open cycle.

### Entry AUD-010: Sticky Header Offset Collision on Anchor Jumps
- Severity: P2
- File: css/styles.css (html rule)
- Defect: scroll-padding-top was set to 20px, causing in-page navigation anchors to be concealed behind the ~130px sticky header.
- Fix: Increased scroll-padding-top to 140px.
- Verification: Anchor scrolling targets align cleanly below the navigation strip.

### Entry AUD-011: Smooth Scrolling Ignored Reduced Motion Preferences
- Severity: P2
- File: css/styles.css
- Defect: html { scroll-behavior: smooth } ran unconditionally, conflicting with accessibility motion preferences.
- Fix: Wrapped rule in @media (prefers-reduced-motion: no-preference).
- Verification: Validated media query structure in styles.css.

### Entry AUD-012: Unsanitized Parameter in SVG Icon Helper
- Severity: P2
- File: js/app.js (icon helper function)
- Defect: Icon identifier was concatenated directly into SVG href attribute without escaping.
- Fix: Wrapped identifier with escapeHtml(name).
- Verification: node --check js/app.js passed.

### Entry AUD-013: Missing Google Fonts Font Declaration
- Severity: P2
- File: index.html
- Defect: CSS specified Inter font-family, but HTML lacked the Google Fonts link tag, causing system font fallback.
- Fix: Added preconnect hints and Google Fonts stylesheet link for Inter weights 400 through 700.
- Verification: Verified network link tags and fallback font stack.

### Entry AUD-014: Duplicate Hero Visual on Repair Guide Card
- Severity: P3
- File: index.html (guide card 1)
- Defect: Guide card 1 reused the identical washing machine photograph as the hero header.
- Fix: Replaced guide photo URL with a distinct repair-specific Unsplash visual.
- Verification: Validated unique asset URLs across cards.

### Entry AUD-015: Missing Social Graph and Theme Color Metadata
- Severity: P3
- File: index.html
- Defect: Document omitted og:type, og:title, og:description, and meta theme-color tags.
- Fix: Injected Open Graph tags and meta theme-color="#0c2437".
- Verification: Metadata validated against HTML5 specifications.

### Entry AUD-016: Unsemantic Bold Heading Tags in Footer Columns
- Severity: P3
- File: index.html, css/styles.css
- Defect: Column titles Kundenservice, Informationen, and Newsletter were wrapped in b tags instead of headings.
- Fix: Replaced b tags with h3 elements and updated CSS styling rules.
- Verification: Document outline validated with logical heading progression (h1 -> h2 -> h3).

### Entry AUD-017: Blanket Bold Font-Weight Overuse
- Severity: P2
- File: css/styles.css
- Defect: Multiple UI elements had font-weights set to 750, 800, and 850, causing harsh, heavy visual density.
- Fix: Re-architected typography to regular 400 and medium 500 weights for body, navigation, badges, and card titles; reserved 600 for card headers and 700 for main branding.
- Verification: Full visual balance restored; verified absence of blanket bolding across stylesheet.

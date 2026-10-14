(() => {
  'use strict';

  /* ============================================================
     Constants and shared utilities
  ============================================================ */
  const FALLBACK_SRC = 'assets/images/product-placeholder.png';
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const productById = new Map(products.map(p => [p.id, p]));

  const storage = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch { /* localStorage unavailable in some private modes */ }
    }
  };

  let cart = storage.get('artisanshop.cart', []).filter(
    item => productById.has(item.id) && Number.isInteger(item.qty) && item.qty > 0
  );
  let favorites = new Set(
    storage.get('artisanshop.favorites', []).filter(id => productById.has(id))
  );

  const $ = sel => document.querySelector(sel);
  const money = val => new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(val);
  const text = val => String(val ?? '');
  const escapeHtml = val => text(val).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${escapeHtml(name)}"></use></svg>`;

  /* ============================================================
     Persistence helpers
  ============================================================ */
  function saveCart() {
    storage.set('artisanshop.cart', cart.map(({ id, qty }) => ({ id, qty })));
  }
  function saveFavorites() {
    storage.set('artisanshop.favorites', [...favorites]);
  }

  /* ============================================================
     Image fallback — prevents repeated retries and layout shifts
  ============================================================ */
  function setFallback(img) {
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = FALLBACK_SRC;
    img.classList.add('is-fallback');
  }

  function wireImageFallbacks(root = document) {
    root.querySelectorAll('img[data-fallback]').forEach(img => {
      img.addEventListener('error', () => setFallback(img), { once: true });
      if (img.complete && img.naturalWidth === 0 && img.src !== new URL(FALLBACK_SRC, location.href).href) {
        setFallback(img);
      }
    });
  }

  /* ============================================================
     Sorting helpers
  ============================================================ */
  function getSortedItems(items, sortValue) {
    const list = [...items];
    switch (sortValue) {
      case 'price-asc':  return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'name-asc':   return list.sort((a, b) => a.name.localeCompare(b.name, 'de'));
      default:           return list; // 'relevance' — original order
    }
  }

  /* ============================================================
     Product card template
  ============================================================ */
  function productCard(product) {
    const isFav = favorites.has(product.id);
    return `
      <article class="productcard" data-id="${escapeHtml(product.id)}">
        <button class="productdetails" type="button" data-product="${escapeHtml(product.id)}"
          aria-label="Details zu ${escapeHtml(product.name)} öffnen">
          <div class="productphoto">
            <img src="${escapeHtml(product.image)}"
                 alt="${escapeHtml(product.name)}"
                 loading="lazy"
                 width="280" height="190"
                 data-fallback>
            <span class="stock"><i aria-hidden="true"></i> Lieferbar</span>
          </div>
          <div class="productbody">
            <small class="productbrand">${escapeHtml(product.brand)}</small>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="sku">Art.-Nr.: ${escapeHtml(product.sku)}</p>
          </div>
        </button>
        <button class="heart ${isFav ? 'active' : ''}" type="button"
          data-favorite="${escapeHtml(product.id)}"
          aria-label="${escapeHtml(product.name)} ${isFav ? 'aus Favoriten entfernen' : 'zu Favoriten hinzufügen'}"
          aria-pressed="${String(isFav)}">
          ${icon(isFav ? 'heart-filled' : 'heart')}
        </button>
        <div class="productbottom">
          <strong>${money(product.price)}</strong>
          <button class="add" type="button"
            data-add="${escapeHtml(product.id)}"
            aria-label="${escapeHtml(product.name)} in den Warenkorb">
            ${icon('cart')}<span>In den Warenkorb</span>
          </button>
        </div>
      </article>`;
  }

  /* ============================================================
     Render product grid
  ============================================================ */
  function render(query = '') {
    const q = query.trim().toLocaleLowerCase('de');
    const sortEl = $('#sortSelect');
    const sortValue = sortEl ? sortEl.value : 'relevance';

    const filtered = products.filter(p =>
      !q || [p.name, p.brand, p.sku, p.category, p.description].some(
        v => text(v).toLocaleLowerCase('de').includes(q)
      )
    );
    const sorted = getSortedItems(filtered, sortValue);

    const grid = $('#productGrid');
    const empty = $('#emptyState');
    const label = $('#resultLabel');

    grid.innerHTML = sorted.map(productCard).join('');
    empty.hidden = sorted.length > 0;
    label.textContent = `${sorted.length} Artikel`;

    wireImageFallbacks(grid);
  }

  function search(value) {
    render(value);
    const productsSection = $('#products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ============================================================
     Cart helpers
  ============================================================ */
  function cartDetails() {
    return cart.map(item => ({ ...productById.get(item.id), qty: item.qty }));
  }

  function updateBadge() {
    const count = cart.reduce((t, item) => t + item.qty, 0);
    const badge = $('#cartCount');
    if (badge) badge.textContent = count;
  }

  function updateCart() {
    const items = cartDetails();
    updateBadge();

    const cartItems = $('#cartItems');
    if (!cartItems) return;

    cartItems.innerHTML = items.length
      ? items.map(item => `
          <div class="cartline">
            <img src="${escapeHtml(item.image)}"
                 alt="${escapeHtml(item.name)}"
                 width="58" height="58"
                 data-fallback>
            <div>
              <span class="cartitem-name">${escapeHtml(item.name)}</span>
              <small>${escapeHtml(String(item.qty))} × ${money(item.price)}</small>
            </div>
            <div class="qtycontrol" aria-label="Menge für ${escapeHtml(item.name)}">
              <button type="button" data-decrease="${escapeHtml(item.id)}" aria-label="Menge verringern">
                ${icon('minus')}
              </button>
              <span aria-live="polite">${escapeHtml(String(item.qty))}</span>
              <button type="button" data-increase="${escapeHtml(item.id)}" aria-label="Menge erhöhen">
                ${icon('plus')}
              </button>
            </div>
            <button type="button" data-remove="${escapeHtml(item.id)}"
              aria-label="${escapeHtml(item.name)} entfernen">
              ${icon('close')}
            </button>
          </div>`)
        .join('')
      : '<p class="cartempty">Ihr Warenkorb ist noch leer.</p>';

    const total = items.reduce((t, item) => t + item.qty * item.price, 0);
    const totalEl = $('#cartTotal');
    if (totalEl) totalEl.textContent = money(total);

    wireImageFallbacks(cartItems);
  }

  function addToCart(productId, trigger) {
    const product = productById.get(productId);
    if (!product) return;

    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, qty: 1 });

    saveCart();
    updateCart();

    if (!trigger) return;
    const originalHTML = trigger.innerHTML;
    trigger.classList.add('added');
    trigger.innerHTML = `${icon('check')}<span>Hinzugefügt</span>`;
    trigger.disabled = true;
    setTimeout(() => {
      if (trigger.isConnected) {
        trigger.classList.remove('added');
        trigger.innerHTML = originalHTML;
        trigger.disabled = false;
      }
    }, 1200);
  }

  function changeQuantity(productId, delta) {
    const existing = cart.find(i => i.id === productId);
    if (!existing) return;
    existing.qty += delta;
    if (existing.qty <= 0) cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCart();
  }

  /* ============================================================
     Dialog helpers
  ============================================================ */
  function openDialog(dialog) {
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeDialogEl(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  /* ============================================================
     Product detail dialog
  ============================================================ */
  function openProduct(productId) {
    const product = productById.get(productId);
    if (!product) return;

    const isFav = favorites.has(product.id);

    const titleEl = $('#productTitle');
    if (titleEl) titleEl.textContent = product.name;

    const detailsEl = $('#productDetails');
    if (detailsEl) {
      detailsEl.innerHTML = `
        <div class="productdetailgrid">
          <div class="productdetail-image">
            <img src="${escapeHtml(product.image)}"
                 alt="${escapeHtml(product.name)}"
                 width="260" height="260"
                 data-fallback>
          </div>
          <div class="productdetail-info">
            <p class="eyebrow">${escapeHtml(product.brand)}</p>
            <p>${escapeHtml(product.description || 'Hochwertiges Ersatzteil für Haushaltsgeräte. Demo-Produktdaten für die technische Rekonstruktion.')}</p>
            <dl class="productmeta">
              <div><dt>Artikelnummer</dt><dd>${escapeHtml(product.sku)}</dd></div>
              <div><dt>Kategorie</dt><dd>${escapeHtml(product.category)}</dd></div>
              <div><dt>Verfügbarkeit</dt><dd class="stock-inline"><i aria-hidden="true"></i> Lieferbar</dd></div>
              <div><dt>Preis</dt><dd class="detail-price">${money(product.price)}</dd></div>
            </dl>
            <div class="productactions">
              <button class="add primaryaction" type="button" data-add="${escapeHtml(product.id)}">
                ${icon('cart')}<span>In den Warenkorb</span>
              </button>
              <button class="heart ${isFav ? 'active' : ''}" type="button"
                data-favorite="${escapeHtml(product.id)}"
                aria-label="${escapeHtml(product.name)} ${isFav ? 'aus Favoriten entfernen' : 'zu Favoriten hinzufügen'}"
                aria-pressed="${String(isFav)}">
                ${icon(isFav ? 'heart-filled' : 'heart')}
              </button>
            </div>
          </div>
        </div>`;
      wireImageFallbacks(detailsEl);
    }

    openDialog($('#productDialog'));
  }

  /* ============================================================
     Info dialog content
  ============================================================ */
  const infoCopy = {
    contact: ['Kontakt', 'Diese Rekonstruktion enthält kein verbundenes Kontaktformular. In einer Produktivversion würden Supportadresse, Telefonnummer, Öffnungszeiten und Formularübermittlung aus verifizierten Unternehmensdaten kommen.'],
    shipping: ['Versand & Lieferung', 'Versand innerhalb der Schweiz ab CHF 5.90. Kostenloser Versand ab CHF 100.–. Lieferzeit 1–3 Werktage. (Demo – keine verbindlichen Angaben.)'],
    returns: ['Rückgabe & Umtausch', 'Rückgabe innerhalb von 30 Tagen nach Erhalt. Artikel müssen unbenutzt und originalverpackt sein. Demo-Hinweis: Rückgabeprozesse erfordern eine Backend-Integration.'],
    faq: ['Häufige Fragen', 'Häufig gestellte Fragen zu Bestellung, Lieferung, Rückgabe und Produktkompatibilität. In dieser Demo als Platzhalter eingebunden.'],
    about: ['Über uns', 'ArtisanShop – Ihr Spezialist für Ersatzteile und Zubehör für Haushaltsgeräte. Diese Seite ist eine technische Rekonstruktion.'],
    terms: ['AGB', 'Allgemeine Geschäftsbedingungen: Demo. Für Produktion müssen rechtlich geprüfte Texte eingebunden werden.'],
    privacy: ['Datenschutz', 'Diese statische Demo sendet keine Formulardaten an einen Server. Für Produktion sind Datenschutzerklärung und Cookie-Hinweise erforderlich.'],
    legal: ['Impressum', 'Musterimpressum: ArtisanShop, Schweiz. Für Produktion müssen vollständige Anbieterangaben ergänzt werden.'],
    guides: ['Reparaturanleitungen', 'Alle Anleitungen zur Selbstreparatur von Haushaltsgeräten. Die Karten zeigen Demo-Inhalte; vollständige Anleitungen erfordern sicherheitsgeprüfte Schritte und Modellkompatibilität.'],
    'guide-washer': ['Türmanschette wechseln', 'Schritt-für-Schritt-Demo: 1. Strom abschalten. 2. Türgummi lösen. 3. Neue Manschette einsetzen. 4. Sichern und testen. Für echte Anleitungen sind modellspezifische Angaben notwendig.'],
    'guide-dishwasher': ['Geschirrspüler reparieren', 'Diagnose-Demo: Wasserfilter reinigen, Sprüharme prüfen, Salzbehälter füllen, Türdichtung kontrollieren. Vollständige Anleitungen benötigen Modell- und Sicherheitsangaben.'],
    'guide-oven': ['Backofen reinigen', 'Reinigungsanleitung-Demo: Entfernen Sie Roste und Bleche. Verwenden Sie backofensicheres Reinigungsmittel. Selbstreinigungsprogramm nutzen, falls verfügbar.'],
    checkout: ['Demo-Checkout', 'Der Checkout ist bewusst deaktiviert. Für echte Bestellungen sind Warenwirtschaft, Zahlungsanbieter, Steuerlogik, Versand und Authentifizierung erforderlich.']
  };

  function openInfo(key) {
    const [title, body] = infoCopy[key] || ['Hinweis', 'Dieser Bereich ist in der Demo als Platzhalter gekennzeichnet.'];
    const titleEl = $('#infoTitle');
    const bodyEl = $('#infoBody');
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = `<p>${escapeHtml(body)}</p>`;
    openDialog($('#infoDialog'));
  }

  /* ============================================================
     Search form event handlers
  ============================================================ */
  const searchForm = $('#searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', event => {
      event.preventDefault();
      search($('#searchInput').value);
    });
  }

  const heroSearch = $('#heroSearch');
  if (heroSearch) {
    heroSearch.addEventListener('submit', event => {
      event.preventDefault();
      const query = event.currentTarget.querySelector('input').value;
      const searchInput = $('#searchInput');
      if (searchInput) searchInput.value = query;
      search(query);
    });
  }

  /* ============================================================
     Sort select
  ============================================================ */
  const sortSelect = $('#sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      render($('#searchInput') ? $('#searchInput').value : '');
    });
  }

  /* ============================================================
     Category / brand / popular query links
  ============================================================ */
  document.querySelectorAll('[data-query]').forEach(el => {
    el.addEventListener('click', event => {
      event.preventDefault();
      const query = el.dataset.query;
      const searchInput = $('#searchInput');
      if (searchInput) searchInput.value = query;

      // Brand button active state
      if (el.closest('#brandList')) {
        document.querySelectorAll('#brandList [data-query]').forEach(btn => {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('active');
        });
        el.setAttribute('aria-pressed', 'true');
        el.classList.add('active');
      }

      // Show/hide clear button
      const clearBtn = $('#searchClear');
      if (clearBtn) clearBtn.hidden = !query;

      search(query);
    });
  });

  /* ============================================================
     Global delegated click handler
  ============================================================ */
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) {
      event.stopPropagation();
      addToCart(add.dataset.add, add);
      return;
    }

    const productTrigger = event.target.closest('[data-product]');
    if (productTrigger) {
      openProduct(productTrigger.dataset.product);
      return;
    }

    const favorite = event.target.closest('[data-favorite]');
    if (favorite) {
      event.stopPropagation();
      const id = favorite.dataset.favorite;
      if (favorites.has(id)) favorites.delete(id);
      else favorites.add(id);
      saveFavorites();
      render($('#searchInput') ? $('#searchInput').value : '');
      if ($('#productDialog') && $('#productDialog').open) openProduct(id);
      return;
    }

    const remove = event.target.closest('[data-remove]');
    if (remove) {
      cart = cart.filter(i => i.id !== remove.dataset.remove);
      saveCart();
      updateCart();
      return;
    }

    const increase = event.target.closest('[data-increase]');
    if (increase) { changeQuantity(increase.dataset.increase, 1); return; }

    const decrease = event.target.closest('[data-decrease]');
    if (decrease) { changeQuantity(decrease.dataset.decrease, -1); return; }

    const info = event.target.closest('[data-info]');
    if (info) { openInfo(info.dataset.info); return; }

    if (event.target.closest('[data-close-dialog]')) {
      const dlg = event.target.closest('dialog');
      if (dlg) dlg.close();
    }
  });

  /* ============================================================
     Cart dialog
  ============================================================ */
  const cartOpen = $('#cartOpen');
  if (cartOpen) {
    cartOpen.addEventListener('click', () => {
      updateCart();
      openDialog($('#cartDialog'));
    });
  }

  const cartClose = $('#cartClose');
  if (cartClose) {
    cartClose.addEventListener('click', () => closeDialogEl($('#cartDialog')));
  }

  const checkoutButton = $('#checkoutButton');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => openInfo('checkout'));
  }

  /* ============================================================
     Account dialog
  ============================================================ */
  const accountOpen = $('#accountOpen');
  if (accountOpen) {
    accountOpen.addEventListener('click', () => {
      const msg = $('#accountMessage');
      if (msg) msg.textContent = '';
      openDialog($('#accountDialog'));
    });
  }

  const accountForm = $('#accountForm');
  if (accountForm) {
    accountForm.addEventListener('submit', event => {
      event.preventDefault();
      const msg = $('#accountMessage');
      if (msg) msg.textContent = 'Demo geprüft: Es wurde keine Anmeldung durchgeführt und nichts gespeichert.';
      event.currentTarget.reset();
    });
  }

  /* ============================================================
     Newsletter
  ============================================================ */
  const newsletter = $('#newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', event => {
      event.preventDefault();
      const msg = $('#newsletterMessage');
      if (msg) msg.textContent = 'Vielen Dank! (Demo — keine Anmeldung gespeichert.)';
      event.currentTarget.reset();
    });
  }

  /* ============================================================
     Close dialogs on backdrop click
  ============================================================ */
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });

  /* ============================================================
     Navigation dropdowns — keyboard and pointer interaction
  ============================================================ */
  const navItems = [...document.querySelectorAll('.navitem')];

  function closeMenus(except = null) {
    navItems.forEach(item => {
      if (item === except) return;
      const trigger = item.querySelector('.navtrigger');
      const panel = item.querySelector('.navdropdown');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel) panel.hidden = true;
      item.classList.remove('is-open');
    });
  }

  navItems.forEach(item => {
    const trigger = item.querySelector('.navtrigger');
    const panel = item.querySelector('.navdropdown');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
      closeMenus(item);
      trigger.setAttribute('aria-expanded', String(shouldOpen));
      panel.hidden = !shouldOpen;
      item.classList.toggle('is-open', shouldOpen);
      if (shouldOpen) panel.querySelector('a')?.focus({ preventScroll: true });
    });

    item.addEventListener('keydown', event => {
      if (event.key === 'Escape') { closeMenus(); trigger.focus(); }
    });

    panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenus()));
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.navinner')) closeMenus();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navItems.some(i => i.classList.contains('is-open'))) closeMenus();
  });

  /* ============================================================
     Search clear button
  ============================================================ */
  const searchClear = $('#searchClear');
  const searchInput = $('#searchInput');

  if (searchClear && searchInput) {
    searchInput.addEventListener('input', () => {
      searchClear.hidden = !searchInput.value;
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.hidden = true;
      document.querySelectorAll('#brandList [data-query]').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('active');
      });
      render();
    });
  }

  /* ============================================================
     Bootstrap
  ============================================================ */
  wireImageFallbacks();
  render();
  updateCart();
})();

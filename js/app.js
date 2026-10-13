(() => {
  const fallback = 'assets/images/product-placeholder.png';
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const productById = new Map(products.map(product => [product.id, product]));
  const storage = {
    get(key, fallbackValue) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallbackValue;
      } catch {
        return fallbackValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Local storage can be unavailable in private or restricted browser modes.
      }
    }
  };

  let cart = storage.get('artisanshop.cart', []).filter(item => productById.has(item.id) && Number.isInteger(item.qty) && item.qty > 0);
  let favorites = new Set(storage.get('artisanshop.favorites', []).filter(id => productById.has(id)));

  const $ = selector => document.querySelector(selector);
  const money = value => new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value);
  const text = value => String(value ?? '');
  const escapeHtml = value => text(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${escapeHtml(name)}"></use></svg>`;

  function saveCart() {
    storage.set('artisanshop.cart', cart.map(({ id, qty }) => ({ id, qty })));
  }

  function saveFavorites() {
    storage.set('artisanshop.favorites', [...favorites]);
  }

  function setFallback(img) {
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = fallback;
    img.classList.add('is-fallback');
  }

  function wireImageFallbacks(root = document) {
    root.querySelectorAll('img[data-fallback]').forEach(img => {
      img.addEventListener('error', () => setFallback(img), { once: true });
      if (img.complete && img.naturalWidth === 0 && img.src !== new URL(fallback, location.href).href) {
        setFallback(img);
      }
    });
  }

  function productCard(product) {
    const isFavorite = favorites.has(product.id);
    return `
      <article class="productcard">
        <button class="productdetails" type="button" data-product="${escapeHtml(product.id)}" aria-label="Details zu ${escapeHtml(product.name)} öffnen">
          <div class="productphoto">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" data-fallback>
            <span class="stock"><i></i> Lieferbar</span>
          </div>
          <div class="productbody">
            <small class="productbrand">${escapeHtml(product.brand)}</small>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="sku">Art.-Nr.: ${escapeHtml(product.sku)}</p>
          </div>
        </button>
        <button class="heart ${isFavorite ? 'active' : ''}" type="button" data-favorite="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)} merken" aria-pressed="${String(isFavorite)}">${icon(isFavorite ? 'heart-filled' : 'heart')}</button>
        <div class="productbottom">
          <strong>${money(product.price)}</strong>
          <button class="add" type="button" data-add="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)} in den Warenkorb">${icon('cart')}<span>In den Warenkorb</span></button>
        </div>
      </article>`;
  }

  function render(query = '') {
    const q = query.trim().toLocaleLowerCase('de');
    const items = products.filter(product => !q || [product.name, product.brand, product.sku, product.category, product.description].some(value => text(value).toLocaleLowerCase('de').includes(q)));
    $('#productGrid').innerHTML = items.map(productCard).join('');
    $('#emptyState').hidden = items.length > 0;
    $('#resultLabel').textContent = `${items.length} Artikel`;
    wireImageFallbacks($('#productGrid'));
  }

  function search(value) {
    render(value);
    $('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cartDetails() {
    return cart.map(item => ({ ...productById.get(item.id), qty: item.qty }));
  }

  function updateCart() {
    const items = cartDetails();
    $('#cartCount').textContent = items.reduce((total, item) => total + item.qty, 0);
    $('#cartItems').innerHTML = items.length ? items.map(item => `
      <div class="cartline">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" data-fallback>
        <div><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.qty)} x ${money(item.price)}</small></div>
        <div class="qtycontrol" aria-label="Menge für ${escapeHtml(item.name)}">
          <button type="button" data-decrease="${escapeHtml(item.id)}" aria-label="Menge verringern">${icon('minus')}</button>
          <span>${escapeHtml(item.qty)}</span>
          <button type="button" data-increase="${escapeHtml(item.id)}" aria-label="Menge erhöhen">${icon('plus')}</button>
        </div>
        <button type="button" data-remove="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.name)} entfernen">${icon('close')}</button>
      </div>`).join('') : '<p class="cartempty">Ihr Warenkorb ist noch leer.</p>';
    $('#cartTotal').textContent = money(items.reduce((total, item) => total + item.qty * item.price, 0));
    wireImageFallbacks($('#cartItems'));
  }

  function addToCart(productId, trigger) {
    const product = productById.get(productId);
    if (!product) return;
    const current = cart.find(item => item.id === product.id);
    if (current) current.qty += 1;
    else cart.push({ id: product.id, qty: 1 });
    saveCart();
    updateCart();
    if (!trigger) return;
    trigger.classList.add('added');
    trigger.innerHTML = `${icon('check')}<span>Hinzugefügt</span>`;
    setTimeout(() => {
      if (trigger.isConnected) {
        trigger.classList.remove('added');
        trigger.innerHTML = `${icon('cart')}<span>In den Warenkorb</span>`;
      }
    }, 1000);
  }

  function changeQuantity(productId, delta) {
    const current = cart.find(item => item.id === productId);
    if (!current) return;
    current.qty += delta;
    if (current.qty <= 0) cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
  }

  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
  }

  function openProduct(productId) {
    const product = productById.get(productId);
    if (!product) return;
    $('#productTitle').textContent = product.name;
    $('#productDetails').innerHTML = `
      <div class="productdetailgrid">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" data-fallback>
        <div>
          <p class="eyebrow">${escapeHtml(product.brand)}</p>
          <p>${escapeHtml(product.description || 'Demo-Produktdaten für die technische Rekonstruktion.')}</p>
          <div class="productmeta">
            <span><b>Artikelnummer</b>${escapeHtml(product.sku)}</span>
            <span><b>Kategorie</b>${escapeHtml(product.category)}</span>
            <span><b>Verfügbarkeit</b>Lieferbar</span>
            <span><b>Preis</b>${money(product.price)}</span>
          </div>
          <div class="productactions">
            <button class="add" type="button" data-add="${escapeHtml(product.id)}">${icon('cart')}<span>In den Warenkorb</span></button>
            <button class="heart ${favorites.has(product.id) ? 'active' : ''}" type="button" data-favorite="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)} merken" aria-pressed="${String(favorites.has(product.id))}">${icon(favorites.has(product.id) ? 'heart-filled' : 'heart')}</button>
          </div>
        </div>
      </div>`;
    wireImageFallbacks($('#productDetails'));
    openDialog($('#productDialog'));
  }

  const infoCopy = {
    contact: ['Kontakt', 'Diese Rekonstruktion enthält kein verbundenes Kontaktformular. In einer Produktivversion würden Supportadresse, Telefonnummer, Öffnungszeiten und Formularübermittlung aus verifizierten Unternehmensdaten kommen.'],
    shipping: ['Versand & Lieferung', 'Demo-Hinweis: Versandkosten, Lieferzeiten und Einschränkungen sind nicht verbindlich und müssten vor Veröffentlichung rechtlich und operativ bestätigt werden.'],
    returns: ['Rückgabe & Umtausch', 'Demo-Hinweis: Rückgabe- und Umtauschregeln sind nicht implementiert. Eine Produktivseite braucht geprüfte Widerrufs-, Garantie- und Retourenprozesse.'],
    faq: ['FAQ', 'FAQ-Inhalte sind in dieser statischen Demo noch nicht ausformuliert. Die Oberfläche zeigt, wo diese Informationen sauber eingebunden würden.'],
    about: ['Über uns', 'Diese Seite ist eine technische Rekonstruktion und erhebt keinen Anspruch, offizielle Unternehmensinhalte historisch exakt wiederzugeben.'],
    terms: ['AGB', 'Keine rechtsverbindlichen AGB in der Demo. Produktive Rechtstexte müssen geprüft und versioniert eingebunden werden.'],
    privacy: ['Datenschutz', 'Diese statische Demo sendet keine Formulardaten an einen Server. Für Produktion wären Cookie-/Tracking-Hinweise, Datenschutztexte und Backend-Datenflüsse zu prüfen.'],
    legal: ['Impressum', 'Kein offizielles Impressum in dieser Rekonstruktion. Für Produktion müssen geprüfte Anbieterangaben ergänzt werden.'],
    guides: ['Reparaturanleitungen', 'Die Reparaturkarten sind Demo-Teaser. Vollständige Anleitungen sollten sicherheitsgeprüfte Schritte, Werkzeuge, Modellkompatibilität und Haftungshinweise enthalten.'],
    'guide-washer': ['Türmanschette wechseln', 'Demo-Teaser: Eine echte Anleitung benötigt modellspezifische Schritte, Sicherheitswarnungen und passende Ersatzteilzuordnung.'],
    'guide-dishwasher': ['Spülmaschine reparieren', 'Demo-Teaser: Diagnose- und Reparaturinhalte sind nicht als technische Anleitung freigegeben.'],
    'guide-oven': ['Backofen reinigen', 'Demo-Teaser: Sicherheits- und Materialhinweise müssten vor Veröffentlichung geprüft werden.'],
    checkout: ['Demo-Checkout', 'Der Checkout ist absichtlich deaktiviert. Für echte Bestellungen wären Warenwirtschaft, Zahlungsanbieter, Steuerlogik, Versand, Authentifizierung und Bestellbestätigungen erforderlich.']
  };

  function openInfo(key) {
    const [title, body] = infoCopy[key] || ['Hinweis', 'Dieser Bereich ist in der Demo bewusst als Platzhalter gekennzeichnet.'];
    $('#infoTitle').textContent = title;
    $('#infoBody').innerHTML = `<p>${escapeHtml(body)}</p>`;
    openDialog($('#infoDialog'));
  }

  $('#searchForm').addEventListener('submit', event => {
    event.preventDefault();
    search($('#searchInput').value);
  });

  $('#heroSearch').addEventListener('submit', event => {
    event.preventDefault();
    const query = event.currentTarget.querySelector('input').value;
    $('#searchInput').value = query;
    search(query);
  });

  document.querySelectorAll('[data-query]').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      const query = element.dataset.query;
      $('#searchInput').value = query;
      // Clear active state on brand buttons, set on clicked one if it is a brand button
      if (element.closest('#brandList')) {
        document.querySelectorAll('#brandList [data-query]').forEach(btn => {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('active');
        });
        element.setAttribute('aria-pressed', 'true');
        element.classList.add('active');
      }
      // Show/hide search clear button
      const clearBtn = $('#searchClear');
      if (clearBtn) clearBtn.hidden = !query;
      search(query);
    });
  });

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
      render($('#searchInput').value);
      if ($('#productDialog').open) openProduct(id);
      return;
    }

    const remove = event.target.closest('[data-remove]');
    if (remove) {
      cart = cart.filter(item => item.id !== remove.dataset.remove);
      saveCart();
      updateCart();
      return;
    }

    const increase = event.target.closest('[data-increase]');
    if (increase) {
      changeQuantity(increase.dataset.increase, 1);
      return;
    }

    const decrease = event.target.closest('[data-decrease]');
    if (decrease) {
      changeQuantity(decrease.dataset.decrease, -1);
      return;
    }

    const info = event.target.closest('[data-info]');
    if (info) openInfo(info.dataset.info);

    if (event.target.closest('[data-close-dialog]')) {
      const dlg = event.target.closest('dialog');
      if (dlg) dlg.close();
    }
  });

  $('#cartOpen').addEventListener('click', () => {
    updateCart();
    openDialog($('#cartDialog'));
  });
  $('#cartClose').addEventListener('click', () => $('#cartDialog').close());
  $('#checkoutButton').addEventListener('click', () => openInfo('checkout'));
  $('#accountOpen').addEventListener('click', () => {
    $('#accountMessage').textContent = '';
    openDialog($('#accountDialog'));
  });
  $('#accountForm').addEventListener('submit', event => {
    event.preventDefault();
    $('#accountMessage').textContent = 'Demo geprüft: Es wurde keine Anmeldung durchgeführt und nichts gespeichert.';
    event.currentTarget.reset();
  });
  $('#newsletter').addEventListener('submit', event => {
    event.preventDefault();
    $('#newsletterMessage').textContent = 'Vielen Dank! (Demo - keine Anmeldung gespeichert.)';
    event.currentTarget.reset();
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });

  const navItems = [...document.querySelectorAll('.navitem')];
  function closeMenus(except = null) {
    navItems.forEach(item => {
      if (item === except) return;
      const trigger = item.querySelector('.navtrigger');
      const panel = item.querySelector('.navdropdown');
      trigger.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      item.classList.remove('is-open');
    });
  }

  navItems.forEach(item => {
    const trigger = item.querySelector('.navtrigger');
    const panel = item.querySelector('.navdropdown');
    trigger.addEventListener('click', () => {
      const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
      closeMenus(item);
      trigger.setAttribute('aria-expanded', String(shouldOpen));
      panel.hidden = !shouldOpen;
      item.classList.toggle('is-open', shouldOpen);
      if (shouldOpen) panel.querySelector('a')?.focus({ preventScroll: true });
    });
    item.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenus();
        trigger.focus();
      }
    });
    panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenus()));
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.navinner')) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navItems.some(i => i.classList.contains('is-open'))) closeMenus();
  });

  // Search clear button wiring
  const searchClear = $('#searchClear');
  if (searchClear) {
    $('#searchInput').addEventListener('input', () => {
      searchClear.hidden = !$('#searchInput').value;
    });
    searchClear.addEventListener('click', () => {
      $('#searchInput').value = '';
      searchClear.hidden = true;
      // Clear brand active state
      document.querySelectorAll('#brandList [data-query]').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('active');
      });
      render();
      $('#resultLabel').textContent = `${(window.PRODUCTS || []).length} Artikel`;
    });
  }

  wireImageFallbacks();
  render();
  updateCart();
})();

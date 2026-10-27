/* Small client-side fallbacks for the recovered static archive. */
(function () {
  'use strict';

  const missingImage = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><rect width="640" height="420" fill="#f1f3f1"/><g fill="none" stroke="#87948b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><rect x="188" y="92" width="264" height="204" rx="16"/><circle cx="270" cy="158" r="22"/><path d="m205 270 77-76 52 48 40-36 61 64"/></g><text x="320" y="352" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#536158">Bild nicht verfügbar</text></svg>'
  );

  document.addEventListener('error', function (event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.recoveryFallback) return;
    image.dataset.recoveryFallback = 'true';
    image.src = missingImage;
    image.removeAttribute('srcset');
    image.removeAttribute('data-src');
    image.removeAttribute('data-srcset');
    image.classList.add('recovery-missing-image');
  }, true);

  function initializeLocalPagination() {
    const pageSize = 10;
    const wrappers = document.querySelectorAll('.cms-element-product-listing-wrapper[data-listing-pagination]');

    wrappers.forEach(function (wrapper) {
      const navs = Array.from(wrapper.querySelectorAll('nav.pagination-nav'));
      if (!navs.length) return;

      const groups = new Map();
      wrapper.querySelectorAll('.card.product-box').forEach(function (card) {
        const link = card.querySelector('a.product-name[href]');
        if (!link) return;
        const key = new URL(link.href, window.location.href).pathname;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(card);
      });

      const products = Array.from(groups.entries());
      if (products.length < 2) {
        navs.forEach(function (nav) { nav.hidden = true; });
        return;
      }

      const pageCount = Math.ceil(products.length / pageSize);
      const status = document.createElement('p');
      status.className = 'local-pagination-status';
      status.setAttribute('aria-live', 'polite');
      navs[0].parentNode.insertBefore(status, navs[0]);

      function currentPage() {
        const requested = Number(new URLSearchParams(window.location.search).get('p')) || 1;
        return Math.max(1, Math.min(pageCount, Math.floor(requested)));
      }

      function pageLink(page, label, className, ariaLabel) {
        const li = document.createElement('li');
        li.className = 'page-item' + (className ? ' ' + className : '');
        if (page < 1 || page > pageCount) {
          li.classList.add('disabled');
          const span = document.createElement('span');
          span.className = 'page-link';
          span.textContent = label;
          li.appendChild(span);
          return li;
        }
        const link = document.createElement('a');
        const url = new URL(window.location.href);
        url.searchParams.set('p', String(page));
        link.className = 'page-link';
        link.href = url.pathname + url.search + url.hash;
        link.textContent = label;
        if (ariaLabel) link.setAttribute('aria-label', ariaLabel);
        if (page === currentPage()) {
          li.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
        li.appendChild(link);
        return li;
      }

      function render() {
        const page = currentPage();
        const start = (page - 1) * pageSize;
        const end = Math.min(start + pageSize, products.length);
        products.forEach(function (product, index) {
          product[1].forEach(function (card) {
            const visible = index >= start && index < end;
            card.hidden = !visible;
            card.style.display = visible ? '' : 'none';
          });
        });
        status.textContent = 'Zeige ' + (start + 1) + '–' + end + ' von ' + products.length + ' lokal gespeicherten Produkten. Weitere Shopseiten sind im Archiv nicht verfügbar.';

        navs.forEach(function (nav) {
          const list = document.createElement('ul');
          list.className = 'pagination';
          list.appendChild(pageLink(page - 1, '‹', 'page-prev', 'Vorherige Seite'));
          for (let number = 1; number <= pageCount; number++) {
            list.appendChild(pageLink(number, String(number), '', 'Seite ' + number));
          }
          list.appendChild(pageLink(page + 1, '›', 'page-next', 'Nächste Seite'));
          nav.replaceChildren(list);
        });
      }

      navs.forEach(function (nav) {
        nav.addEventListener('click', function (event) {
          const link = event.target.closest('a.page-link');
          if (!link) return;
          event.preventDefault();
          const url = new URL(link.href, window.location.href);
          window.history.pushState({}, '', url.pathname + url.search + url.hash);
          render();
        });
      });

      window.addEventListener('popstate', render);
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLocalPagination, { once: true });
  } else {
    initializeLocalPagination();
  }
})();

(function () {
  'use strict';

  const initializeNavigation = function () {
    const body = document.body;
    if (!body || body.dataset.localNavigationReady === 'true') return;
    body.dataset.localNavigationReady = 'true';

    const desktopToggle = document.querySelector('.header-logo-main-navigation.richmenu-openclose');
    const richMenu = document.querySelector('.richmenu-container .richmenu');
    const menuOverlay = document.querySelector('.richmenu-container .menu-overlay');

    if (desktopToggle && richMenu) {
      desktopToggle.setAttribute('role', 'button');
      desktopToggle.setAttribute('tabindex', '0');
      desktopToggle.setAttribute('aria-controls', 'desktopRichMenu');
      desktopToggle.setAttribute('aria-expanded', 'false');
      richMenu.id = richMenu.id || 'desktopRichMenu';

      const setDesktopOpen = function (isOpen) {
        body.classList.toggle('rich-menu-active', isOpen);
        desktopToggle.setAttribute('aria-expanded', String(isOpen));
      };

      desktopToggle.addEventListener('click', function () {
        setDesktopOpen(!body.classList.contains('rich-menu-active'));
      });
      desktopToggle.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setDesktopOpen(!body.classList.contains('rich-menu-active'));
        }
      });
      menuOverlay?.addEventListener('click', function () {
        setDesktopOpen(false);
      });
      richMenu.addEventListener('click', function (event) {
        if (event.target.closest('a[href]')) setDesktopOpen(false);
      });
    }

    const mobileToggles = document.querySelectorAll('[data-off-canvas-menu], [data-offcanvas-menu]');
    if (!mobileToggles.length) return;

    const source = document.querySelector('.js-navigation-offcanvas-initial-content');
    const backdrop = document.createElement('button');
    backdrop.className = 'site-navigation-backdrop';
    backdrop.type = 'button';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Menü schließen');

    const drawer = document.createElement('aside');
    drawer.className = 'site-navigation-drawer';
    drawer.id = 'siteNavigationDrawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Hauptnavigation');
    drawer.hidden = true;

    if (source) {
      const content = source.cloneNode(true);
      content.classList.remove('d-none', 'js-navigation-offcanvas-initial-content');
      drawer.appendChild(content);
    } else {
      const fallbackNav = document.querySelector('.main-navigation-menu');
      if (fallbackNav) drawer.appendChild(fallbackNav.cloneNode(true));
    }

    body.append(backdrop, drawer);

    let previousFocus = null;
    const setMobileOpen = function (isOpen) {
      drawer.hidden = !isOpen;
      backdrop.hidden = !isOpen;
      body.classList.toggle('site-navigation-open', isOpen);
      mobileToggles.forEach(function (toggle) {
        toggle.setAttribute('aria-controls', drawer.id);
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      if (isOpen) {
        previousFocus = document.activeElement;
        const closeButton = drawer.querySelector('.js-offcanvas-close');
        const firstLink = drawer.querySelector('a[href]');
        (closeButton || firstLink || drawer).focus({ preventScroll: true });
      } else if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
    };

    mobileToggles.forEach(function (toggle) {
      toggle.setAttribute('aria-controls', drawer.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function () {
        setMobileOpen(drawer.hidden);
      });
    });

    backdrop.addEventListener('click', function () { setMobileOpen(false); });
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('.js-offcanvas-close')) {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.target.closest('a[href]')) setMobileOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !drawer.hidden) {
        setMobileOpen(false);
        return;
      }
      if (event.key === 'Tab' && !drawer.hidden) {
        const focusable = Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) {
          event.preventDefault();
          drawer.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation, { once: true });
  } else {
    initializeNavigation();
  }
})();

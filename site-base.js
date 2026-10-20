/*
 * Optional static deployment origin override. Leave empty to follow the
 * current browser origin automatically. Change this value only when needed.
 * Examples: 'https://example.com/' or 'http://localhost:8081/'
 */
(function () {
  const configuredBaseUrl = '';
  let baseOrigin = window.location.origin;

  if (configuredBaseUrl.trim()) {
    try {
      const configured = new URL(configuredBaseUrl, window.location.href);
      if (configured.protocol === 'http:' || configured.protocol === 'https:') {
        baseOrigin = configured.origin;
      } else {
        console.error('SITE_BASE_URL must use HTTP or HTTPS; using the current origin.');
      }
    } catch (error) {
      console.error('Invalid SITE_BASE_URL; using the current origin.', error);
    }
  }

  // Keep the active page path so hash and query-only links retain their meaning.
  const pageUrl = new URL(window.location.pathname + window.location.search, baseOrigin);
  const baseElement = document.createElement('base');
  baseElement.href = pageUrl.href;
  document.head.prepend(baseElement);
  window.SITE_BASE_URL = baseOrigin + '/';
})();

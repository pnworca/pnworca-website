// Cookie banner (CookieConsent v3, MIT, self-hosted in /assets/vendor/cookieconsent/)
// and Google Tag Manager. GTM loads only after a visitor accepts analytics cookies.
// The consent defaults (all denied) are set inline in the page head.
(function () {
  var me = document.currentScript;
  var GTM_ID = me ? me.getAttribute('data-gtm') : '';
  var gtmLoaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function loadGtm() {
    if (gtmLoaded || !GTM_ID) return;
    gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(s);
  }

  function applyConsent() {
    var ok = CookieConsent.acceptedCategory('analytics');
    gtag('consent', 'update', { analytics_storage: ok ? 'granted' : 'denied' });
    if (ok) loadGtm();
  }

  CookieConsent.run({
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left' },
      preferencesModal: { layout: 'box' }
    },
    onConsent: applyConsent,
    onChange: applyConsent,
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }] }
      }
    },
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Cookies on this site',
            description: 'We use Google Analytics to see which pages people use, so we can improve the site. It sets cookies only if you accept. <a href="/privacy/">Privacy</a>',
            acceptAllBtn: 'Accept',
            acceptNecessaryBtn: 'Reject',
            showPreferencesBtn: 'Choose'
          },
          preferencesModal: {
            title: 'Cookie settings',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save settings',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Necessary',
                description: 'Needed for the site to work, such as remembering your cookie choice. Always on.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analytics',
                description: 'Google Analytics counts visits and shows which pages are used. It sets cookies whose names start with _ga.',
                linkedCategory: 'analytics'
              },
              {
                title: 'More information',
                description: 'See our <a href="/privacy/">privacy page</a>, or <a href="/contact/">contact us</a> with questions.'
              }
            ]
          }
        }
      }
    }
  });
})();

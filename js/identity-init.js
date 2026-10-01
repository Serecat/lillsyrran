/* Lillsyrran — Netlify Identity init
   Handles invite/activation links (e.g. #invite_token=...) landing on any
   public page by loading the Identity widget and redirecting to /admin/
   after a successful login. */

(function () {
  'use strict';

  if (!window.netlifyIdentity) return;

  window.netlifyIdentity.on('login', function () {
    window.location.href = '/admin/';
  });
})();

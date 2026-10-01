/* Lillsyrran — Netlify Identity init for public pages
   Handles invite/activation/recovery links (e.g. #invite_token=...) landing
   on any public page by redirecting to /admin/ after a successful login,
   so the user lands on the CMS once their account/password is set up.
   Only triggers for identity flows (invite/recovery/confirmation tokens in
   the URL hash) to avoid redirecting regular visitors who happen to log in
   via Identity for an unrelated reason. */

(function () {
  'use strict';

  if (!window.netlifyIdentity) return;

  var hash = window.location.hash || '';
  var isInviteFlow = /(invite_token|recovery_token|confirmation_token|email_change_token)=/.test(hash);

  if (!isInviteFlow) return;

  window.netlifyIdentity.on('login', function () {
    window.location.href = '/admin/';
  });
})();

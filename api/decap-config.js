module.exports = function handler(_request, response) {
  var turboSiteId = process.env.DECAP_TURBO_SITE_ID;

  if (!turboSiteId) {
    response.status(500).json({
      error: 'Missing DECAP_TURBO_SITE_ID environment variable.'
    });
    return;
  }

  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    backend: {
      turbo_site_id: turboSiteId
    }
  });
};

/* Lillsyrran — CMS content loader */
(function () {
  'use strict';

  function fetchJson(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (response) {
      if (!response.ok) {
        throw new Error('Could not load ' + path);
      }
      return response.json();
    });
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeHtmlWithLineBreaks(value) {
    return escapeHtml(value).replace(/\r?\n/g, '<br>');
  }

  function renderFooterHours(lines) {
    var containers = document.querySelectorAll('[data-cms-footer-hours]');
    if (!containers.length || !Array.isArray(lines)) return;

    containers.forEach(function (container) {
      container.innerHTML = lines.map(function (line) {
        return '<p>' + escapeHtml(line) + '</p>';
      }).join('');
    });
  }

  function renderContact(settings) {
    if (!settings || !settings.contact) return;

    var contact = settings.contact;
    var address = document.getElementById('cms-contact-address');
    var phone = document.getElementById('cms-contact-phone');
    var email = document.getElementById('cms-contact-email');
    var mapLinks = document.querySelectorAll('[data-cms-map-link]');
    var callLinks = document.querySelectorAll('[data-cms-call-link]');

    if (address) {
      address.textContent = contact.address || '';
    }

    if (phone) {
      phone.textContent = contact.phone || '';
      phone.setAttribute('href', contact.phoneLink || '#');
    }

    callLinks.forEach(function (link) {
      link.setAttribute('href', contact.phoneLink || '#');
      if (contact.phone) {
        link.setAttribute('aria-label', 'Ring oss: ' + contact.phone);
      }
    });

    if (email) {
      email.textContent = contact.email || '';
      email.setAttribute('href', contact.emailLink || '#');
    }

    mapLinks.forEach(function (link) {
      link.setAttribute('href', contact.mapLink || '#');
      if (contact.address) {
        link.setAttribute('aria-label', 'Vägbeskrivning till ' + contact.address);
      }
    });

    var hoursBody = document.getElementById('hours-table-body');
    if (hoursBody && Array.isArray(settings.openingHoursDetailed)) {
      hoursBody.innerHTML = settings.openingHoursDetailed.map(function (row) {
        return '<tr><td>' + escapeHtml(row.day) + '</td><td>' + escapeHtml(row.hours) + '</td></tr>';
      }).join('');
    }
  }

  function renderMenu(menuData) {
    var container = document.getElementById('menu-sections');
    if (!container || !menuData || !Array.isArray(menuData.sections)) return;

    var html = menuData.sections.map(function (section) {
      var heading = '<h2 class="menu-section-title">' + escapeHtml(section.title) + '</h2>';

      if (section.layout === 'two_columns' && Array.isArray(section.columns)) {
        var columnsHtml = section.columns.map(function (items) {
          return '<div class="menu-items">' + (Array.isArray(items) ? items.map(function (item) {
            var desc = item.description ? '<p class="menu-item-desc">' + escapeHtml(item.description) + '</p>' : '';
            return '<div class="menu-item"><div class="menu-item-info"><p class="menu-item-name">' + escapeHtml(item.name) + '</p>' + desc + '</div><span class="menu-item-price">' + escapeHtml(item.price) + '</span></div>';
          }).join('') : '') + '</div>';
        }).join('');

        return '<div class="menu-section">' + heading + '<div class="menu-two-col">' + columnsHtml + '</div></div>';
      }

      if (section.layout === 'single_column' && Array.isArray(section.items)) {
        var itemsHtml = section.items.map(function (item) {
          var desc = item.description ? '<p class="menu-item-desc">' + escapeHtml(item.description) + '</p>' : '';
          return '<div class="menu-item"><div class="menu-item-info"><p class="menu-item-name">' + escapeHtml(item.name) + '</p>' + desc + '</div><span class="menu-item-price">' + escapeHtml(item.price) + '</span></div>';
        }).join('');

        return '<div class="menu-section">' + heading + '<div class="menu-items">' + itemsHtml + '</div></div>';
      }

      return '';
    }).join('');

    container.innerHTML = html;

    var offerContainer = document.getElementById('menu-offer');
    if (offerContainer && menuData.offer) {
      offerContainer.innerHTML =
        '<h3>' + escapeHtml(menuData.offer.title) + '</h3>' +
        '<p class="offer-price-small">' + escapeHtml(menuData.offer.price) + '</p>' +
        '<p>' + escapeHtmlWithLineBreaks(menuData.offer.description) + '</p>';
    }
  }

  function renderEvents(eventsData) {
    var container = document.getElementById('events-list');
    if (!container || !eventsData || !Array.isArray(eventsData.events)) return;

    container.innerHTML = eventsData.events.map(function (event) {
      return '<details class="event-card"><summary><div class="event-date" aria-label="Datum"><div class="day">' + escapeHtml(event.day) + '</div><div class="month">' + escapeHtml(event.month) + '</div></div><div class="event-info"><p class="event-tag">' + escapeHtml(event.tag) + '</p><h3>' + escapeHtml(event.title) + '</h3><span class="event-summary-toggle">Läs mer <i class="toggle-icon">▾</i></span></div></summary><div class="event-details-body"><p>' + escapeHtmlWithLineBreaks(event.description) + '</p></div></details>';
    }).join('');
  }

  var needsSettings =
    document.querySelector('[data-cms-footer-hours]') ||
    document.getElementById('cms-contact-address') ||
    document.getElementById('hours-table-body') ||
    document.querySelector('[data-cms-call-link]') ||
    document.querySelector('[data-cms-map-link]');
  var needsMenu = document.getElementById('menu-sections') || document.getElementById('menu-offer');
  var needsEvents = document.getElementById('events-list');

  var loaders = [];

  if (needsSettings) {
    loaders.push(
      fetchJson('data/site-settings.json').then(function (settings) {
        if (!settings || typeof settings !== 'object') {
          return;
        }
        renderFooterHours(settings.openingHoursSummary);
        renderContact(settings);
      })
    );
  }

  if (needsMenu) {
    loaders.push(fetchJson('data/menu.json').then(renderMenu));
  }

  if (needsEvents) {
    loaders.push(fetchJson('data/events.json').then(renderEvents));
  }

  Promise.all(loaders.map(function (loader) {
    return loader.catch(function () {
      return null;
    });
  }));
}());

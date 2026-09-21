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
    });

    if (email) {
      email.textContent = contact.email || '';
      email.setAttribute('href', contact.emailLink || '#');
    }

    mapLinks.forEach(function (link) {
      link.setAttribute('href', contact.mapLink || '#');
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

      if (Array.isArray(section.columns)) {
        var columnsHtml = section.columns.map(function (items) {
          return '<div class="menu-items">' + (Array.isArray(items) ? items.map(function (item) {
            var desc = item.description ? '<p class="menu-item-desc">' + escapeHtml(item.description) + '</p>' : '';
            return '<div class="menu-item"><div class="menu-item-info"><p class="menu-item-name">' + escapeHtml(item.name) + '</p>' + desc + '</div><span class="menu-item-price">' + escapeHtml(item.price) + '</span></div>';
          }).join('') : '') + '</div>';
        }).join('');

        return '<div class="menu-section">' + heading + '<div class="menu-two-col">' + columnsHtml + '</div></div>';
      }

      if (Array.isArray(section.items)) {
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
        '<p>' + escapeHtml(menuData.offer.description) + '</p>';
    }
  }

  function renderEvents(eventsData) {
    var container = document.getElementById('events-list');
    if (!container || !eventsData || !Array.isArray(eventsData.events)) return;

    container.innerHTML = eventsData.events.map(function (event) {
      return '<details class="event-card"><summary><div class="event-date" aria-label="Datum"><div class="day">' + escapeHtml(event.day) + '</div><div class="month">' + escapeHtml(event.month) + '</div></div><div class="event-info"><p class="event-tag">' + escapeHtml(event.tag) + '</p><h3>' + escapeHtml(event.title) + '</h3><span class="event-summary-toggle">Läs mer <i class="toggle-icon">▾</i></span></div></summary><div class="event-details-body"><p>' + escapeHtml(event.description) + '</p></div></details>';
    }).join('');
  }

  Promise.allSettled([
    fetchJson('data/site-settings.json'),
    fetchJson('data/menu.json'),
    fetchJson('data/events.json')
  ]).then(function (results) {
    var settingsResult = results[0];
    var menuResult = results[1];
    var eventsResult = results[2];

    if (settingsResult.status === 'fulfilled') {
      renderFooterHours(settingsResult.value.openingHoursSummary);
      renderContact(settingsResult.value);
    }

    if (menuResult.status === 'fulfilled') {
      renderMenu(menuResult.value);
    }

    if (eventsResult.status === 'fulfilled') {
      renderEvents(eventsResult.value);
    }
  });
}());

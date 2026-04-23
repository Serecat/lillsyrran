/* Lillsyrran — Main JS */

(function () {
  'use strict';

  /* ── Mobile nav toggle ── */
  const header   = document.querySelector('.site-header');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    /* Close nav when a link is clicked */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });

    /* Close nav when clicking outside */
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── Header shadow on scroll ── */
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Mark active nav link ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Instagram photo carousel ── */
  var track    = document.getElementById('instaTrack');
  var prevBtn  = document.querySelector('.insta-arrow-prev');
  var nextBtn  = document.querySelector('.insta-arrow-next');

  if (track && prevBtn && nextBtn) {
    var currentIndex = 0;

    function visibleCount() {
      var vw = window.innerWidth;
      if (vw <= 768)  return 1;
      if (vw <= 1024) return 2;
      return 3;
    }

    function totalSlides() {
      return track.querySelectorAll('.insta-slide').length;
    }

    function maxIndex() {
      return Math.max(0, totalSlides() - visibleCount());
    }

    function updateCarousel() {
      var slides    = track.querySelectorAll('.insta-slide');
      if (!slides.length) return;
      var slideW    = slides[0].offsetWidth + 4; /* 4px gap */
      track.style.transform = 'translateX(-' + (currentIndex * slideW) + 'px)';
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex();
    }

    prevBtn.addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', function () {
      if (currentIndex < maxIndex()) {
        currentIndex += 1;
        updateCarousel();
      }
    });

    window.addEventListener('resize', function () {
      currentIndex = Math.min(currentIndex, maxIndex());
      updateCarousel();
    }, { passive: true });

    updateCarousel();
  }
}());

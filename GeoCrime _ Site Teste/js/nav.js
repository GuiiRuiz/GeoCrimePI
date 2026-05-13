/**
 * GeoCrime — nav.js
 * Scroll effect + mobile burger menu
 */
(function () {
  'use strict';

  var nav    = document.getElementById('nav');
  var burger = document.getElementById('nav-burger');
  var menu   = document.getElementById('nav-mobile-menu');

  /* ── Scroll: adiciona classe .scrolled ── */
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Burger mobile ── */
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Fecha ao clicar em link do menu */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Fecha com Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/**
 * GeoCrime — plans.js
 * Toggle mensal/anual, atualização de preços e FAQ accordion
 */

(function () {
  'use strict';

  /* ── Dados de preços ────────────────────────────── */

  const PRICES = {
    free: {
      monthly: { display: '0',   note: '' },
      annual:  { display: '0',   note: '' },
    },
    pro: {
      monthly: { display: '49',  note: '' },
      annual:  { display: '39',  note: 'R$ 468/ano — economia de R$ 120' },
    },
    enterprise: {
      monthly: { display: '149', note: '' },
      annual:  { display: '119', note: 'R$ 1.428/ano — economia de R$ 360' },
    },
  };

  let isAnnual = false;

  /* ── Toggle switch ──────────────────────────────── */

  const toggle       = document.getElementById('billing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual  = document.getElementById('label-annual');

  if (toggle) {
    toggle.addEventListener('click', function () {
      isAnnual = !isAnnual;
      toggle.classList.toggle('is-annual', isAnnual);

      if (labelMonthly) labelMonthly.classList.toggle('is-active', !isAnnual);
      if (labelAnnual)  labelAnnual.classList.toggle('is-active',  isAnnual);

      updatePrices();
    });
  }

  /* ── Atualiza valores exibidos ──────────────────── */

  function updatePrices() {
    const mode = isAnnual ? 'annual' : 'monthly';

    Object.keys(PRICES).forEach(function (plan) {
      const amountEl = document.querySelector(
        '[data-price-amount="' + plan + '"]'
      );
      const noteEl = document.querySelector(
        '[data-price-note="' + plan + '"]'
      );

      if (amountEl) {
        amountEl.textContent = PRICES[plan][mode].display;
      }

      if (noteEl) {
        noteEl.textContent = PRICES[plan][mode].note;
      }
    });
  }

  /* ── FAQ accordion ──────────────────────────────── */

  document.querySelectorAll('.faq-item').forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      /* Fecha todos */
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('is-open');
        const otherQ = other.querySelector('.faq-item__question');
        if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
      });

      /* Abre o clicado se estava fechado */
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
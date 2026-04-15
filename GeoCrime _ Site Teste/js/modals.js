/**
 * GeoCrime — modals.js
 * Abertura, fechamento e validação dos modais de autenticação
 */
(function () {
  'use strict';

  /* ── Referências ── */
  var overlayLogin  = document.getElementById('modal-login');
  var overlaySignup = document.getElementById('modal-signup');

  /* ── Abre um modal pelo nome ── */
  function openModal(name) {
    closeAllModals();
    var overlay = name === 'login' ? overlayLogin : overlaySignup;
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    /* Foca o primeiro input */
    setTimeout(function () {
      var first = overlay.querySelector('input');
      if (first) first.focus();
    }, 180);
  }

  /* ── Fecha todos os modais ── */
  function closeAllModals() {
    [overlayLogin, overlaySignup].forEach(function (overlay) {
      if (!overlay) return;
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  /* ── Botões data-modal ── */
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.modal);
    });
  });

  /* ── Botão fechar (✕) ── */
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', closeAllModals);
  });

  /* ── Clique no overlay fecha o modal ── */
  [overlayLogin, overlaySignup].forEach(function (overlay) {
    if (!overlay) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeAllModals();
    });
  });

  /* ── Escape fecha ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllModals();
  });

  /* ── Troca entre login e signup ── */
  document.querySelectorAll('[data-switch-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.switchModal);
    });
  });

  /* ══════════════════════════════════════════
     VALIDAÇÃO — LOGIN
  ══════════════════════════════════════════ */
  var loginForm  = document.getElementById('login-form');
  var loginEmail = document.getElementById('login-email');
  var loginPass  = document.getElementById('login-pass');

  function validateEmail(val) {
    return /
^
[^\s@]+@[^\s@]+\.[^\s@]+
$
/.test(val.trim());
  }

  function setFieldError(input, hasError) {
    input.classList.toggle('error', hasError);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailOk = validateEmail(loginEmail.value);
      var passOk  = loginPass.value.length >= 1;

      setFieldError(loginEmail, !emailOk);
      setFieldError(loginPass,  !passOk);

      if (emailOk && passOk) {
        /* Simulação de submit — substituir por fetch real */
        var btn = loginForm.querySelector('.form-submit');
        btn.textContent = 'Entrando…';
        btn.disabled = true;

        setTimeout(function () {
          closeAllModals();
          btn.textContent = 'Entrar na conta';
          btn.disabled = false;
          loginForm.reset();
        }, 1400);
      }
    });
  }

  /* ══════════════════════════════════════════
     VALIDAÇÃO — SIGNUP
  ══════════════════════════════════════════ */
  var signupForm  = document.getElementById('signup-form');
  var signupFname = document.getElementById('signup-fname');
  var signupLname = document.getElementById('signup-lname');
  var signupEmail = document.getElementById('signup-email');
  var signupPass  = document.getElementById('signup-pass');
  var signupTerms = document.getElementById('signup-terms');

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fnameOk = signupFname && signupFname.value.trim().length >= 2;
      var lnameOk = signupLname && signupLname.value.trim().length >= 2;
      var emailOk = validateEmail(signupEmail.value);
      var passOk  = signupPass.value.length >= 8;
      var termsOk = signupTerms && signupTerms.checked;

      setFieldError(signupFname, !fnameOk);
      setFieldError(signupLname, !lnameOk);
      setFieldError(signupEmail, !emailOk);
      setFieldError(signupPass,  !passOk);

      if (!termsOk) {
        alert('Aceite os Termos de Uso para continuar.');
        return;
      }

      if (fnameOk && lnameOk && emailOk && passOk) {
        var btn = signupForm.querySelector('.form-submit');
        btn.textContent = 'Criando conta…';
        btn.disabled = true;

        setTimeout(function () {
          closeAllModals();
          btn.textContent = 'Criar conta grátis';
          btn.disabled = false;
          signupForm.reset();
        }, 1400);
      }
    });
  }

  /* Limpa erros ao digitar */
  document.querySelectorAll('.form-input').forEach(function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('error');
    });
  });
})();
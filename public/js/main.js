/* =====================================================
   CareerGuide — main.js  v3
   Features:
     1. Dark / light theme toggle (persisted in localStorage)
     2. Flash auto-dismiss
     3. Assessment progress bar
     4. Likert scale interaction
     5. Assessment form validation (fixed)
     6. Login form validation
     7. Register form validation
     8. RIASEC bar animation
     9. Scroll-reveal on cards
   ===================================================== */

(function () {
  'use strict';

  var TOTAL_QUESTIONS = 11;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ═══════════════════════════════════════════════════
     1. DARK / LIGHT THEME TOGGLE
  ═══════════════════════════════════════════════════ */
  function initTheme() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('cg-theme', theme); } catch (e) {}
    }

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ═══════════════════════════════════════════════════
     2. FLASH AUTO-DISMISS
  ═══════════════════════════════════════════════════ */
  function initFlash() {
    document.querySelectorAll('.flash').forEach(function (el) {
      setTimeout(function () {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity    = '0';
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 650);
      }, 4000);
    });
  }

  /* ═══════════════════════════════════════════════════
     3 + 4. PROGRESS BAR & LIKERT
  ═══════════════════════════════════════════════════ */
  function countAnswered() {
    return document.querySelectorAll('.lopts input[type="radio"]:checked').length;
  }

  function renderProgress() {
    var fill = document.getElementById('progFill');
    var text = document.getElementById('progText');
    var pct  = document.getElementById('progPct');
    if (!fill) return;
    var answered   = countAnswered();
    var percentage = Math.round((answered / TOTAL_QUESTIONS) * 100);
    fill.style.width           = percentage + '%';
    if (pct)  pct.textContent  = percentage + '%';
    if (text) text.textContent = answered + ' of ' + TOTAL_QUESTIONS + ' answered';
  }

  function initLikert() {
    var radios = document.querySelectorAll('.lb-label input[type="radio"]');
    if (radios.length === 0) return;
    radios.forEach(function (radio) {
      radio.addEventListener('change', renderProgress);
      radio.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
    renderProgress();
  }

  /* ═══════════════════════════════════════════════════
     5. ASSESSMENT FORM VALIDATION  (bug-fixed)
  ═══════════════════════════════════════════════════ */
  function initAssessForm() {
    var form    = document.getElementById('assessForm');
    var subErr  = document.getElementById('subErr');
    if (!form) return;

    var requiredIds = ['edu_level', 'marks', 'budget', 'destination'];

    requiredIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function () {
        el.classList.remove('select-error');
        el.style.borderColor = '';
        if (subErr) subErr.classList.remove('visible');
      });
    });

    document.querySelectorAll('.lb-label input[type="radio"]').forEach(function (r) {
      r.addEventListener('change', function () {
        if (subErr) subErr.classList.remove('visible');
      });
    });

    form.addEventListener('submit', function (e) {
      var valid    = true;
      var answered = countAnswered();

      requiredIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (!el.value) {
          el.classList.add('select-error');
          el.style.borderColor = 'var(--danger)';
          valid = false;
        } else {
          el.classList.remove('select-error');
          el.style.borderColor = '';
        }
      });

      var eduEl     = document.getElementById('edu_level');
      var streamEl  = document.getElementById('stream');
      var streamRow = document.getElementById('streamRow');
      if (
        eduEl && eduEl.value === '12th' &&
        streamRow && streamRow.style.display !== 'none' &&
        streamEl && !streamEl.value
      ) {
        streamEl.classList.add('select-error');
        streamEl.style.borderColor = 'var(--danger)';
        valid = false;
      } else if (streamEl) {
        streamEl.classList.remove('select-error');
        streamEl.style.borderColor = '';
      }

      if (answered < TOTAL_QUESTIONS) valid = false;

      if (!valid) {
        e.preventDefault();
        var missingBg = requiredIds.some(function (id) {
          var el = document.getElementById(id);
          return el && !el.value;
        });
        var missingStream = (eduEl && eduEl.value === '12th' && streamEl && !streamEl.value);
        var msg;
        if (answered < TOTAL_QUESTIONS && (missingBg || missingStream)) {
          msg = 'Please fill in all background fields and answer all ' + TOTAL_QUESTIONS + ' questions (' + answered + ' done so far).';
        } else if (answered < TOTAL_QUESTIONS) {
          msg = 'Please answer all questions (' + answered + ' / ' + TOTAL_QUESTIONS + ' done).';
        } else if (missingStream) {
          msg = 'Please select your 12th stream.';
        } else {
          msg = 'Please fill in all four background information fields (education level, performance, budget, destination).';
        }
        if (subErr) {
          subErr.textContent = msg;
          subErr.classList.add('visible');
          var firstEmpty = requiredIds.map(function (id) { return document.getElementById(id); }).find(function (el) { return el && !el.value; });
          (firstEmpty || subErr).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     6. LOGIN VALIDATION
  ═══════════════════════════════════════════════════ */
  function initLoginForm() {
    var form = document.getElementById('loginForm');
    if (!form) return;
    var emailEl = document.getElementById('email');
    var pwdEl   = document.getElementById('password');
    var emailErr = document.getElementById('emailErr');
    var pwdErr   = document.getElementById('pwdErr');
    if (emailEl) emailEl.addEventListener('input', function () { emailEl.classList.remove('input-error'); if (emailErr) emailErr.classList.remove('visible'); });
    if (pwdEl)   pwdEl.addEventListener('input',   function () { pwdEl.classList.remove('input-error');   if (pwdErr)   pwdErr.classList.remove('visible'); });
    form.addEventListener('submit', function (e) {
      var valid = true;
      if (!emailEl || !emailEl.value.trim() || !emailEl.value.includes('@')) {
        if (emailEl)  emailEl.classList.add('input-error');
        if (emailErr) emailErr.classList.add('visible');
        valid = false;
      }
      if (!pwdEl || !pwdEl.value.trim()) {
        if (pwdEl)  pwdEl.classList.add('input-error');
        if (pwdErr) pwdErr.classList.add('visible');
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
  }

  /* ═══════════════════════════════════════════════════
     7. REGISTER VALIDATION
  ═══════════════════════════════════════════════════ */
  function initRegisterForm() {
    var form = document.getElementById('registerForm');
    if (!form) return;
    var emailEl = document.getElementById('email');
    var pwdEl   = document.getElementById('password');
    var emailErr = document.getElementById('emailErr');
    var pwdErr   = document.getElementById('pwdErr');
    if (emailEl) emailEl.addEventListener('input', function () { emailEl.classList.remove('input-error'); if (emailErr) emailErr.classList.remove('visible'); });
    if (pwdEl)   pwdEl.addEventListener('input',   function () { pwdEl.classList.remove('input-error');   if (pwdErr)   pwdErr.classList.remove('visible'); });
    form.addEventListener('submit', function (e) {
      var valid = true;
      ['first_name','last_name'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.value.trim()) { el.style.borderColor = 'var(--danger)'; valid = false; }
        else if (el) el.style.borderColor = '';
      });
      if (!emailEl || !emailEl.value.trim() || !emailEl.value.includes('@')) {
        if (emailEl)  emailEl.classList.add('input-error');
        if (emailErr) emailErr.classList.add('visible');
        valid = false;
      }
      if (!pwdEl || pwdEl.value.length < 8) {
        if (pwdEl)  pwdEl.classList.add('input-error');
        if (pwdErr) pwdErr.classList.add('visible');
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
  }

  /* ═══════════════════════════════════════════════════
     8. RIASEC BAR ANIMATION
  ═══════════════════════════════════════════════════ */
  function initBarAnimation() {
    var bars    = document.querySelectorAll('.bar-fill');
    var hcBars  = document.querySelectorAll('.hc-bar-fill');
    var all     = Array.prototype.slice.call(bars).concat(Array.prototype.slice.call(hcBars));
    if (all.length === 0) return;
    var targets = [];
    all.forEach(function (bar, i) { targets[i] = bar.style.width || '0%'; bar.style.width = '0%'; });
    requestAnimationFrame(function () {
      setTimeout(function () { all.forEach(function (bar, i) { bar.style.width = targets[i]; }); }, 150);
    });
  }

  /* ═══════════════════════════════════════════════════
     9. SCROLL REVEAL
  ═══════════════════════════════════════════════════ */
  function initScrollReveal() {
    if (!window.IntersectionObserver) return;
    var targets = document.querySelectorAll('.feat-card, .stat-card, .step, .career-chip, .country-card, .career-chip-full, .history-card');
    if (targets.length === 0) return;
    targets.forEach(function (el) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(12px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ═══════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════ */
  ready(function () {
    initTheme();
    initFlash();
    initLikert();
    initAssessForm();
    initLoginForm();
    initRegisterForm();
    initBarAnimation();
    initScrollReveal();
  });

})();

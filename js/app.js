/**
 * Shared Utilities — Aryans Resource Portal
 * ==========================================
 * Header scroll, mobile nav, scroll-to-top,
 * scroll animations, and common DOM helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollToTop();
  initScrollAnimations();
  setActiveNav();
});

/* ---------- MOBILE NAVIGATION ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.nav-overlay');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ---------- SCROLL TO TOP ---------- */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ---------- ACTIVE NAV LINK ---------- */
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefClean = href.replace('../', '').replace('./', '');
    if (path.endsWith(hrefClean) || (hrefClean === 'index.html' && (path === '/' || path.endsWith('/')))) {
      link.classList.add('active');
    }
  });
}

/* ---------- HELPERS ---------- */
function createSpinner(text) {
  return '<div class="spinner-container"><div class="spinner"></div><p class="spinner-text">' + (text || 'Loading...') + '</p></div>';
}

function createEmptyState(iconHtml, title, text) {
  return '<div class="empty-state"><div class="empty-icon">' + iconHtml + '</div><h3>' + title + '</h3><p>' + text + '</p></div>';
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* getGDriveDownloadLink and getFileViewLink are defined in firebase-config.js */

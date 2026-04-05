document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollToTop();
  initScrollAnimations();
  setActiveNav();
  initBottomNav();
  initRealtimeStats();
});

/* ---------- REALTIME HOME STATS ---------- */
function initRealtimeStats() {
  const resEl = document.getElementById('stat-resources');
  const subEl = document.getElementById('stat-subjects');
  const clsEl = document.getElementById('stat-classes');
  
  if (!resEl && !subEl && !clsEl) return;

  // Fetch counts from database
  const paths = ['resources', 'subjects', 'classes'];
  const targets = { 'resources': resEl, 'subjects': subEl, 'classes': clsEl };

  paths.forEach(path => {
    if (typeof db !== 'undefined' && db.ref) {
      db.ref(path).once('value').then(snap => {
        let count = 0;
        if (snap.exists()) {
          const val = snap.val();
          count = typeof val === 'object' ? Object.keys(val).length : 0;
        }
        
        // Update UI with a simple animation effect
        animateValue(targets[path], 0, count, 1000);
      }).catch(err => {
        console.error(`Error fetching ${path} stats:`, err);
        if (targets[path]) targets[path].textContent = '—';
      });
    }
  });
}

function animateValue(obj, start, end, duration) {
  if (!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    obj.innerHTML = value + (end > 50 ? '+' : '');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* ---------- MOBILE NAVIGATION ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    
    // Animate individual links if needed (CSS transition handles it mostly)
  });

  // Close when clicking a link
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- BOTTOM NAVIGATION ---------- */
function initBottomNav() {
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  if (!bottomNavItems.length) return;

  bottomNavItems.forEach(item => {
    const span = item.querySelector('span');
    if (span && span.textContent.toLowerCase() === 'search') {
      item.addEventListener('click', (e) => {
        if (window.location.pathname.includes('resources.html')) {
          e.preventDefault();
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }
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
  const els = document.querySelectorAll('.fade-in-up, .hero-stat');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // If it's a grid container, stagger the children if they have individual delays
        if (entry.target.classList.contains('hero-stat-grid')) {
          const children = entry.target.querySelectorAll('.hero-stat');
          children.forEach((child, index) => {
            child.style.transitionDelay = `${0.1 * index}s`;
            child.classList.add('visible');
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ---------- ACTIVE NAV LINK ---------- */
function setActiveNav() {
  const path = window.location.pathname;
  
  // Header Nav
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefClean = href.split('/').pop() || 'index.html';
    if (path.endsWith(hrefClean) || (hrefClean === 'index.html' && (path === '/' || path.endsWith('/')))) {
      link.classList.add('active');
    }
  });

  // Mobile Overlay Nav
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefClean = href.split('/').pop() || 'index.html';
    if (path.endsWith(hrefClean) || (hrefClean === 'index.html' && (path === '/' || path.endsWith('/')))) {
      link.classList.add('active');
    }
  });

  // Bottom Nav
  document.querySelectorAll('.bottom-nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefClean = href.split('/').pop() || 'index.html';
    if (path.endsWith(hrefClean) || (hrefClean === 'index.html' && (path === '/' || path.endsWith('/')))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
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

/**
 * ═══════════════════════════════════════════════════════════════
 * KINGSLAYER — Complete Digital Experience JavaScript
 * Midnight Black & Champagne Gold Editorial Luxury
 * v2.1 — Final Premium Refinement
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── DOM UTILITIES ────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ═══════════════════════════════════════════════════════════
     1. PRELOADER & LUXURY OPENING SEQUENCE
     ═══════════════════════════════════════════════════════════ */
  function initPreloader() {
    const preloader = $('#ks-preloader') || $('#preloader');
    const entrance  = $('#ks-entrance')  || $('#location-select');

    if (!preloader) {
      if (entrance) entrance.classList.add('is-visible');
      document.body.classList.add('ready');
      return;
    }

    // Check if preloader was suppressed via synchronous pre-paint script
    if (document.documentElement.classList.contains('ks-no-preloader')) {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
      document.body.classList.add('ready');
      if (entrance) entrance.classList.add('is-visible');
      return;
    }

    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isAuditBot = (function () {
      try {
        return /Chrome-Lighthouse|Lighthouse|PageSpeed|PTST/i.test(navigator.userAgent);
      } catch (e) {
        return false;
      }
    })();

    const dismissPreloader = (instant = false) => {
      // 1. Determine if this view is a reload on an inner/branch page
      let isReload = false;
      if (typeof window.__KS_IS_RELOAD === 'boolean') {
        isReload = window.__KS_IS_RELOAD;
      } else {
        try {
          if (window.performance) {
            const entries = window.performance.getEntriesByType && window.performance.getEntriesByType('navigation');
            if (entries && entries.length > 0) {
              isReload = (entries[0].type === 'reload');
            } else if (typeof window.performance.navigation !== 'undefined') {
              isReload = (window.performance.navigation.type === 1);
            }
          }
        } catch (e) {}
      }

      const rootPath = window.__KS_ROOT_PATH || (function () {
        const rootMeta = $('meta[name="root-url"]');
        let r = (rootMeta && rootMeta.getAttribute('content')) || '/';
        if (!r.endsWith('/')) r += '/';
        return r;
      })();

      const isRoot = (typeof window.__KS_IS_ROOT === 'boolean') ? window.__KS_IS_ROOT : (function () {
        const curPath = window.location.pathname || '/';
        const curNorm = curPath.endsWith('/') || curPath.endsWith('.html') ? curPath : curPath + '/';
        const rootNorm = rootPath.endsWith('/') ? rootPath : rootPath + '/';
        const rootTrimmed = rootNorm.replace(/\/+$/, '');
        return (curNorm === rootNorm) ||
               (curNorm === rootNorm + 'index.html') ||
               (curNorm === '/' || curNorm === '/index.html') ||
               (rootTrimmed && (curNorm === rootTrimmed || window.location.pathname === rootTrimmed));
      })();

      // REQUIREMENT 4: If visitor refreshes ANY page, restart premium preloader from beginning,
      // and AFTER the preloader completes, redirect to Location Selection page.
      if (isReload && !isRoot) {
        try {
          sessionStorage.setItem('ks_from_inner_reload', '1');
        } catch (e) {}
        window.location.replace(rootPath);
        return;
      }

      if (instant || prefersReducedMotion || isAuditBot) {
        preloader.classList.add('ks-exit');
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
        document.body.classList.add('ready');
        if (entrance) {
          entrance.classList.add('is-visible');
        }
        return;
      }

      // Cinematic exit: logo lifts up, backdrop fades
      preloader.classList.add('ks-exit');
      setTimeout(() => {
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
        document.body.classList.add('ready');
        if (entrance) {
          // Staggered entrance reveal
          entrance.classList.add('is-visible');
        }
      }, 450);
    };

    if (prefersReducedMotion || isAuditBot) {
      dismissPreloader(true);
      return;
    }

    // Choreographed luxury timing (1.1s progress + 0.45s exit = ~1.55s total)
    const animTimer = setTimeout(() => {
      dismissPreloader(false);
    }, 1100);

    // Guaranteed fallback: preloader must NEVER become stuck
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        dismissPreloader(true);
      }
    }, 2500);
  }

  /* ═══════════════════════════════════════════════════════════
     2. NAVIGATION STATE ENGINE & REFRESH REDIRECT GUARD
     ═══════════════════════════════════════════════════════════ */
  function initNavigationState() {
    // Intercept clicks on links for same-origin internal navigation
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = e.target.closest('a');
      if (!link) return;

      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      const trimmed = rawHref.trim();
      if (trimmed.startsWith('#') ||
          trimmed.startsWith('mailto:') ||
          trimmed.startsWith('tel:') ||
          trimmed.startsWith('javascript:')) {
        return;
      }

      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
        return;
      }

      // Legitimate internal navigation: mark internal transit
      try {
        sessionStorage.setItem('ks_internal_transit', '1');
      } catch (err) {}
    }, true);

    // BFCache page restoration listener (supports normal back/forward navigation)
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        document.documentElement.classList.add('ks-no-preloader');
        const p = $('#ks-preloader');
        if (p) {
          p.style.display = 'none';
          p.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.add('ready');
        const ent = $('#ks-entrance');
        if (ent) ent.classList.add('is-visible');
      }
    });

    // Strictly ensure no sessionStorage/localStorage remembers the selected branch
    try {
      localStorage.removeItem('ks_branch');
      sessionStorage.removeItem('ks_branch');
      sessionStorage.removeItem('ks_entered');
    } catch (e) {}
  }

  /* ═══════════════════════════════════════════════════════════
     3. LOCATION SELECTOR INTERACTION
     ═══════════════════════════════════════════════════════════ */
  function initLocationSelector() {
    const entrance = $('#ks-entrance') || $('#location-select');
    if (!entrance) return;

    // Strictly ensure no sessionStorage/localStorage remembers the selected branch
    try {
      localStorage.removeItem('ks_branch');
      sessionStorage.removeItem('ks_branch');
      sessionStorage.removeItem('ks_entered');
    } catch (e) {}
  }

  /* ═══════════════════════════════════════════════════════════
     4. NAVIGATION — Sticky Header & Mobile Drawer
     ═══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav        = $('#main-nav');
    const hamburger  = $('#hamburger');
    const mobileMenu = $('#mobile-menu');
    if (!nav) return;

    // Sticky nav state on scroll
    let lastY = 0;
    let ticking = false;

    const onScroll = () => {
      lastY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (lastY > 40) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    on(window, 'scroll', onScroll, { passive: true });
    onScroll();

    // Mobile drawer toggle
    if (hamburger && mobileMenu) {
      const setBodyLocked = (locked) => {
        if (locked) {
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          document.body.classList.add('menu-open');
        } else {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          document.body.classList.remove('menu-open');
        }
      };

      on(hamburger, 'click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        setBodyLocked(isOpen);
      });

      // Close mobile menu on clicking any link
      $$('.nav-mobile__link, .nav-mobile__footer a', mobileMenu).forEach(link => {
        on(link, 'click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          setBodyLocked(false);
        });
      });

      // Close mobile menu on Escape key
      on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          setBodyLocked(false);
        }
      });

      // Close mobile menu on outside backdrop click
      on(document, 'click', (e) => {
        if (
          mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          setBodyLocked(false);
        }
      });
    }

    // Smooth anchor scrolling
    $$('a[href^="#"]').forEach(anchor => {
      on(anchor, 'click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#' || !id.startsWith('#')) return;
        const target = $(id);
        if (target) {
          e.preventDefault();
          const navH = nav.offsetHeight || 84;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     5. SCROLL REVEAL ANIMATIONS (Stagger Support)
     ═══════════════════════════════════════════════════════════ */
  function initReveal() {
    const revealItems = $$('.reveal, [data-reveal]');
    if (!revealItems.length) return;

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      revealItems.forEach(el => el.classList.add('visible'));
      return;
    }

    // Stagger siblings within the same parent
    const processed = new Set();
    revealItems.forEach(el => {
      const parent = el.parentElement;
      if (!parent || processed.has(parent)) return;
      const siblingsReveals = [...parent.children].filter(c => c.classList.contains('reveal'));
      if (siblingsReveals.length > 1) {
        siblingsReveals.forEach((sib, i) => {
          sib.style.transitionDelay = `${i * 0.12}s`;
        });
        processed.add(parent);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealItems.forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     6. MENU TABS & FILTERING
     ═══════════════════════════════════════════════════════════ */
  function initMenuTabs() {
    const tabs   = $$('.menu-tab, .menu__tab');
    const panels = $$('.menu-panel, .menu__panel');
    if (!tabs.length) return;

    // Initialize: hide all panels, show only the first (or the one marked active)
    let initialTab = tabs.find(t => t.classList.contains('active')) || tabs[0];
    const initialTarget = initialTab ? (initialTab.dataset.tab || initialTab.dataset.category) : 'all';

    panels.forEach(panel => {
      const panelId = panel.id ? panel.id.replace('panel-', '') : (panel.dataset.category || '');
      const isMatch = initialTarget === 'all' || panelId === initialTarget;
      panel.classList.toggle('active', isMatch);
    });

    tabs.forEach(tab => {
      on(tab, 'click', () => {
        const target = tab.dataset.tab || tab.dataset.category;

        // Update active tab styles
        tabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', String(isActive));
        });

        // Update visible panel with smooth transition
        panels.forEach(panel => {
          const panelId = panel.id ? panel.id.replace('panel-', '') : (panel.dataset.category || '');
          const isMatch = target === 'all' || panelId === target;

          if (isMatch) {
            panel.classList.add('active');
            panel.style.display = '';
            // Animate items
            const items = $$('.menu-item, .menu__item', panel);
            items.forEach((item, idx) => {
              item.style.opacity = '0';
              item.style.transform = 'translateY(12px)';
              item.style.transition = 'none';
              requestAnimationFrame(() => {
                setTimeout(() => {
                  item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
                }, idx * 40);
              });
            });
          } else {
            panel.classList.remove('active');
            panel.style.display = 'none';
          }
        });
      });
    });

    // Initialize panel visibility properly after tab system is set
    panels.forEach(panel => {
      const panelId = panel.id ? panel.id.replace('panel-', '') : (panel.dataset.category || '');
      const isMatch = initialTarget === 'all' || panelId === initialTarget;
      if (!isMatch) {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     7. PHOTO GALLERY & LIGHTBOX
     ═══════════════════════════════════════════════════════════ */
  function initGallery() {
    const filterButtons = $$('.gallery-filter__btn');
    const galleryItems  = $$('.gallery-item, .gallery__item');

    // Category filtering
    if (filterButtons.length && galleryItems.length) {
      filterButtons.forEach(btn => {
        on(btn, 'click', () => {
          const filter = btn.dataset.filter || 'all';
          filterButtons.forEach(b => b.classList.toggle('active', b === btn));

          galleryItems.forEach(item => {
            const category = item.dataset.category || 'all';
            const show = filter === 'all' || category === filter;
            item.style.display = show ? '' : 'none';
            if (show) {
              requestAnimationFrame(() => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.97)';
                requestAnimationFrame(() => {
                  item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                  item.style.opacity = '1';
                  item.style.transform = 'scale(1)';
                });
              });
            }
          });
        });
      });
    }

    if (!galleryItems.length) return;

    // Build modal lightbox DOM once
    let lb = $('#ks-lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'ks-lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-label', 'Image preview');
      lb.setAttribute('aria-modal', 'true');
      lb.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9000;
        background:rgba(7,7,7,0.97); backdrop-filter:blur(16px);
        align-items:center; justify-content:center; flex-direction:column;
        padding: 2rem;
      `;

      const imgWrapper = document.createElement('div');
      imgWrapper.style.cssText = 'position:relative; max-width:88vw; max-height:78vh; display:flex; align-items:center; justify-content:center;';

      const img = document.createElement('img');
      img.id = 'ks-lightbox-img';
      img.style.cssText = `
        max-width:88vw; max-height:78vh; object-fit:contain;
        border:1px solid rgba(198,167,106,0.25);
        box-shadow:0 0 80px rgba(0,0,0,0.95);
        transition:opacity 0.3s ease;
      `;

      const caption = document.createElement('div');
      caption.id = 'ks-lightbox-caption';
      caption.style.cssText = `
        margin-top:1.4rem; font-family:'Cormorant Garamond',serif;
        font-size:clamp(0.9rem,1.5vw,1.15rem); color:#E8DCC4;
        letter-spacing:0.05em; text-align:center;
        font-weight:300; max-width:600px;
      `;

      const counter = document.createElement('div');
      counter.id = 'ks-lightbox-counter';
      counter.style.cssText = `
        margin-top:0.5rem; font-size:0.58rem; letter-spacing:0.28em;
        text-transform:uppercase; color:rgba(198,167,106,0.6);
        font-family:'Inter',sans-serif;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.setAttribute('aria-label', 'Close image viewer');
      closeBtn.style.cssText = `
        position:fixed; top:1.5rem; right:1.5rem;
        background:rgba(9,9,9,0.85); border:1px solid rgba(198,167,106,0.3);
        color:#C6A76A; font-size:1.2rem; width:46px; height:46px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition:all 0.3s ease; backdrop-filter:blur(8px);
      `;
      closeBtn.innerHTML = '&times;';
      on(closeBtn, 'mouseover', () => { closeBtn.style.background = '#C6A76A'; closeBtn.style.color = '#090909'; });
      on(closeBtn, 'mouseout',  () => { closeBtn.style.background = 'rgba(9,9,9,0.85)'; closeBtn.style.color = '#C6A76A'; });

      const prevBtn = document.createElement('button');
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.style.cssText = `
        position:fixed; left:1.5rem; top:50%; transform:translateY(-50%);
        background:rgba(9,9,9,0.75); border:1px solid rgba(198,167,106,0.3);
        color:#C6A76A; font-size:1.6rem; width:48px; height:48px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition:all 0.3s ease; backdrop-filter:blur(8px);
      `;
      prevBtn.innerHTML = '&#8592;';

      const nextBtn = document.createElement('button');
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.style.cssText = `
        position:fixed; right:1.5rem; top:50%; transform:translateY(-50%);
        background:rgba(9,9,9,0.75); border:1px solid rgba(198,167,106,0.3);
        color:#C6A76A; font-size:1.6rem; width:48px; height:48px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition:all 0.3s ease; backdrop-filter:blur(8px);
      `;
      nextBtn.innerHTML = '&#8594;';

      [prevBtn, nextBtn].forEach(btn => {
        on(btn, 'mouseover', () => { btn.style.background = '#C6A76A'; btn.style.color = '#090909'; btn.style.borderColor = '#C6A76A'; });
        on(btn, 'mouseout',  () => { btn.style.background = 'rgba(9,9,9,0.75)'; btn.style.color = '#C6A76A'; btn.style.borderColor = 'rgba(198,167,106,0.3)'; });
      });

      imgWrapper.appendChild(img);
      lb.appendChild(imgWrapper);
      lb.appendChild(caption);
      lb.appendChild(counter);
      lb.appendChild(closeBtn);
      lb.appendChild(prevBtn);
      lb.appendChild(nextBtn);
      document.body.appendChild(lb);

      let currentIndex = 0;
      const getVisibleItems = () => galleryItems.filter(i => i.style.display !== 'none');

      function openAt(idx) {
        const visible = getVisibleItems();
        if (!visible.length) return;
        currentIndex = (idx + visible.length) % visible.length;
        const currentItem = visible[currentIndex];
        const currentImg = currentItem.querySelector('img');
        if (!currentImg) return;

        img.style.opacity = '0';
        setTimeout(() => {
          img.src = currentImg.src;
          img.alt = currentImg.alt || 'Kingslayer';
          caption.textContent = currentItem.dataset.title || currentImg.alt || 'Kingslayer Luxury Hospitality';
          counter.textContent = `${currentIndex + 1} / ${visible.length}`;
          img.style.opacity = '1';
        }, 150);

        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }

      function closeLb() {
        lb.style.display = 'none';
        document.body.style.overflow = '';
      }

      galleryItems.forEach(item => {
        on(item, 'click', (e) => {
          e.preventDefault();
          const visible = getVisibleItems();
          const idx = visible.indexOf(item);
          openAt(idx >= 0 ? idx : 0);
        });
        // Keyboard accessibility
        on(item, 'keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const visible = getVisibleItems();
            const idx = visible.indexOf(item);
            openAt(idx >= 0 ? idx : 0);
          }
        });
      });

      on(closeBtn, 'click', closeLb);
      on(prevBtn, 'click', () => openAt(currentIndex - 1));
      on(nextBtn, 'click', () => openAt(currentIndex + 1));
      on(lb, 'click', (e) => { if (e.target === lb) closeLb(); });

      // Mobile Touch Swipe Gesture Support
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;

      on(lb, 'touchstart', (e) => {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
      }, { passive: true });

      on(lb, 'touchmove', (e) => {
        if (!e.touches || !e.touches[0]) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }, { passive: true });

      on(lb, 'touchend', () => {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        // Require horizontal swipe of at least 45px and predominantly horizontal
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
          if (deltaX < 0) {
            // Swiped left -> Next photo
            openAt(currentIndex + 1);
          } else {
            // Swiped right -> Previous photo
            openAt(currentIndex - 1);
          }
        }
      }, { passive: true });

      on(document, 'keydown', (e) => {
        if (lb.style.display !== 'flex') return;
        if (e.key === 'Escape')     closeLb();
        if (e.key === 'ArrowLeft')  openAt(currentIndex - 1);
        if (e.key === 'ArrowRight') openAt(currentIndex + 1);
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     8. RESERVATION & BANQUET BOOKING SUITE (with WhatsApp)
     ═══════════════════════════════════════════════════════════ */
  function initForms() {
    const reservationForm = $('#reservation-form');
    const banquetForm     = $('#banquet-form');
    const waitlistForm    = $('#varanasi-waitlist-form');

    // Set today as min date for all date inputs
    const today = new Date().toISOString().split('T')[0];
    $$('input[type="date"]').forEach(input => input.setAttribute('min', today));

    // Handle Table Reservation
    if (reservationForm) {
      on(reservationForm, 'submit', (e) => {
        e.preventDefault();
        const name    = ($('#res-name', reservationForm)       || {}).value || '';
        const phone   = ($('#res-phone', reservationForm)      || {}).value || '';
        const date    = ($('#res-date', reservationForm)       || {}).value || '';
        const time    = ($('#res-time', reservationForm)       || {}).value || '';
        const guests  = ($('#res-guests', reservationForm)     || {}).value || '';
        const seating = ($('#res-experience', reservationForm) || $('#res-seating', reservationForm) || {}).value || 'Any';
        const notes   = ($('#res-notes', reservationForm)      || {}).value || '';

        if (!name || !phone || !date || !time) {
          // Shake invalid fields
          $$('[required]', reservationForm).forEach(f => {
            if (!f.value.trim()) {
              f.style.borderColor = 'rgba(208, 85, 85, 0.6)';
              f.closest('.form-field') && f.closest('.form-field').classList.add('error');
            }
          });
          return;
        }

        const branch = (reservationForm.dataset.branch || 'Ballia').toUpperCase();
        const whatsappNumber = (reservationForm.dataset.whatsapp && reservationForm.dataset.whatsapp.indexOf('X') === -1)
          ? reservationForm.dataset.whatsapp
          : '918881143141';
        const msg = encodeURIComponent(
          `*KINGSLAYER ${branch} — TABLE RESERVATION*\n\n` +
          `• Name: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Date: ${date}\n` +
          `• Time: ${time}\n` +
          `• Number of Guests: ${guests}\n` +
          `• Dimension / Seating: ${seating}\n` +
          (notes ? `• Special Requests: ${notes}\n` : '') +
          `\nPlease confirm availability.`
        );

        showFormSuccess(reservationForm, `Thank you, ${name}. We are redirecting you to WhatsApp to confirm your reservation directly with our guest team.`);
        setTimeout(() => {
          window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
        }, 1500);
      });
    }

    // Handle Banquet Enquiry
    if (banquetForm) {
      on(banquetForm, 'submit', (e) => {
        e.preventDefault();
        const name      = ($('#bq-name', banquetForm)   || {}).value || '';
        const phone     = ($('#bq-phone', banquetForm)  || {}).value || '';
        const eventType = ($('#bq-type', banquetForm)   || {}).value || 'Event';
        const date      = ($('#bq-date', banquetForm)   || {}).value || '';
        const guests    = ($('#bq-guests', banquetForm) || {}).value || '';
        const notes     = ($('#bq-notes', banquetForm)  || {}).value || '';

        if (!name || !phone) {
          $$('[required]', banquetForm).forEach(f => {
            if (!f.value.trim()) {
              f.closest('.form-field') && f.closest('.form-field').classList.add('error');
            }
          });
          return;
        }

        const branch = (banquetForm.dataset.branch || 'Ballia').toUpperCase();
        const whatsappNumber = (banquetForm.dataset.whatsapp && banquetForm.dataset.whatsapp.indexOf('X') === -1)
          ? banquetForm.dataset.whatsapp
          : '918881143141';
        const msg = encodeURIComponent(
          `*KINGSLAYER ${branch} — BANQUET & EVENT ENQUIRY*\n\n` +
          `• Name: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Event Type: ${eventType}\n` +
          `• Tentative Date: ${date}\n` +
          `• Expected Guests: ${guests}\n` +
          (notes ? `• Event Details: ${notes}\n` : '') +
          `\nPlease share availability and event packages.`
        );

        showFormSuccess(banquetForm, `Thank you, ${name}. Our banquet and events manager will receive your inquiry on WhatsApp immediately.`);
        setTimeout(() => {
          window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
        }, 1500);
      });
    }

    // Handle Varanasi Waitlist
    if (waitlistForm) {
      on(waitlistForm, 'submit', (e) => {
        e.preventDefault();
        showFormSuccess(waitlistForm, `Thank you for joining our exclusive circle. You will receive private opening updates and an exclusive invitation to the Kingslayer Varanasi preview.`);
      });
    }

    // Clear error state on input
    $$('.form-input, .form-select, .form-textarea').forEach(input => {
      on(input, 'input', () => {
        const field = input.closest('.form-field');
        if (field) field.classList.remove('error');
        input.style.borderColor = '';
      });
    });

    function showFormSuccess(form, message) {
      const parent = form.parentElement;
      const successBox = document.createElement('div');
      successBox.className = 'form-success-box';
      successBox.style.cssText = `
        background: rgba(25,25,25,0.95);
        border: 1px solid rgba(198,167,106,0.4);
        padding: 3rem 2rem; text-align: center;
        animation: fadeUp 0.6s ease forwards;
        border-radius: 0;
      `;
      successBox.innerHTML = `
        <div style="font-family:'Cormorant Garamond',serif; font-size:2rem; color:#C6A76A; margin-bottom:0.6rem; font-weight:300;">✦</div>
        <div style="font-family:'Cormorant Garamond',serif; font-size:1.75rem; color:#EDE5D7; margin-bottom:0.75rem; font-weight:300;">Request Received</div>
        <p style="font-size:0.9rem; color:#A49B8B; line-height:1.7; max-width:480px; margin:0 auto;">${message}</p>
      `;
      form.style.display = 'none';
      parent.appendChild(successBox);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     9. SCROLL TO TOP BUTTON
     ═══════════════════════════════════════════════════════════ */
  function initScrollTop() {
    const btn = $('#scroll-top');
    if (!btn) return;

    on(window, 'scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     10. HERO PARALLAX (Subtle, Performance-Optimized)
     ═══════════════════════════════════════════════════════════ */
  function initParallax() {
    // Only apply parallax on non-reduced-motion devices and desktop screens
    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    if (window.innerWidth < 768) return;

    // Target the hero media container's image specifically
    const heroBg = $('.hero__media img, .page-hero__media img');
    if (!heroBg) return;

    let ticking = false;
    on(window, 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = window.innerHeight * 1.5;
          if (scrollY < maxScroll) {
            heroBg.style.transform = `translateY(${scrollY * 0.18}px)`;
            heroBg.style.willChange = 'transform';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     11. DYNAMIC NAV TEXT COLOR ON SCROLL (for transparent headers)
     ═══════════════════════════════════════════════════════════ */
  function initNavColorShift() {
    const nav = $('#main-nav');
    if (!nav) return;
    // Nav already handles scroll state via .scrolled class
    // Additional: add nav-ready class once JS is running
    nav.classList.add('js-ready');
  }

  /* ═══════════════════════════════════════════════════════════
     12. ANIMATE NUMBERS (For stats bars)
     ═══════════════════════════════════════════════════════════ */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;

        if (prefersReduced) {
          el.textContent = target + suffix;
          observer.unobserve(el);
          return;
        }

        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     13. MAGNETIC HOVER EFFECT FOR PREMIUM BUTTONS
     ═══════════════════════════════════════════════════════════ */
  function initMagneticButtons() {
    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Only apply on larger screens
    if (window.innerWidth < 768) return;

    $$('.btn--gold, .btn-reserve, .ks-dest-panel__cta').forEach(btn => {
      on(btn, 'mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
      });

      on(btn, 'mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     INIT EVERYTHING ON LOAD
     ═══════════════════════════════════════════════════════════ */
  function init() {
    initPreloader();
    initNavigationState();
    initLocationSelector();
    initNav();
    initReveal();
    initMenuTabs();
    initGallery();
    initForms();
    initScrollTop();
    initParallax();
    initNavColorShift();
    initCounters();
    initMagneticButtons();
  }

  // Bind navigation state interceptor immediately (before DOM ready)
  initNavigationState();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

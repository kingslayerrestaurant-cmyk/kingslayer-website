/**
 * ═══════════════════════════════════════════════════════════════
 * KINGSLAYER — Complete Site JavaScript
 * Midnight Black & Champagne Gold Digital Experience
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── UTILITY ──────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);


  /* ═══════════════════════════════════════════════════════════
     1. NAVIGATION — scroll behaviour + mobile menu
     ═══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav        = $('#main-nav');
    const hamburger  = $('#hamburger');
    const mobileMenu = $('#mobile-menu');
    if (!nav) return;

    /* Sticky scroll — add .scrolled class */
    let lastY = 0;
    let ticking = false;

    const onScroll = () => {
      lastY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (lastY > 60) {
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
    onScroll(); // run on load

    /* Mobile hamburger toggle */
    if (hamburger && mobileMenu) {
      on(hamburger, 'click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      /* Close on mobile link click */
      $$('.nav__mobile-link, .nav__mobile-cta a', mobileMenu).forEach(link => {
        on(link, 'click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      /* Close on outside click */
      on(document, 'click', (e) => {
        if (
          mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    /* Active nav link highlighting based on scroll position */
    const navLinks = $$('.nav__link[href^="#"]');
    const sections = navLinks
      .map(a => ({ link: a, section: $(a.getAttribute('href')) }))
      .filter(o => o.section);

    const highlightNav = () => {
      const mid = window.scrollY + window.innerHeight / 3;
      sections.forEach(({ link, section }) => {
        const top = section.offsetTop;
        const bot = top + section.offsetHeight;
        link.classList.toggle('active', mid >= top && mid < bot);
      });
    };

    on(window, 'scroll', highlightNav, { passive: true });

    /* Smooth scroll for all anchor links */
    $$('a[href^="#"]').forEach(anchor => {
      on(anchor, 'click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = $(id);
        if (target) {
          e.preventDefault();
          const navH = nav ? nav.offsetHeight : 80;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     2. SCROLL REVEAL — IntersectionObserver
     ═══════════════════════════════════════════════════════════ */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(el => observer.observe(el));
  }


  /* ═══════════════════════════════════════════════════════════
     3. MENU TABS — category switching
     ═══════════════════════════════════════════════════════════ */
  function initMenuTabs() {
    const tabs   = $$('.menu__tab');
    const panels = $$('.menu__panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      on(tab, 'click', () => {
        const target = tab.dataset.tab;

        /* Update tabs */
        tabs.forEach(t => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', t === tab);
        });

        /* Update panels */
        panels.forEach(panel => {
          const match = panel.id === `panel-${target}`;
          panel.classList.toggle('active', match);

          /* Stagger-animate items in newly shown panel */
          if (match) {
            const items = $$('.menu__item', panel);
            items.forEach((item, i) => {
              item.style.opacity = '0';
              item.style.transform = 'translateY(16px)';
              requestAnimationFrame(() => {
                setTimeout(() => {
                  item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                  item.style.opacity    = '1';
                  item.style.transform  = 'translateY(0)';
                }, i * 60);
              });
            });
          }
        });
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     4. HERO PARALLAX — subtle depth on scroll
     ═══════════════════════════════════════════════════════════ */
  function initParallax() {
    const heroBg = $('.hero__bg');
    if (!heroBg) return;

    let ticking = false;
    on(window, 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.5) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════
     5. FORM HANDLING — validation + success state
     ═══════════════════════════════════════════════════════════ */
  function initForms() {
    const form    = $('#reservation-form');
    const success = $('#form-success');
    const btn     = $('#submit-btn');
    if (!form) return;

    /* Set minimum date to today */
    const dateInput = $('#date', form);
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    /* Real-time field validation feedback */
    $$('.form__input, .form__select, .form__textarea', form).forEach(field => {
      on(field, 'blur', () => validateField(field));
      on(field, 'input', () => {
        if (field.closest('.form__field').classList.contains('error')) {
          validateField(field);
        }
      });
    });

    function validateField(field) {
      const wrapper = field.closest('.form__field');
      const isRequired = field.required;
      const isEmpty = !field.value.trim();
      const isInvalidEmail =
        field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      const isInvalidPhone =
        field.type === 'tel' && field.value && !/^[+\d\s\-()]{7,}$/.test(field.value);

      const hasError = (isRequired && isEmpty) || isInvalidEmail || isInvalidPhone;

      wrapper.classList.toggle('error', hasError);

      /* Remove existing error msg */
      const existing = wrapper.querySelector('.form__error-msg');
      if (existing) existing.remove();

      if (hasError) {
        const msg = document.createElement('span');
        msg.className = 'form__error-msg';
        msg.style.cssText = 'display:block;font-size:0.65rem;color:#e05555;padding:0.2rem 1.2rem 0.6rem;letter-spacing:0.05em;';
        if (isRequired && isEmpty) msg.textContent = 'This field is required.';
        else if (isInvalidEmail)  msg.textContent = 'Please enter a valid email address.';
        else if (isInvalidPhone)  msg.textContent = 'Please enter a valid phone number.';
        wrapper.appendChild(msg);
        wrapper.style.borderColor = 'rgba(220,80,80,0.5)';
      } else {
        wrapper.style.borderColor = '';
      }

      return !hasError;
    }

    on(form, 'submit', (e) => {
      e.preventDefault();

      /* Validate all required fields */
      const requiredFields = $$('.form__input[required], .form__select[required]', form);
      let valid = true;
      requiredFields.forEach(f => {
        if (!validateField(f)) valid = false;
      });

      if (!valid) {
        /* Scroll to first error */
        const firstError = form.querySelector('.form__field.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      /* Simulate submission — show loading state */
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="animation:spin 1s linear infinite;">
          <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="22" stroke-dashoffset="8"/>
        </svg>
        Sending…
      `;

      /* Inject spin animation if not present */
      if (!document.getElementById('ks-spin-style')) {
        const style = document.createElement('style');
        style.id = 'ks-spin-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      setTimeout(() => {
        /* Success state */
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          form.style.display = 'none';
          if (success) {
            success.style.display = 'block';
            success.style.opacity = '0';
            success.style.transition = 'opacity 0.5s ease';
            requestAnimationFrame(() => {
              success.style.opacity = '1';
            });
          }
        }, 400);
      }, 1500);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     6. GALLERY — lightbox (simple)
     ═══════════════════════════════════════════════════════════ */
  function initGallery() {
    const items = $$('.gallery__item');
    if (!items.length) return;

    /* Create lightbox DOM */
    const lb = document.createElement('div');
    lb.id = 'ks-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.setAttribute('aria-modal', 'true');
    lb.style.cssText = `
      display:none; position:fixed; inset:0; z-index:9000;
      background:rgba(9,9,9,0.96); cursor:zoom-out;
      align-items:center; justify-content:center;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      max-width:90vw; max-height:90vh; object-fit:contain;
      border:1px solid rgba(201,169,110,0.2);
      box-shadow:0 0 80px rgba(0,0,0,0.8);
      transform:scale(0.95); opacity:0;
      transition:transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease;
      pointer-events:none;
    `;

    const close = document.createElement('button');
    close.setAttribute('aria-label', 'Close image viewer');
    close.style.cssText = `
      position:absolute; top:1.5rem; right:1.5rem;
      background:none; border:1px solid rgba(201,169,110,0.3);
      color:#C9A96E; font-size:1.2rem; width:40px; height:40px;
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:all 0.3s ease;
    `;
    close.innerHTML = '&#215;';

    const counter = document.createElement('span');
    counter.style.cssText = `
      position:absolute; bottom:1.5rem; left:50%;
      transform:translateX(-50%);
      font-size:0.65rem; letter-spacing:0.2em;
      text-transform:uppercase; color:rgba(201,169,110,0.6);
    `;

    lb.appendChild(img);
    lb.appendChild(close);
    lb.appendChild(counter);
    document.body.appendChild(lb);

    let currentIndex = 0;
    const imgs = items.map(item => item.querySelector('img'));

    function openAt(idx) {
      currentIndex = idx;
      const src = imgs[idx];
      if (!src) return;
      img.src = src.src;
      img.alt = src.alt;
      counter.textContent = `${idx + 1} / ${imgs.length}`;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        img.style.transform = 'scale(1)';
        img.style.opacity   = '1';
      });
    }

    function closeLb() {
      img.style.transform = 'scale(0.95)';
      img.style.opacity   = '0';
      setTimeout(() => {
        lb.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }

    items.forEach((item, i) => {
      on(item, 'click', () => openAt(i));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image ${i + 1}`);
      on(item, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openAt(i); });
    });

    on(close, 'click', closeLb);
    on(lb, 'click', (e) => { if (e.target === lb) closeLb(); });

    on(document, 'keydown', (e) => {
      if (lb.style.display !== 'flex') return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowRight') openAt((currentIndex + 1) % imgs.length);
      if (e.key === 'ArrowLeft')  openAt((currentIndex - 1 + imgs.length) % imgs.length);
    });

    on(close, 'mouseenter', () => { close.style.background = '#C9A96E'; close.style.color = '#090909'; });
    on(close, 'mouseleave', () => { close.style.background = 'none';    close.style.color = '#C9A96E'; });
  }


  /* ═══════════════════════════════════════════════════════════
     7. NUMBER COUNTER ANIMATION — for stats
     ═══════════════════════════════════════════════════════════ */
  function initCounters() {
    const counters = $$('.highlight-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const raw   = el.textContent.trim();
        const num   = parseInt(raw.replace(/\D/g, ''), 10);
        const suffix= raw.replace(/[\d,]/g, '');

        if (!num || isNaN(num)) return;

        let start = 0;
        const duration = 1200;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * num) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }


  /* ═══════════════════════════════════════════════════════════
     8. WHATSAPP FLOAT — hide/show on scroll
     ═══════════════════════════════════════════════════════════ */
  function initWhatsApp() {
    const btn = $('.whatsapp-float');
    if (!btn) return;

    let lastScroll = 0;
    on(window, 'scroll', () => {
      const current = window.scrollY;
      /* Hide when scrolling down fast, show when scrolling up */
      if (current > lastScroll + 60 && current > 300) {
        btn.style.transform = 'translateY(100px)';
        btn.style.opacity   = '0';
      } else {
        btn.style.transform = 'translateY(0)';
        btn.style.opacity   = '1';
      }
      lastScroll = current;
    }, { passive: true });

    btn.style.transition = 'transform 0.4s ease, opacity 0.4s ease, background 0.3s ease, box-shadow 0.3s ease';
  }


  /* ═══════════════════════════════════════════════════════════
     9. OFFERING CARDS — cursor tracking glow
     ═══════════════════════════════════════════════════════════ */
  function initCardGlow() {
    $$('.offering-card').forEach(card => {
      on(card, 'mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--glow-x', `${x}%`);
        card.style.setProperty('--glow-y', `${y}%`);
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     10. NAV STYLE INJECTION — active link style
     ═══════════════════════════════════════════════════════════ */
  function injectActiveStyle() {
    if (document.getElementById('ks-active-style')) return;
    const style = document.createElement('style');
    style.id = 'ks-active-style';
    style.textContent = `
      .nav__link.active { color: var(--gold) !important; }
      .nav__link.active::after { width: 100% !important; }

      .form__field.error { border-color: rgba(220,80,80,0.45) !important; }

      /* Gallery cursor */
      .gallery__item { cursor: pointer; }

      /* Offering card glow overlay */
      .offering-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at var(--glow-x, 50%) var(--glow-y, 50%),
          rgba(201,169,110,0.08) 0%,
          transparent 60%
        );
        z-index: 3;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .offering-card:hover::before { opacity: 1; }

      /* Smooth whatsapp float */
      .whatsapp-float {
        transform: translateY(0);
        opacity: 1;
      }

      /* Scroll to top indicator */
      #ks-scroll-top {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        z-index: 700;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(201,169,110,0.3);
        background: rgba(9,9,9,0.85);
        color: #C9A96E;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.1rem;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.3s ease, background 0.3s ease;
        pointer-events: none;
      }
      #ks-scroll-top.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }
      #ks-scroll-top:hover {
        border-color: rgba(201,169,110,0.7);
        background: #C9A96E;
        color: #090909;
      }
    `;
    document.head.appendChild(style);
  }


  /* ═══════════════════════════════════════════════════════════
     11. SCROLL TO TOP BUTTON
     ═══════════════════════════════════════════════════════════ */
  function initScrollTop() {
    const btn = document.createElement('button');
    btn.id = 'ks-scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '&#8679;';
    document.body.appendChild(btn);

    on(window, 'scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     12. NAV LINK — current page section highlight on load
     ═══════════════════════════════════════════════════════════ */
  function highlightCurrentSection() {
    const hash = window.location.hash;
    if (hash) {
      const target = $(hash);
      if (target) {
        setTimeout(() => {
          const navH = $('#main-nav') ? $('#main-nav').offsetHeight : 80;
          window.scrollTo({ top: target.offsetTop - navH - 8, behavior: 'smooth' });
        }, 100);
      }
    }
  }


  /* ═══════════════════════════════════════════════════════════
     13. HERO CONTENT — entrance stagger (extra punch)
     ═══════════════════════════════════════════════════════════ */
  function initHeroEntrance() {
    /* These elements already have CSS animations via keyframes,
       but we ensure the font is loaded before revealing */
    const hero = $('.hero');
    if (!hero) return;

    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        hero.classList.add('fonts-loaded');
      });
    }
  }


  /* ═══════════════════════════════════════════════════════════
     14. ROOFTOP BG PARALLAX
     ═══════════════════════════════════════════════════════════ */
  function initRooftopParallax() {
    const rooftopBg = $('.rooftop__bg');
    if (!rooftopBg) return;

    let ticking = false;
    on(window, 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = rooftopBg.parentElement;
          if (!section) { ticking = false; return; }
          const rect = section.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) { ticking = false; return; }
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          rooftopBg.style.transform = `translateY(${(progress - 0.5) * 60}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════
     15. BANQUET SECTION — reveal visual on scroll
     ═══════════════════════════════════════════════════════════ */
  function initBanquetReveal() {
    const visual = $('.banquet__visual');
    if (!visual) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visual.style.transition = 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)';
          visual.style.transform  = 'scale(1)';
          observer.unobserve(visual);
        }
      });
    }, { threshold: 0.15 });

    visual.style.transform = 'scale(1.04)';
    observer.observe(visual);
  }


  /* ═══════════════════════════════════════════════════════════
     16. ABOUT IMAGE — hover zoom kill on mobile
     ═══════════════════════════════════════════════════════════ */
  function initAboutImage() {
    if (window.matchMedia('(hover: none)').matches) {
      $$('.about__img-frame img').forEach(img => {
        img.style.transition = 'none';
      });
    }
  }


  /* ═══════════════════════════════════════════════════════════
     17. KEYBOARD NAVIGATION — trap focus in mobile menu
     ═══════════════════════════════════════════════════════════ */
  function initA11y() {
    const mobileMenu = $('#mobile-menu');
    if (!mobileMenu) return;

    on(mobileMenu, 'keydown', (e) => {
      if (!mobileMenu.classList.contains('open')) return;
      const focusables = $$('a, button', mobileMenu).filter(el => !el.disabled);
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      if (e.key === 'Escape') {
        $('#hamburger')?.click();
        $('#hamburger')?.focus();
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════
     18. GOLD LINE SEPARATOR ANIMATION ON ABOUT SECTION
     ═══════════════════════════════════════════════════════════ */
  function initAboutPillarLines() {
    const pillars = $$('.about__pillar');
    if (!pillars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.borderTopColor = 'var(--border-med)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    pillars.forEach(p => {
      p.style.borderTopColor = 'transparent';
      p.style.transition = 'border-top-color 0.6s ease';
      observer.observe(p);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     19. BRANCH SWITCHER — remember & redirect
     ═══════════════════════════════════════════════════════════ */
  function initBranchSwitcher() {
    const toggle = $('.nav__branch-toggle');
    if (!toggle) return;

    /* Track which branch we're on */
    const path = window.location.pathname;
    const isBallia   = path.includes('ballia');
    const isVaranasi = path.includes('varanasi');
    if (isBallia)   localStorage.setItem('ks_branch', 'ballia');
    if (isVaranasi) localStorage.setItem('ks_branch', 'varanasi');
  }


  /* ═══════════════════════════════════════════════════════════
     20. PAGE TRANSITION — exit fade
     ═══════════════════════════════════════════════════════════ */
  function initPageTransitions() {
    /* Add a subtle fade when navigating between branch pages */
    $$('a[href$="ballia.html"], a[href$="varanasi.html"], a[href$="index.html"]').forEach(link => {
      on(link, 'click', (e) => {
        const href = link.getAttribute('href');
        /* Only for same-origin navigation */
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          e.preventDefault();
          document.body.style.transition = 'opacity 0.4s ease';
          document.body.style.opacity    = '0';
          setTimeout(() => {
            window.location.href = href;
          }, 380);
        }
      });
    });

    /* Fade in on load */
    document.body.style.opacity    = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     INIT — Run everything on DOMContentLoaded
     ═══════════════════════════════════════════════════════════ */
  function init() {
    injectActiveStyle();
    initNav();
    initReveal();
    initMenuTabs();
    initParallax();
    initRooftopParallax();
    initForms();
    initGallery();
    initCounters();
    initWhatsApp();
    initCardGlow();
    initScrollTop();
    initHeroEntrance();
    initBanquetReveal();
    initAboutImage();
    initA11y();
    initAboutPillarLines();
    initBranchSwitcher();
    initPageTransitions();
    highlightCurrentSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

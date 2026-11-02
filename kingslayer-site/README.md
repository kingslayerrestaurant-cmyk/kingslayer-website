# KINGSLAYER — Restaurant, Banquet & Rooftop
## Official Jekyll Website (Ballia & Varanasi Destinations)

Midnight Black × Champagne Gold × Editorial Luxury Hospitality Experience.

---

### 🏛️ Project Overview
This repository contains the complete, production-ready Jekyll static website for **Kingslayer Restaurant, Banquet & Rooftop**, featuring:
- **Cinematic Entry Flow**: Branded preloader followed by photographic split-screen location selection (Ballia vs. Varanasi) with returning visitor persistence (`localStorage`).
- **Kingslayer Ballia**: An independent, comprehensive 8-page luxury digital experience:
  1. `Homepage` (`/ballia/`) — Grand cinematic hero, brand essence, three experience gateways, culinary craft spotlight, rooftop and banquet highlights, visual gallery teaser, and reservation banner.
  2. `About` (`/ballia/about/`) — The Kingslayer genesis, the four pillars of hospitality, and executive leadership profiles.
  3. `Dining / Restaurant` (`/ballia/dining/`) — Fine dining ambiance, culinary craft, lunch & dinner timings, and seating configurations.
  4. `Menu` (`/ballia/menu/`) — Dynamic menu generated from YAML data with interactive category tabs, dietary badges, and unconfirmed item indicators.
  5. `Banquet` (`/ballia/banquet/`) — Imperial banquet hall, wedding receptions, conferences, event capacities, and direct WhatsApp enquiry suite.
  6. `Rooftop` (`/ballia/rooftop/`) — Open-air skyline terrace, evening service, live charcoal grill, and private cabana bookings.
  7. `Gallery` (`/ballia/gallery/`) — Filterable photography portfolio with full-screen interactive lightbox (zoom, keyboard navigation, modal preview).
  8. `Contact & Reservations` (`/ballia/contact/`) — Table booking suite, WhatsApp concierge integration, Google Maps directions, and operational hours.
- **Kingslayer Varanasi** (`/varanasi/`): An independent coming-soon destination page with an architectural preview, brand narrative, and a VIP launch preview waitlist. Does **not** redirect to Ballia.
- **Custom Branded 404** (`/404.html`): Editorial luxury error page with quick links back to all destinations.

---

### 💻 Technology Stack
- **Static Site Generator**: Jekyll 4.4.1 (100% Liquid templates & YAML data)
- **Styling**: Modular SCSS (`_variables.scss`, `_typography.scss`, `_components.scss`, `_animations.scss`, `_responsive.scss`)
- **JavaScript**: Vanilla ES6+ (`assets/js/kingslayer.js` — preloader, location persistence, sticky header, mobile drawer, menu tabs, lightbox, WhatsApp link generator, scroll-top)
- **Plugins**: `jekyll-seo-tag`, `jekyll-sitemap` (GitHub Pages compatible)

---

### 🚀 Running Locally
Inside the `kingslayer-site/` directory:

```bash
# 1. Install dependencies
bundle install

# 2. Build and serve locally with live reload
bundle exec jekyll serve

# The website will be available at: http://localhost:4000/
```

---

### 📋 Client Confirmation Checklist (Data Files)
All placeholder values awaiting client confirmation are clearly designated and located in the `_data/` folder:
1. `_data/contact.yml` — Update primary phone number, WhatsApp number, exact street address, and opening hours for Ballia.
2. `_data/menu.yml` — Verify menu items, dish descriptions, and pricing with the kitchen team. Set `confirmed: true` on verified items.
3. `_data/experiences.yml` — Update banquet guest capacities and seasonal rooftop operational guidelines.

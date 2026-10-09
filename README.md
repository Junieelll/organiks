# Organiks Salon & Wellness Spa 🌿✨

A luxury, high-performance web application for **Organiks Salon and Wellness Spa** — an all-in-one beauty and wellness destination located in Angeles City, Pampanga.

Built with **React 19**, **Vite 8**, **Tailwind CSS v4**, **React Router v7**, and **Framer Motion**.

---

## 📖 Overview

This repository powers the official web experience for Organiks Salon and Wellness Spa. The application reflects the brand's philosophy of organic luxury, botanical calm, and state-of-the-art care across hair, skin, body contouring, nails, lashes, and aesthetic enhancements.

- **Brand Motto:** *Reveal. Renew. Radiate.*
- **Core Pillars:** Natural Ingredients • Advanced Technology • Expert Care
- **Location:** 2nd & 3rd Floor, Friendship Highway, Cutcut, Angeles City, Pampanga

---

## 🛠️ Tech Stack & Dependencies

| Layer | Tool / Library | Purpose |
| :--- | :--- | :--- |
| **Framework & Runtime** | [React 19](https://react.dev/) | Modern concurrent React with functional components |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) | Ultra-fast HMR and optimized production bundling |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing with clean URL navigation |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling with `@theme` token bridge |
| **Animation Engine** | [Framer Motion 14](https://www.framer.com/motion/) | Cinematic page transitions, scroll triggers, and parallax |
| **Icons** | [Hugeicons](https://hugeicons.com/) & [Lucide](https://lucide.dev/) | Luxury stroke-based minimalist iconography |

---

## 📂 Project Architecture

The codebase follows a clean, modular structure separating **pages**, **layout components**, **reusable sections**, **shared utilities**, and **static content**:

```text
organiks/
├── public/
│   ├── favicon.svg             # Browser tab icon
│   ├── icons.svg               # SVG sprite sheet
│   └── images/
│       ├── about/              # About page imagery
│       ├── clients/            # Review & client avatars
│       ├── media/              # High-res video, hero poster, service icons & banners
│       └── logo.webp           # Brand logo mark
│
├── src/
│   ├── pages/                  # Top-level page views (one per route)
│   │   ├── Home.jsx            # Hero video, Brand story, Pillars, Bento grid, Reviews
│   │   ├── Services.jsx        # Full service catalog, pricing tables & category search
│   │   ├── About.jsx           # Philosophy, team commitment, values & ambiance
│   │   ├── Location.jsx        # Google Maps embed, interactive directions, hours & contact
│   │   └── PrivacyPolicy.jsx   # Privacy policy & customer terms
│   │
│   ├── components/
│   │   ├── layout/             # Global structural components
│   │   │   ├── Header.jsx      # Sticky blur navbar, desktop navigation & mobile drawer
│   │   │   └── Footer.jsx      # Comprehensive footer, operating hours & quick links
│   │   │
│   │   ├── sections/           # Reusable composite sections
│   │   │   ├── Banner.jsx      # Luxury booking CTA banner with parallax effect
│   │   │   └── Reviews.jsx     # Smooth dragging & auto-playing testimonials carousel
│   │   │
│   │   ├── common/             # Shared UI components & animations
│   │   │   ├── Button.jsx      # Standardized button styling
│   │   │   └── PageTransition.jsx # Curtain & circular clip-path page transition system
│   │   │
│   │   └── dev/                # Development archives (historical milestones & progress modal)
│   │       ├── FloatingProgressButton.jsx
│   │       ├── ProgressModal.jsx
│   │       └── progressData.js
│   │
│   ├── constants/
│   │   └── config.js           # Single source of truth for contact info, hours & URLs
│   │
│   ├── data/
│   │   └── services.js         # Complete service menu, categories, descriptions & pricing
│   │
│   ├── App.jsx                 # Application root & React Router configuration
│   ├── index.css               # Design system tokens, Google Fonts & Tailwind setup
│   └── main.jsx                # DOM mount entry point
│
├── index.html                  # HTML template with preconnected Google Fonts & meta tags
├── vite.config.js              # Vite configuration & Tailwind plugin
└── package.json
```

---

## 🎨 Design System & Brand Palette

The design system is defined in [`src/index.css`](file:///c:/projects/organiks/src/index.css) using CSS Custom Properties and Tailwind CSS v4 `@theme` mappings:

### Botanical Sanctuary Palette
| Token | Hex | Role |
| :--- | :--- | :--- |
| `--deep` | `#14291F` | Deep Forest Green — Primary dark canvas & high-contrast surfaces |
| `--olive` | `#566B3F` | Muted Olive — Subheadings, active states & botanical accents |
| `--deep-green` | `#4F5F3A` | Supporting botanical green tone |
| `--gold` | `#B8975A` | Warm Gold — Luxury highlights, badges, dividers & pill borders |
| `--cream` | `#F4EEE3` | Warm Linen — Card surfaces, warm section dividers |
| `--ivory` | `#FEFBF7` | Pure Ivory — Soft section backgrounds |
| `--color-primary` | `#8B5E3C` | Warm Earth Bronze — Accent buttons and calls-to-action |

### Typography
- **Headings:** `Cormorant Garamond` (Editorial serif, elegant curves)
- **Body & Navigation:** `Montserrat` (Clean modern geometric sans)
- **Accents & Badges:** `Poppins` (Contemporary sans for UI elements)

---

## 🧭 Routing & Navigation

Routes are managed declaratively in [`src/App.jsx`](file:///c:/projects/organiks/src/App.jsx):

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | [`Home.jsx`](file:///c:/projects/organiks/src/pages/Home.jsx) | Landing page with hero video, services bento grid, pillars, and reviews |
| `/services` | [`Services.jsx`](file:///c:/projects/organiks/src/pages/Services.jsx) | Interactive category tabs, instant search, and full price menu |
| `/about` | [`About.jsx`](file:///c:/projects/organiks/src/pages/About.jsx) | Brand story, botanical philosophy, and facility highlights |
| `/location` | [`Location.jsx`](file:///c:/projects/organiks/src/pages/Location.jsx) | Interactive Google Map embed, live hours status, and directions |
| `/privacy-policy` | [`PrivacyPolicy.jsx`](file:///c:/projects/organiks/src/pages/PrivacyPolicy.jsx) | Client privacy statement and treatment booking policies |

---

## ✨ Motion & Transition System

Located in [`src/components/common/PageTransition.jsx`](file:///c:/projects/organiks/src/components/common/PageTransition.jsx):

1. **Curtain Transition (`go(href, options)`):**
   - A deep green brand curtain drops down to conceal the screen.
   - The route changes and scroll position resets seamlessly beneath the curtain.
   - The curtain falls away downward to reveal the newly mounted page.
2. **Circular Origin Reveal (`goReveal(href, options)`):**
   - An organic expanding circle emerges from the user's click coordinate (`e.clientX`, `e.clientY`).
   - Displays the destination title momentarily, then reveals the target category on `/services`.
3. **Accessibility First:**
   - All animations automatically respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion()`.

---

## ⚙️ Configuration & Content Management

- **Centralized Brand Information:**
  Edit [`src/constants/config.js`](file:///c:/projects/organiks/src/constants/config.js) to update phone numbers, operating hours, business address, Google Maps link, and Google Apps Script booking endpoint.
- **Service Catalog & Pricing:**
  Edit [`src/data/services.js`](file:///c:/projects/organiks/src/data/services.js) to add or edit treatment categories, item titles, descriptions, and pricing in Philippine Pesos (₱).

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm`

### Installation
```bash
git clone https://github.com/Junieelll/organiks.git
cd organiks
npm install
```

### Development Server
```bash
npm run dev
```
Runs the local dev server at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Creates an optimized, minified bundle in the `dist/` folder ready for deployment.

### Preview Production Build
```bash
npm run preview
```
Spins up a local web server to preview the built `dist/` directory.

### Linting
```bash
npm run lint
```

---

## 🚀 Deployment

The project builds standard static HTML/JS/CSS output in `dist/` and is ready for one-click deployment on **Vercel**, **Netlify**, or **Cloudflare Pages**:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing Rule:** All routes (`/*`) should rewrite to `/index.html`.

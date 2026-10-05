# Organiks Salon & Wellness Spa 🌿✨

A modern, responsive, and luxury marketing & portfolio website for **Organiks Salon & Wellness Spa**, built with React 19, Vite, Tailwind CSS v4, and Framer Motion.

---

## 📖 Overview

The website is designed to deliver a high-end, serene visual experience reflecting the salon's organic wellness philosophy. It features an interactive **Development Progress Tracker** that allows clients and stakeholders to follow development phases in real-time.

- **Design Philosophy:** Organic luxury, warm earthy tones, refined typography, and smooth micro-interactions.
- **Reference Inspiration:** [Organiks Salon & Wellness Spa](https://organikssalonandwellnessspa.com/)

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Component-driven UI development |
| **[Vite 8](https://vitejs.dev/)** | Fast modern frontend tooling & bundler |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first styling with theme-level brand design tokens |
| **[Framer Motion](https://www.framer.com/motion/)** | Smooth physics-based spring animations & micro-interactions |
| **[Google Fonts](https://fonts.google.com/)** | *Cormorant Garamond* (Editorial serif) & *Montserrat* (Body sans) |

---

## 🎨 Design System & Brand Palette

The project is styled using bespoke CSS custom properties and Tailwind CSS theme tokens:

| Token | Hex Code | Role |
| :--- | :--- | :--- |
| `--color-brand-primary` | `#8B5E3C` | Warm Earth Brown / Primary Buttons & Headers |
| `--color-brand-secondary` | `#C9A98A` | Muted Sand / Accents & Subheadings |
| `--color-brand-bg` | `#F8F5F1` | Off-white Cream / Global Canvas Background |
| `--color-brand-surface` | `#FFFFFF` | Pure White / Cards, Modals & Surfaces |
| `--color-brand-dark` | `#2C2723` | Deep Charcoal Espresso / High-contrast Headings |
| `--color-brand-muted` | `#756C64` | Warm Gray / Body Copy & Descriptions |
| `--color-brand-accent` | `#E8DDD2` | Soft Linen / Borders & Subtle Dividers |

---

## 🚀 Features

- **Live Development Progress Modal**:
  - Interactive floating widget with a pulsating indicator.
  - Origin-anchored spring animations opening from the bottom right.
  - Animated progress bar fill transition calculating overall milestone completion.
  - Cascading staggered list of project phases.
  - Keyboard accessible (`Esc` key to dismiss) and backdrop-click closing.
- **Responsive Layout**: Designed mobile-first, adapting gracefully from small mobile screens to large desktop monitors.
- **Zero-Config Deployment**: Optimized for instant deployment on Vercel or Netlify.

---

## 📂 Project Structure

```text
organiks/
├── public/                # Static public assets
├── src/
│   ├── assets/            # Images, SVGs, and brand assets
│   ├── components/
│   │   ├── FloatingProgressButton.jsx  # Floating trigger button with pulse animation
│   │   ├── ProgressModal.jsx           # Animated modal with Framer Motion
│   │   └── progressData.js             # Project milestones & roadmap items
│   ├── App.jsx            # Main app shell & AnimatePresence manager
│   ├── index.css          # Design system, CSS variables & typography
│   └── main.jsx           # React DOM root entry
├── index.html             # HTML entry point with Google Fonts preconnect
├── package.json           # Dependencies and project scripts
├── vite.config.js         # Vite configuration with Tailwind CSS plugin
└── README.md              # Documentation
```

---

## 🚦 Roadmap & Phases

- [x] **Phase 1 — Foundation**: Vite + React setup, Tailwind CSS v4, Brand design tokens, Framer Motion integration.
- [ ] **Phase 2 — Homepage**: Navbar, Hero section, About introduction, Service highlights, Testimonials, CTA, Footer.
- [ ] **Phase 3 — Inner Pages**: Dedicated `/about`, `/services`, `/gallery`, and `/contact` views.
- [ ] **Phase 4 — Polish**: Responsive refinement, hover effects, micro-animations, and typography adjustments.
- [ ] **Phase 5 — QA & Launch**: Cross-browser testing, link validations, performance audit, production sign-off.

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or your preferred package manager

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/organiks.git
cd organiks
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for production
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory.

### 5. Run linter
```bash
npm run lint
```

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: project documentation and animated progress modal"
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** &rarr; **"Project"** and import the `organiks` repository.
4. Keep the default settings (Vercel automatically detects the Vite preset).
5. Click **"Deploy"**. Any subsequent pushes to `main` will trigger automatic deployments.

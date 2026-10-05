# Client Website — Development Specification

## 1. Project Overview

Build a **5-page responsive salon and wellness spa website** based closely on the provided reference website:

**Reference:** https://organikssalonandwellnessspa.com/

The client wants the website to be a **close visual recreation of the reference website**, while replacing the original branding/content with the client's own branding and information.

The website is a **marketing/portfolio website**, not a web application.

### Primary Goal

Recreate the visual experience of the reference website while making the implementation:

- Responsive
- Clean
- Fast
- Maintainable
- Professional
- Easy to update
- Suitable for deployment on Vercel

---

## 2. Technology Stack

Use only:

- **React**
- **Vite**
- **JavaScript / JSX**
- **Tailwind CSS**
- **React Router**
- **Framer Motion**
- **Lucide React** where icons are needed

### Deployment

- GitHub for source control
- Vercel for deployment

### Do NOT use

- Next.js
- TypeScript
- PHP
- Laravel
- MySQL
- Supabase
- Firebase
- WordPress
- Backend APIs
- Authentication
- CMS
- Custom booking system

The website is primarily static.

---

## 3. Pages

Create these five routes:

```text
/
 /about
 /services
 /gallery
 /contact
```

Use React Router.

The URLs must be clean:

```text
/
 /about
 /services
 /gallery
 /contact
```

Do NOT use:

```text
/about.html
/services.html
```

---

## 4. MVP

The MVP must contain:

### Global

- Responsive navbar
- Mobile hamburger menu
- Logo/brand
- Navigation links
- Book Now CTA
- Footer
- Responsive layout
- Smooth scrolling where appropriate
- Basic page transitions
- Hover states
- Mobile navigation animation

### Home

- Hero section
- Main headline
- Supporting text
- Primary CTA
- Secondary CTA where appropriate
- About/introduction section
- Service highlights
- Benefits/features
- Testimonials
- CTA section
- Footer

### About

- Page hero
- About the business
- Story/description
- Image/content sections
- Mission/values if applicable
- CTA

### Services

- Service introduction
- Service categories
- Service cards
- Images
- Descriptions
- Book Now CTA

### Gallery

- Image gallery
- Responsive image grid
- Image hover effects
- Optional lightbox if easy to implement
- CTA

### Contact

- Contact information
- Location
- Opening hours
- Social media links
- Contact CTA
- Book Now CTA
- Embedded map only if required

---

## 5. Booking

There is **NO custom booking system**.

Every "Book Now", "Book Appointment", or equivalent CTA should redirect to the client's existing external booking page.

Create a centralized constant:

```js
const BOOKING_URL = "CLIENT_BOOKING_URL";
```

All booking buttons should use this constant.

Do not create:

- booking database
- booking forms
- authentication
- appointment management
- calendar backend

---

## 6. Design Direction

The visual direction should closely follow the reference website.

### Overall Feeling

- Elegant
- Premium
- Calm
- Feminine
- Wellness-oriented
- Modern
- Clean
- Spacious

Avoid making it look like a generic template.

The goal is:

> "This should feel like the same website design language, but belonging to the client's business."

---

## 7. Color Palette

Use the reference website as the primary visual guide.

Create centralized CSS/Tailwind variables instead of scattering colors throughout components.

Suggested palette:

```text
Primary:
#8B5E3C

Secondary:
#C9A98A

Background:
#F8F5F1

Surface:
#FFFFFF

Dark:
#2C2723

Muted:
#756C64

Light accent:
#E8DDD2
```

### Color Usage

**Primary**
- Main CTA
- Important accents
- Active states

**Secondary**
- Decorative elements
- Secondary buttons
- Small accents

**Background**
- Main page sections

**Dark**
- Headings
- Navigation
- Primary text

**Muted**
- Descriptions
- Supporting text

Do not introduce random colors.

---

## 8. Typography

Use a premium serif + clean sans-serif combination if it matches the reference.

Suggested:

### Headings

```text
Cormorant Garamond
```

or another elegant serif that closely matches the reference.

### Body

```text
Montserrat
```

or another clean modern sans-serif.

Typography hierarchy must be consistent:

```text
H1 — large editorial headline
H2 — section heading
H3 — card/service heading
Body — readable supporting text
Small — labels/captions
```

Avoid excessive font weights.

---

## 9. Layout Rules

Use a consistent maximum content width.

Example:

```text
max-width: 1200–1280px
```

Desktop:

- Generous whitespace
- Large imagery
- Strong visual hierarchy
- Balanced sections

Mobile:

- No horizontal scrolling
- Properly stacked sections
- Comfortable padding
- Readable typography
- Buttons should remain easy to tap

Typical mobile horizontal padding:

```text
16px–24px
```

Desktop:

```text
40px–80px
```

---

## 10. Component Architecture

Do not put the entire website into `App.jsx`.

Use reusable components.

Suggested structure:

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── MobileMenu.jsx
│   ├── Footer.jsx
│   ├── Button.jsx
│   ├── SectionTitle.jsx
│   ├── Hero.jsx
│   ├── ServiceCard.jsx
│   ├── TestimonialCard.jsx
│   ├── CTASection.jsx
│   └── PageHero.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Gallery.jsx
│   └── Contact.jsx
│
├── data/
│   ├── services.js
│   ├── testimonials.js
│   └── gallery.js
│
├── assets/
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 11. Data-Driven Content

Services, testimonials, and gallery items should preferably be stored as arrays.

Example:

```js
const services = [
  {
    title: "Service Name",
    description: "Service description",
    image: "/images/service-1.jpg"
  },
  ...
];
```

Then render them with `.map()`.

Do NOT duplicate the same card markup manually 10 times.

---

## 12. Images

Use local assets whenever possible.

Organize them:

```text
public/
└── images/
    ├── hero/
    ├── services/
    ├── gallery/
    └── about/
```

Do not hotlink random external images in the final production website.

Images should:

- Maintain proper aspect ratios
- Use `object-cover` where appropriate
- Have meaningful alt text
- Be optimized where possible

---

## 13. Animations

Use **Framer Motion**.

Animations should be subtle and premium.

Allowed:

- Fade in
- Fade up
- Slide in
- Image reveal
- Hover scale
- Button hover
- Menu animation
- Section entrance

Avoid:

- Excessive bouncing
- Spinning
- Aggressive zooming
- Constant movement
- Animations that slow down the website

Animation should enhance the design, not distract from it.

---

## 14. Responsive Requirements

Must work properly at:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px+
```

Test at least:

- Mobile
- Tablet
- Laptop
- Desktop

Important:

### Never allow

```text
horizontal scrolling
```

unless intentionally required.

---

## 15. Navigation

Desktop:

```text
Logo | Home | About | Services | Gallery | Contact | Book Now
```

Mobile:

```text
Logo | Hamburger
```

Menu should animate smoothly.

Clicking a navigation link should close the mobile menu.

---

## 16. Buttons

Primary button style should remain consistent throughout the site.

Example:

```text
Book Now
```

Primary CTA should have:

- clear contrast
- subtle hover effect
- appropriate padding
- rounded corners consistent with the design

Don't create a different button style for every section.

---

## 17. Footer

Footer should include:

- Logo
- Short description
- Navigation
- Contact information
- Opening hours
- Social links
- Book Now CTA
- Copyright

Use the same footer across every page.

---

## 18. SEO Basics

Each page should have:

- Unique `<title>`
- Meta description
- Semantic HTML
- Proper heading hierarchy
- Image alt attributes

Example:

```text
Home
About Us
Our Services
Gallery
Contact Us
```

Don't overdo SEO. This is an MVP.

---

## 19. Performance Rules

Keep the website lightweight.

Avoid:

- unnecessary libraries
- huge JavaScript packages
- unnecessary dependencies
- autoplaying large videos
- massive unoptimized images

Use:

- lazy loading for non-critical images
- optimized image dimensions
- reusable components
- minimal dependencies

---

## 20. Code Rules

### Rule 1 — Don't over-engineer

This is a static business website.

Don't create architecture designed for a huge SaaS application.

### Rule 2 — Reuse components

If something appears more than once, consider making it a component.

### Rule 3 — Don't duplicate styles unnecessarily

Use Tailwind utilities consistently.

### Rule 4 — Don't invent functionality

If the reference doesn't require a feature, don't add it.

### Rule 5 — Don't change the design unnecessarily

The client specifically requested a close recreation.

### Rule 6 — Don't use placeholder content in the final version

Temporary placeholders are acceptable during development, but clearly mark them.

### Rule 7 — Don't install libraries without a reason

Before adding a dependency, ask:

> "Can this be done easily with React, Tailwind, or Framer Motion?"

If yes, don't install another package.

---

## 21. Reference Website Rule

The reference website is the **primary visual reference**.

When recreating a section, pay attention to:

- Section height
- Spacing
- Typography
- Image proportions
- Border radius
- Button dimensions
- Alignment
- Background colors
- Visual hierarchy
- Animation behavior

Do not blindly copy code.

**Recreate the visual result using your own React/Tailwind implementation.**

---

## 22. Client Progress Website

The project must be deployed to a **Vercel preview URL**.

Example:

```text
client-website.vercel.app
```

The client should be able to open the same URL and see the latest progress.

Workflow:

```text
Code
 ↓
Git commit
 ↓
GitHub
 ↓
Vercel
 ↓
Updated preview
```

Every significant progress update should be pushed to GitHub so Vercel automatically updates the preview.

Do NOT connect the client's production domain until the website is approved.

---

## 23. Development Phases

### Phase 1 — Foundation

- Vite setup
- React Router
- Tailwind
- Framer Motion
- Global styles
- Fonts
- Colors
- Navbar
- Footer
- Vercel deployment

### Phase 2 — Homepage

Build the homepage completely.

Priority:

```text
Navbar
Hero
About
Services
Testimonials
CTA
Footer
```

### Phase 3 — Remaining Pages

Build:

```text
About
Services
Gallery
Contact
```

### Phase 4 — Polish

- Responsive fixes
- Animations
- Typography
- Image sizing
- Hover effects
- Navigation
- Spacing

### Phase 5 — QA

Check:

- Desktop
- Mobile
- Tablet
- All links
- Book Now buttons
- Navigation
- Images
- No console errors
- No horizontal scrolling
- 404/route issues on Vercel

---

## 24. Definition of Done

The project is considered complete when:

- [ ] All 5 pages work
- [ ] All routes work
- [ ] Navbar works
- [ ] Mobile menu works
- [ ] Book Now redirects correctly
- [ ] Responsive design works
- [ ] Animations work
- [ ] Images load correctly
- [ ] Footer works
- [ ] No horizontal scrolling
- [ ] No major console errors
- [ ] Vercel deployment works
- [ ] Client can access the preview URL
- [ ] Final content/branding is applied
- [ ] Final review is completed

---

## 25. AI Development Rules

You are assisting me as a **senior frontend developer**.

Follow this project specification exactly.

### Do not:

- Introduce technologies not specified here
- Add unnecessary features
- Over-engineer the project
- Replace the chosen stack
- Add a backend
- Add a database
- Add authentication
- Add a CMS
- Add a custom booking system
- Add unnecessary dependencies
- Rewrite working components without a reason

### Development approach

**Do not try to build the entire website in one response.**

Work incrementally.

Start with:

> Project setup → global styles → Navbar → Footer → Homepage

Then test it before moving on.

When modifying existing code:

1. Inspect the existing implementation.
2. Make the smallest necessary change.
3. Don't rewrite working components unnecessarily.
4. Preserve existing functionality.
5. Check for errors after each major change.

### Priority

Always prioritize:

1. Working functionality
2. Visual accuracy
3. Responsive design
4. Maintainable code
5. Performance
6. Extra polish

A working, accurate website is more important than unnecessary complexity.

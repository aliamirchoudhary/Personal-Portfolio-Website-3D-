<div align="center">

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>

  <br/><br/>

  <img src="public/profile.jpg" width="120" height="120" style="border-radius: 50%; border: 3px solid #7c3aed;" alt="Profile"/>

  <h1>Muhammad Ali Aamir</h1>

  <p>
    <strong>Full Stack Developer</strong> · AI Enthusiast · Open Source Contributor
  </p>

  <p>
    <img src="https://img.shields.io/badge/status-live-success?style=flat-square" alt="Status"/>
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/build-vite-646CFF?style=flat-square&logo=vite" alt="Build"/>
    <img src="https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel" alt="Deploy"/>
  </p>

  <p>
    <a href="#overview">Overview</a> · 
    <a href="#tech-stack">Tech Stack</a> · 
    <a href="#performance">Performance</a> · 
    <a href="#features">Features</a> · 
    <a href="#getting-started">Getting Started</a> · 
    <a href="#deployment">Deployment</a>
  </p>

</div>

---

## Overview

<div align="center">

> An interactive 3D portfolio experience — scroll through **eight curated sections** as animated 3D components morph and transition in a fixed viewport panel.

</div>

This portfolio reimagines the traditional single-page scrolling experience by pairing **scroll-snapped content sections** with a **fixed 460px animated viewport slot**. As you scroll, the slot cross-fades between eight different 3D animated components — from a floating profile portrait to a neural network globe to a rotating skill cube — while the text content slides alongside in a 60/40 layout.

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌─────────────────────────────────┐ │
│  │                      │  │                                 │ │
│  │     Text Content     │  │     Animated 3D Component       │ │
│  │     (60% width)      │  │     (460px fixed slot)          │ │
│  │                      │  │                                 │ │
│  │  • Section heading   │  │  ┌─────────────────────────┐   │ │
│  │  • Description       │  │  │    🎨 NeuralNetwork     │   │ │
│  │  • Skills/Tags       │  │  │       Globe             │   │ │
│  │  • CTAs              │  │  │    (Canvas 2D 3D)       │   │ │
│  │                      │  │  └─────────────────────────┘   │ │
│  └──────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

On mobile, the layout collapses to a single-column scroll, with each animated component rendered directly below its section's content.

---

## Tech Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

</div>

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^19.2.6 | Component-based UI framework |
| [Vite](https://vitejs.dev/) | ^8.0.12 | Lightning-fast dev server & build tool |
| [GSAP](https://gsap.com/) | ^3.15.0 | ScrollTrigger-driven scroll animations & cross-fade morph transitions |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4.19 | Utility-first CSS framework with custom theme |
| [PostCSS](https://postcss.org/) | ^8.5.15 | CSS transformation pipeline |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | ^10.5.0 | CSS vendor prefixing |
| [ESLint](https://eslint.org/) | ^10.3.0 | JavaScript linting with React Hooks & Refresh plugins |

<div align="center">

### Backend (Serverless)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

</div>

| Technology | Purpose |
|---|---|
| [Vercel Serverless Functions](https://vercel.com/docs/functions) | Contact form POST endpoint |
| [Nodemailer](https://nodemailer.com/) | Gmail SMTP email delivery via App Passwords |

<div align="center">

### Fonts & Icons

</div>

| Resource | Source |
|---|---|
| Orbitron | Google Fonts — Loading screen name trace |
| Space Grotesk | Google Fonts — Headings & body |
| Inter | Google Fonts — UI text |
| JetBrains Mono | Google Fonts — Code snippets & monospace labels |
| Clash Display | Fontshare — Display headings |
| Font Awesome 6.4.0 | Local glyph subset (~3 KB) — Social & service icons |

---

## Performance

<div align="center">

![Performance](https://img.shields.io/badge/Performance-optimized-00CE68?style=for-the-badge&logo=lighthouse&logoColor=white)

</div>

### Performance Practices Applied

| Practice | Description |
|---|---|
| 🚀 **Lazy-loaded components** | `React.lazy()` + `Suspense` for the morph transition slot; only the current section's component mounts, others render on demand |
| 🔋 **Low-power mobile mode** | `requestAnimationFrame` loops gated behind a `lowPower` flag; canvas animations throttle to 30fps and reduce node/particle counts |
| 🎨 **CSS-driven auto-rotation** | SkillCube auto-rotation moved from JS `rAF` loop to pure CSS animation, offloading to the compositor thread |
| ✂️ **Font optimization** | Replaced 259 KB Font Awesome CDN with a local ~3 KB glyph subset; Google Fonts loaded with `display=swap` |
| ⚡ **LCP image preload** | Profile image (`profile.jpg`, 62 KB) added as `<link rel="preload" as="image">` in `index.html` |
| ⏱️ **Staggered section mount** | Below-fold sections delay their first render by 1.5–3s via `setTimeout`, shrinking long tasks |
| 📐 **Layout shift reduction** | Loading overlay reserves explicit dimensions; profile picture morph uses fixed positioning with `will-change: transform` |
| 📱 **Mobile slot hidden** | The 460px morph transition slot is `display: none` on screens ≤1024px; each section renders its animated component inline |
| 🖼️ **Canvas `will-change`** | Animated canvases use `will-change: transform` to promote to GPU compositing layers |

---

## Features

### Sections & Animated Components

<div align="center">

Eight full-viewport sections, each with scroll-snap positioning, alternating left/right content alignment, and a dedicated animated 3D component:

</div>

| # | Section | Content | Animated Component | Alignment |
|---|---|---|---|---|
| 1 | **🏠 Home** | Name, typewriter role animation, Download Resume CTA | `HomeProfilePicture` — floating portrait with 6 simultaneous CSS animations | Left |
| 2 | **👤 About** | 3-paragraph bio, highlight keywords, Kryzect agency card | `NeuralNetworkGlobe` — Canvas 2D 3D globe (110 nodes, Fibonacci sphere) | Right |
| 3 | **💼 Kryzect** | Kryzect agency showcase with services and portfolio | `KryzectLogo` — Animated Kryzect brand mark | Left |
| 4 | **📈 Experience** | ExperienceTimeline — vertical scroll-driven timeline | `PerceptronAnimation` — SVG multi-layer perceptron (4-6-6-4-2) | Right |
| 5 | **🎓 Education** | EducationTimeline — 5 entries, animated fill line | `SpinningSkillBox` — CSS 3D box rotating on X-axis every 1.2s | Left |
| 6 | **🛠️ Skills** | SkillsGrid — tabbed grid with animated progress bars | `SkillCube` — CSS 3D cube with devicon logos, auto-rotates 45°/s | Right |
| 7 | **🚀 Projects** | RingCarousel with 8 project cards, detailed HTML modals | `TechFlowDiagram` — SVG architecture diagram with travelling light pulses | Left |
| 8 | **📬 Contact** | Contact form, notification toast, 8 social links grid | `MorphingCommsIcon` — Icon cycling ChatBubble → Envelope → Phone → SMS | Right |

### Component Interaction Matrix

| Component | Auto-Animation | Drag | Wheel | Click/Tap | Hover |
|---|:---:|:---:|:---:|:---:|:---:|
| HomeProfilePicture | ✅ | ❌ | ❌ | ❌ | ❌ |
| NeuralNetworkGlobe | ✅ | ✅ | ❌ | ❌ | ❌ |
| KryzectLogo | ✅ | ❌ | ❌ | ❌ | ❌ |
| PerceptronAnimation | ✅ | ❌ | ❌ | ❌ | ❌ |
| SpinningSkillBox | ✅ | ✅ | ❌ | ❌ | ❌ |
| SkillCube | ✅ | ✅ | ❌ | ❌ | ❌ |
| TechFlowDiagram | ✅ | ❌ | ❌ | ❌ | ❌ |
| MorphingCommsIcon | ✅ | ❌ | ❌ | ❌ | ✅ |

### Morph Transition Slot

The `MorphTransitionSlot` is a **fixed-position panel** (460px wide, `z-index: 10`) that persists across all sections:

- **Cross-fade transitions**: GSAP ScrollTrigger drives opacity cross-fades between the outgoing and incoming animated component as the user scrolls.
- **Horizontal slide**: The slot slides left/right based on the section's `side` property (left-aligned content = slot on right, and vice versa).
- **Pointer-events gating**: During transitions (progress < 95%), both elements have `pointer-events: none` so wheel scroll passes through. At ≥95%, the entering element becomes interactive.
- **Render-on-demand**: Only the current and adjacent components are rendered (using a `Set`-based render tracking) to keep performance optimal.
- **Hidden on mobile**: At ≤1024px, `.animated-slot` is `display: none`, and each section renders its component inline via `.mobile-animated-component`.

### Loading Screen

A full-viewport overlay (`z-index: 100`) orchestrates two parallel animations:

**1. LoadingNameTrace**
- Full-viewport SVG overlay with Orbitron font
- Name appears in dark purple (`#3b1d8f`) with a slow fade-in (first 15% of timeline)
- A light lavender stroke (`#a78bfa`, `stroke-width: 2.5`) traces every letter simultaneously via `stroke-dasharray`/`stroke-dashoffset` animation over 2.2s
- Glow filter (`feGaussianBlur`) on the trace stroke
- Fades out at the end
- On mobile (≤1024px): additional letter-spacing (`0.14em`) and light outline for readability

**2. LoadingProfileFrame**
- Circular profile picture with double-ring frame
- Six simultaneous CSS animations:
  - Mount fade-in + scale-up
  - Outer ring glow pulse + slow rotation
  - Light sweep radar arc
  - Periodic RGB-blur/jitter glitch burst
  - Inner breathing radial glow
  - N/S/E/W glowing dot markers
- On mobile: `margin-bottom: 80px` via `@media (max-width: 1024px)`

**Desktop sequence (GSAP-driven)**:
1. Both components mount simultaneously
2. After ~4.5s, a GSAP timeline runs for 1.05s:
   - Shrinks/shifts the profile frame from center to the MorphTransitionSlot position (right side, 58px offset)
   - Changes frame size from 240px → 320px
   - Fades out frame + name trace
   - Fades in main content wrapper
3. Loading overlay is removed

**Mobile sequence (≤1024px)**: The GSAP morph is skipped entirely — loading fades directly to main content.

### Responsive Design

<div align="center">

| Breakpoint | Device | Key Changes |
|---|---|---|
| **≤1024px** | Tablet Landscape | Scroll-snap disabled, morph slot hidden, inline animated components |
| **≤768px** | Tablet Portrait | Navbar 64px, hamburger menu, smaller headings |
| **≤480px** | Phone | Reduced padding, 2-column social links, compact layout |

</div>

#### Accessibility
- `prefers-reduced-motion: reduce` respected in all animated components (animations disabled)
- Semantic HTML structure (`<section>`, `<nav>`, `<main>`)
- `aria-label` on SVG elements

---

## Project Structure

```
my-portfolio/
├── api/
│   └── send-contact.js              # Vercel serverless function (Gmail SMTP)
│
├── public/
│   ├── profile.jpg                  # Profile picture
│   ├── Muhammad_Ali_Aamir_Resume.pdf # Downloadable resume
│   ├── favicon.svg                  # SVG favicon
│   ├── og-image.png                 # Open Graph social preview
│   ├── icons.svg                    # Icon sprite sheet
│   ├── robots.txt                   # Search engine crawler rules
│   ├── sitemap.xml                  # XML sitemap for SEO
│   ├── css/
│   │   └── fa-icons.min.css         # Local Font Awesome glyph-subset (~3KB)
│   └── fonts/
│       ├── fa-brands-subset.woff2   # Local Font Awesome brand icons
│       └── fa-solid-subset.woff2    # Local Font Awesome solid icons
│
├── src/
│   ├── assets/
│   │   └── hero.png                 # Hero image asset
│   │
│   ├── components/
│   │   ├── animated/                # Self-contained 3D animated components
│   │   │   ├── HomeProfilePicture.jsx
│   │   │   ├── NeuralNetworkGlobe.jsx
│   │   │   ├── PerceptronAnimation.jsx
│   │   │   ├── FlippingCard3D.jsx           # SpinningSkillBox
│   │   │   ├── SkillCube.jsx
│   │   │   ├── TechFlowDiagram.jsx
│   │   │   └── MorphingCommsIcon.jsx
│   │   │
│   │   ├── loading/                 # Loading screen
│   │   │   ├── LoadingNameTrace.jsx
│   │   │   └── LoadingProfileFrame.jsx
│   │   │
│   │   ├── navbar/
│   │   │   └── NavJumper.jsx        # Animated navigation link jumper
│   │   │
│   │   ├── sections/                # 8 page sections
│   │   │   ├── HomeSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── KryzectSection.jsx
│   │   │   ├── ExperienceSection.jsx
│   │   │   ├── EducationSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   └── ContactSection.jsx
│   │   │
│   │   ├── shared/                  # Shared layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MorphTransitionSlot.jsx
│   │   │   └── LazyMount.jsx        # IntersectionObserver lazy mount wrapper
│   │   │
│   │   └── ui/                      # Reusable UI widgets
│   │       ├── RingCarousel.jsx
│   │       ├── EducationTimeline.jsx
│   │       ├── ExperienceTimeline.jsx
│   │       ├── SkillsGrid.jsx
│   │       ├── KryzectLogo.jsx      # Animated Kryzect brand mark
│   │       └── StartupLogoButton.jsx
│   │
│   ├── data/
│   │   └── portfolioData.js         # All portfolio content & personal data
│   │
│   ├── App.jsx                      # Root: loading screen + section orchestration + GSAP
│   ├── index.css                    # Tailwind directives + custom responsive CSS
│   └── main.jsx                     # Entry point + GSAP plugin registration
│
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint flat config v10
├── index.html                       # HTML entry with CDN links & inline SVG favicon
├── LICENSE                          # MIT License
├── package.json                     # Dependencies, scripts, metadata
├── postcss.config.js                # PostCSS with Tailwind & Autoprefixer
├── tailwind.config.js               # Custom theme (colors, fonts, breakpoints)
├── vercel.json                      # Vercel deployment & rewrites
└── vite.config.js                   # Vite build configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later
- A **Gmail account** with App Password enabled (for contact form)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env
```

### Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173` with Hot Module Replacement. Changes to source files reflect instantly in the browser.

**Available scripts:**

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across all source files |

### Build

```bash
npm run build
```

Outputs a production-optimized build:

| Asset | Size (gzipped) |
|---|---|
| JavaScript | ~400 KB (~132 KB) |
| CSS | ~8 KB (~2.4 KB) |

---

## Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Gmail SMTP credentials (use App Password, not your regular password)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Where admin notifications are sent
ADMIN_EMAIL=your-email@gmail.com

# Frontend origin (for CORS and redirects)
FRONTEND_ORIGIN=http://localhost:3000
```

**Setting up a Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Navigate to **App Passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password into `GMAIL_APP_PASSWORD`

### Portfolio Data

All content lives in `src/data/portfolioData.js`. Edit the following exports:

| Export | Description |
|---|---|
| `PERSONAL` | Name, title, email, phone, location, resume URL, profile image, availability, languages |
| `ABOUT_TEXT` | Array of bio paragraphs (3) |
| `ABOUT_HIGHLIGHTS` | Keywords/skills displayed as badges |
| `KRYZECT` | Kryzect agency branding (name, URL, SVG logo path) |
| `SOCIAL_LINKS` | Array of 8 social platforms (icon, href, label) |
| `SERVICES` | 3 services with title, description, tech stack, pricing |
| `EXPERIENCE` | Work experience entries with role, company, duration, description |
| `EDUCATION` | 5 education entries with degree, institution, courses |
| `TECHNICAL_SKILLS` | 13 skills with name and percentage (0–100) |
| `PROFESSIONAL_SKILLS` | 6 soft skills with name and percentage |
| `PROJECTS` | 8 projects with description, tags, links, full modal content |
| `NAV_LINKS` | 8 navigation items mapping to section IDs |

### Theme & Colors

Customize the visual theme in `tailwind.config.js`:

```js
colors: {
  'bg-deep': '#0a0a0f',   // Deep space background
  'surface': '#12121a',   // Card/panel surface
  'accent': '#7c3aed',    // Primary purple
  'cyan': '#06b6d4',      // Secondary cyan
  'glow': '#a78bfa',      // Light lavender glow
  'text-pri': '#f1f5f9',  // Primary text
  'text-sec': '#94a3b8',  // Secondary text
}
```

Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (monospace).

---

## Deployment

<div align="center">

![Vercel](https://img.shields.io/badge/Deploy_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Build & deploy
npm run build
vercel --prod
```

**After deploying:**
1. Go to your project dashboard on Vercel
2. Navigate to **Settings → Environment Variables**
3. Add the same variables from your `.env` file
4. Redeploy if needed

The `vercel.json` configures a rewrite rule so `POST /send-contact` routes to the serverless function at `/api/send-contact`.

### Manual Deployment

1. Build the project: `npm run build`
2. Serve the `dist/` directory with any static file server
3. Deploy the `api/send-contact.js` function to your serverless platform of choice

---

## Linting

```bash
npm run lint
```

Uses **ESLint 10** with a flat configuration file (`eslint.config.js`):

- `@eslint/js` recommended rules
- `eslint-plugin-react-hooks` — enforces Rules of Hooks
- `eslint-plugin-react-refresh` — ensures components are HMR-safe
- Ignores `dist/` directory

---

## License

<div align="center">

![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

</div>

---

<div align="center">

**[⬆ Back to Top](#muhammad-ali-aamir--portfolio)**

<br/>

Built with passion, React, and way too many keyframes.

<br/>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP"/>

<br/>

© 2026 Muhammad Ali Aamir

</div>

<div align="center">
  <br/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <br/><br/>
</div>

# Muhammad Ali Aamir | Portfolio

> An interactive 3D portfolio experience — scroll through seven curated sections as animated 3D components morph and transition in a fixed viewport panel. Built with React 19, GSAP ScrollTrigger, and Tailwind CSS.

<p align="center">
  <img src="https://img.shields.io/badge/status-live-success?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/build-vite-646CFF?style=flat-square&logo=vite" alt="Build"/>
  <img src="https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel" alt="Deploy"/>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Sections & Animated Components](#sections--animated-components)
  - [Morph Transition Slot](#morph-transition-slot)
  - [Loading Screen](#loading-screen)
  - [Responsive Design](#responsive-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Development](#development)
  - [Build](#build)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Portfolio Data](#portfolio-data)
  - [Theme & Colors](#theme--colors)
- [Deployment](#deployment)
- [Linting](#linting)
- [License](#license)

---

## Overview

This portfolio reimagines the traditional single-page scrolling experience by pairing **scroll-snapped content sections** with a **fixed 460px animated viewport slot**. As you scroll, the slot cross-fades between seven different 3D animated components — from a floating profile portrait to a neural network globe to a rotating skill cube — while the text content slides alongside in a 60/40 layout.

On mobile, the layout collapses to a single-column scroll, with each animated component rendered directly below its section's content.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^19.2.6 | Component-based UI framework |
| [Vite](https://vitejs.dev/) | ^8.0.12 | Lightning-fast dev server & build tool |
| [GSAP](https://gsap.com/) | ^3.15.0 | ScrollTrigger-driven scroll animations & cross-fade morph transitions |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4.19 | Utility-first CSS framework with custom theme |
| [PostCSS](https://postcss.org/) | ^8.5.15 | CSS transformation pipeline |
| [ESLint](https://eslint.org/) | ^10.3.0 | JavaScript linting with React Hooks & Refresh plugins |

### Backend (Serverless)

| Technology | Purpose |
|---|---|
| [Vercel Serverless Functions](https://vercel.com/docs/functions) | Contact form POST endpoint |
| [Nodemailer](https://nodemailer.com/) | Gmail SMTP email delivery via App Passwords |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable loading |

### Fonts & Icons

| Resource | Source |
|---|---|
| Orbitron | Google Fonts — Loading screen name trace |
| Space Grotesk | Google Fonts — Headings & body |
| Inter | Google Fonts — UI text |
| JetBrains Mono | Google Fonts — Code snippets & monospace labels |
| Clash Display | Fontshare — Display headings |
| Font Awesome 6.4.0 | CDN — Social & service icons |

---

## Features

### Sections & Animated Components

Seven full-viewport sections, each with scroll-snap positioning, alternating left/right content alignment, and a dedicated animated 3D component:

<div align="center">

| # | Section | Content | Animated Component | Alignment |
|---|---|---|---|---|
| 1 | **Home** | Name, typewriter role animation, Download Resume CTA | `HomeProfilePicture` — floating portrait with 6 simultaneous CSS animations (float, glow ring, light-sweep arc, glitch burst, sheen scan, vignette breathe) | Left |
| 2 | **About** | 3-paragraph bio, highlight keywords, WebCraft agency card with animated hex logo | `NeuralNetworkGlobe` — Canvas 2D 3D globe (110 nodes, Fibonacci sphere), auto-rotates with drag + inertia, cyan signal cascades propagate through the network | Right |
| 3 | **Services** | "What I Offer" heading, RingCarousel with 3 service cards (Full Stack, Design-to-Web, Front-End) with rich modals | `PerceptronAnimation` — SVG multi-layer perceptron (4-6-6-4-2), input nodes fire sequentially, signals propagate left-to-right lighting up edges | Left |
| 4 | **Education** | EducationTimeline — vertical scroll-driven timeline with 5 entries, animated fill line, expandable course lists | `SpinningSkillBox` — CSS 3D box rotating on X-axis every 1.2s through "Data Science", "Full Stack", "Machine Learning", "Cloud"; side label "AI"; drag to spin with snap | Right |
| 5 | **Skills** | SkillsGrid — tabbed grid (Technical / Professional) with animated progress bars, pop-in cards, shimmer overlay | `SkillCube` — CSS 3D cube (6 faces: Python, SQL, C++, JavaScript, ML/AI, React) with devicon logos, auto-rotates 45°/s, drag in any direction with inertia | Left |
| 6 | **Projects** | RingCarousel with 8 project cards (travelbuddy, criclytics, etc.), each with a detailed HTML modal | `TechFlowDiagram` — SVG architecture diagram: Client → API Gateway → Modules (Cloud, Repository, Database, AI) with continuous cyan/lavender travelling light pulses | Right |
| 7 | **Contact** | Contact form (Name, Email, Message with validation), notification toast, 8 social links grid, contact info card | `MorphingCommsIcon` — Single icon cycling ChatBubble → Envelope → Phone → SMS every 1.5s, rotating conic glow ring, orbiting particles, hover pauses morph | Left |

</div>

### Component Interaction Matrix

| Component | Auto-Animation | Drag | Wheel | Click/Tap | Hover |
|---|---|---|---|---|---|
| HomeProfilePicture | ✅ Float, glow, glitch | ❌ | ❌ | ❌ | ❌ |
| NeuralNetworkGlobe | ✅ Rotation, signal cascades | ✅ Rotate with inertia | ❌ | ❌ | ❌ |
| PerceptronAnimation | ✅ Signal propagation cycle | ❌ | ❌ | ❌ | ❌ |
| SpinningSkillBox | ✅ Auto-flip every 1.2s | ✅ Vertical spin, snap | ❌ | ❌ | ❌ |
| SkillCube | ✅ Rotation 45°/s | ✅ Free spin with inertia | ❌ | ❌ | ❌ |
| TechFlowDiagram | ✅ Light pulses cycle | ❌ | ❌ | ❌ | ❌ |
| MorphingCommsIcon | ✅ Morph cycle every 1.5s | ❌ | ❌ | ❌ | ✅ Pauses morph, intensifies glow |

### Morph Transition Slot

The `MorphTransitionSlot` is a **fixed-position panel** (460px wide, `z-index: 10`) that persists across all sections:

- **Cross-fade transitions**: GSAP ScrollTrigger drives opacity cross-fades between the outgoing and incoming animated component as the user scrolls.
- **Horizontal slide**: The slot slides left/right based on the section's `side` property (left-aligned content = slot on right, and vice versa).
- **Pointer-events gating**: During transitions (progress < 95%), both elements have `pointer-events: none` so wheel scroll passes through. At ≥95%, the entering element becomes interactive.
- **Render-on-demand**: Only the current and adjacent components are rendered (using a `Set`-based render tracking) to keep performance optimal.
- **Hidden on mobile**: At ≤1024px, `.animated-slot` is `display: none`, and each section renders its component inline via `.mobile-animated-component`.

### Loading Screen

A full-viewport overlay (`z-index: 100`) orchestrates two parallel animations:

**1. LoadingNameTrace (`src/components/loading/LoadingNameTrace.jsx`)**
- Full-viewport SVG overlay with Orbitron font
- Name appears in dark purple (`#3b1d8f`) with a slow fade-in (first 15% of timeline)
- A light lavender stroke (`#a78bfa`, `stroke-width: 2.5`) traces every letter simultaneously via `stroke-dasharray`/`stroke-dashoffset` animation over 2.2s
- Glow filter (`feGaussianBlur`) on the trace stroke
- Fades out at the end
- On mobile (≤1024px): additional letter-spacing (`0.14em`) and light outline (`stroke: #a78bfa`, `stroke-width: 1.2`, `paint-order: stroke fill`) for readability

**2. LoadingProfileFrame (`src/components/loading/LoadingProfileFrame.jsx`)**
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

Three breakpoints following the original design system:

#### ≤1024px (Tablet Landscape)
- Scroll-snap disabled (`scroll-snap-type: none`)
- MorphTransitionSlot hidden (`display: none`)
- Each section renders its animated component inline (`.mobile-animated-component`)
- Home section: flex column, centered, profile picture above name
- Contact form: 1 column
- Social links: 4-column grid, centered
- RingCarousel: compact mode (stage 280×260px, card offsets reduced)
- `html { overflow: visible }` to prevent clipping
- Font sizes: fluid via `clamp()`

#### ≤768px (Tablet Portrait)
- Navbar height: 64px (down from 96px)
- Section headings: 2.2rem
- Home name: 2.8rem
- Contact form inner grid: 1 column
- Footer: stacked vertically, centered
- Hamburger menu replaces desktop nav links

#### ≤480px (Phone)
- Content padding reduced
- Home name: 2.2rem
- Section headings: 1.8rem
- Social links: 2 columns
- Social icons: 60×60px
- Contact page 1 column layout

#### Accessibility
- `prefers-reduced-motion: reduce` respected in all animated components (animations disabled)
- Semantic HTML structure (`<section>`, `<nav>`, `<main>`)
- `aria-label` on SVG elements

---

## Project Structure

```
my-portfolio/
├── api/
│   └── send-contact.js            # Vercel serverless function (Gmail SMTP)
│
├── public/
│   ├── profile.jpg                # Profile picture
│   ├── Muhammad_Ali_Aamir.pdf     # Downloadable resume
│   └── vite.svg                   # Favicon
│
├── src/
│   ├── components/
│   │   ├── animated/              # Self-contained 3D animated components
│   │   │   ├── HomeProfilePicture.jsx
│   │   │   ├── NeuralNetworkGlobe.jsx
│   │   │   ├── PerceptronAnimation.jsx
│   │   │   ├── FlippingCard3D.jsx           # SpinningSkillBox
│   │   │   ├── SkillCube.jsx
│   │   │   ├── TechFlowDiagram.jsx
│   │   │   └── MorphingCommsIcon.jsx
│   │   │
│   │   ├── loading/               # Loading screen
│   │   │   ├── LoadingNameTrace.jsx
│   │   │   └── LoadingProfileFrame.jsx
│   │   │
│   │   ├── navbar/
│   │   │   └── NavJumper.jsx      # Animated navigation link jumper
│   │   │
│   │   ├── sections/              # 7 page sections
│   │   │   ├── HomeSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── ServicesSection.jsx
│   │   │   ├── EducationSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   └── ContactSection.jsx
│   │   │
│   │   ├── shared/                # Shared layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MorphTransitionSlot.jsx
│   │   │
│   │   └── ui/                    # Reusable UI widgets
│   │       ├── RingCarousel.jsx
│   │       ├── EducationTimeline.jsx
│   │       ├── SkillsGrid.jsx
│   │       └── StartupLogoButton.jsx
│   │
│   ├── data/
│   │   └── portfolioData.js       # All portfolio content & personal data
│   │
│   ├── App.jsx                    # Root: loading screen + section orchestration + GSAP
│   ├── index.css                  # Tailwind directives + custom responsive CSS
│   └── main.jsx                   # Entry point + GSAP plugin registration
│
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── eslint.config.js               # ESLint flat config v10
├── index.html                     # HTML entry with CDN links & inline SVG favicon
├── package.json                   # Dependencies, scripts, metadata
├── postcss.config.js              # PostCSS with Tailwind & Autoprefixer
├── tailwind.config.js             # Custom theme (colors, fonts, breakpoints)
├── vercel.json                    # Vercel deployment & rewrites
└── vite.config.js                 # Vite build configuration
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
| JavaScript | 398.85 kB (131.87 kB) |
| CSS | 7.71 kB (2.37 kB) |

---

## Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Gmail SMTP credentials (use App Password, not your regular password)
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Where admin notifications are sent
ADMIN_EMAIL=admin@example.com

# Frontend origin (for CORS and redirects)
FRONTEND_ORIGIN=https://yourdomain.com
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
| `PERSONAL` | Name, title, email, phone, location, resume URL, profile image |
| `ABOUT_TEXT` | Array of bio paragraphs (3) |
| `ABOUT_HIGHLIGHTS` | Keywords/skills displayed as badges |
| `WEBCRAFT` | Agency branding (name, URL, SVG logo path) |
| `SOCIAL_LINKS` | Array of 8 social platforms (icon, href, label) |
| `SERVICES` | 3 services with title, description, tech stack, pricing |
| `EDUCATION` | 5 education entries with degree, institution, courses |
| `TECHNICAL_SKILLS` | 14 skills with name and percentage (0–100) |
| `PROFESSIONAL_SKILLS` | 7 soft skills with name and percentage |
| `PROJECTS` | 8 projects with description, tags, links, full modal content |
| `NAV_LINKS` | 7 navigation items mapping to section IDs |

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

The `vercel.json` configures a rewrite rule so `POST /send-contact` routes to the serverless function at `/api/send-contact.js`.

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

MIT — feel free to use, modify, and distribute. Attribution is appreciated but not required.

---

<div align="center">
  <sub>Built with passion, React, and way too many keyframes.</sub>
  <br/>
  <sub>© 2026 Muhammad Ali Aamir</sub>
</div>

# Nexagen Studio — Premium Digital Agency Website

A world-class, multilingual digital studio website with immersive 3D visuals, cinematic scroll animations, and full RTL Arabic support.

## Languages
- **English** (default)
- **French**
- **Arabic** (RTL)

## Tech Stack
- React + Three.js
- CSS Variables design system
- Custom animation primitives (scroll-triggered reveals, character splits, magnetic elements)
- IBM Plex Sans Arabic for Arabic typography
- Epilogue + Cormorant Garamond + Outfit font system

## Project Structure
```
nexagen-studio/
├── nexagen-studio.jsx    # Main React component (all sections + i18n)
├── messages/
│   ├── en.json           # English translations
│   ├── fr.json           # French translations
│   └── ar.json           # Arabic translations
├── package.json
├── next.config.js        # Next.js i18n config
└── README.md
```

## Quick Start (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Run dev server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Migrating to next-intl

The translation JSON files are ready to use with `next-intl`. Install:
```bash
npm install next-intl
```

Then configure `next.config.js` with the i18n settings and use `useTranslations()` in place of the built-in `useT()` hook.

## Features
- Interactive Three.js morphing sphere hero
- Character-level text split animations
- Magnetic hover buttons
- Custom cursor (desktop)
- Film grain overlay
- Loading screen with progress bar
- Smooth scroll-triggered section reveals
- Full RTL layout mirroring for Arabic
- Language switcher in navbar + mobile menu
- Responsive: desktop / tablet / mobile

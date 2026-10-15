# AcePak International website

One-page website for **AcePak International (Private) Limited**: Engineering | Constructions | Procurements, based in Reshun, Chitral, Khyber Pakhtunkhwa.

It is a Node.js project built with [Vite](https://vite.dev): plain HTML, CSS and JavaScript, with no framework. Vercel detects it automatically and deploys it with no extra settings.

## What's on the page

- Top bar with office, phone and a **Get a quote** button, and a sticky menu with drop-down lists
- Full-width photo slider (three slides, auto-plays every 5 seconds, with arrows, dots and pause)
- Service icons, quotation banner, "Who we work with" and "How can we help?" cards
- Message from the Chief Executive, values and the UN goals the work supports
- Key numbers, full services list, leadership and machinery, licences and registrations, contact details
- **Get a quote** form: turns the visitor's answers into a WhatsApp message to +92 320 1979227. Nothing is sent until the visitor presses send in WhatsApp, so no server or email account is needed.

## Run it on your computer

You need [Node.js](https://nodejs.org) version 20.19 or newer (version 22 or 24 recommended).

```bash
npm install      # first time only: downloads Vite into node_modules
npm run dev      # opens the site at http://localhost:5173 and reloads on every save
```

Other commands:

```bash
npm run build    # creates the finished website in the dist/ folder
npm run preview  # serves the dist/ folder at http://localhost:4173 to check the build
```

## GitHub repository

The source code is in the public [AcePak website repository](https://github.com/wali135/acepak-website). Clone it with:

```bash
git clone https://github.com/wali135/acepak-website.git
```

To publish future changes, commit and push them to the `main` branch. `node_modules/`, `dist/` and local editor settings are ignored by `.gitignore`.

## Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project** and **Import** the `acepak-website` repository.
3. Vercel detects **Vite**. Leave the settings as they are:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. The site goes live on a `.vercel.app` address in about a minute.
5. To use your own domain, open the project and go to **Settings → Domains**.

Every time you push a change to GitHub, Vercel publishes the new version automatically.

## Where to change things

| What | File |
|---|---|
| Text, sections, menu, contact details | `index.html` |
| Colours, fonts, spacing, layout | `src/styles.css` (colours are at the top, in `:root`) |
| Slider timing, quote form, WhatsApp number | `src/main.js` |
| Photos | `public/images/` (keep the same file names, or update the names in `src/styles.css` and `index.html`) |
| Logo files | `public/logo-mark.svg` (teal) and `public/logo-mark-white.svg` |
| Browser tab icon | `public/favicon.svg`, `public/favicon.png`, `public/apple-touch-icon.png` |

The brand colours come from the company letterhead:

| Name | Colour |
|---|---|
| Teal (main) | `#005460` |
| Slate | `#708f9b` |
| Mist | `#c3cad3` |
| Paper | `#ededf3` |

The WhatsApp number appears in `index.html` (links) and in `src/main.js` (quote form). Search for `923201979227` to change it everywhere.

## Before going live

- **Chief Executive's message:** the text in the "A message from our Chief Executive" section is a draft written from the company profile. Engr. Shafi Ullah should read and approve it.
- **Photos:** the current photos come from the company profile and are small. Sharper photos of real AcePak sites (at least 1600 px wide for the slider) will make the site look much better.
- **Social sharing image:** once the site has its final address, add `<meta property="og:image" content="https://YOUR-DOMAIN/images/hero.jpg">` to the `<head>` of `index.html` so links show a preview picture.

## Project structure

```
acepak-website/
├── index.html          the page
├── src/
│   ├── styles.css      all styles
│   └── main.js         menu, slider, quote form, copy buttons
├── public/             copied as-is to the website
│   ├── images/         photos
│   ├── logo-mark.svg
│   ├── logo-mark-white.svg
│   ├── favicon.svg
│   ├── favicon.png
│   └── apple-touch-icon.png
├── vite.config.js
├── package.json
└── package-lock.json
```

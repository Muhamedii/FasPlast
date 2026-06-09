# Fas Plast — Website

Trilingual (🇦🇱 Albanian / 🇩🇪 German / 🇬🇧 English) marketing website for **Fas Plast** —
PVC doors & windows manufacturer from Prelez i Muhaxherve, Kosovo.

- Instagram: [@fasplast05](https://www.instagram.com/fasplast05)
- Facebook: [Fas Plast](https://www.facebook.com/share/1D2Sa25rgZ/)
- Phone/WhatsApp: +383 44 885 649 · Email: fasplast@hotmail.com

## Stack

Pure static site — **no build step, no dependencies**. HTML + CSS + vanilla JS.
Works on any static host (GitHub Pages, Netlify, Vercel, cPanel...).

```
fasplast-web/
├── index.html        # single-page site (all sections)
├── css/style.css     # styles (brand: grey #58595B + green #8CC63F)
├── js/i18n.js        # sq / de / en translations
├── js/main.js        # language switcher, mobile nav, gallery, quote form
└── img/
    ├── logo.svg      # recreated brand logo
    └── gallery/      # ← drop real photos here (see below)
```

## How to run locally

Just open `index.html` in a browser, or:

```bash
cd fasplast-web && python3 -m http.server 8080
```

## Adding real photos

Drop photos into `img/gallery/` with these exact names:

| File | Used for |
|---|---|
| `hero.jpg` | Big hero image (best install photo, landscape) |
| `project-1.jpg` … `project-8.jpg` | Gallery grid (square crops look best) |

Missing photos automatically show an elegant placeholder — the site never breaks.

## How the quote form works

No backend needed. On submit it opens **WhatsApp** (+383 44 885 649) with a
pre-filled message containing the customer's name, phone, product and message.
The secondary button composes the same message as an **email** to
fasplast@hotmail.com.

## Deploying free with GitHub Pages

1. Move this folder to its own repo (e.g. `fasplastweb`)
2. Settings → Pages → Deploy from branch → `main` / root
3. Optionally connect a custom domain (e.g. `fasplast-ks.com`)

# TruYard prototype

Open `index.html` in a browser. Everything is local and clickable — 36 pages, no dead internal links.

Your ten original files are untouched in the parent folder. Nothing here overwrites them.

---

## What to look at

| | |
|---|---|
| `index.html` | Homepage. The hero background is **drawn in CSS**, standing in for the photograph. Bottom-right **Scrim** button toggles the dark gradient so you can see why overlaid text needs it. |
| `eagle-xl50.html` | The fullest product page. Photo leads, Specifications tab works, compare strip at the bottom. |
| `hawke-48.html` | Same template with a TBA price — the buy box adapts instead of showing a cart next to no price. |
| `cm65.html` | A stub. Layout is final, content is not. |
| `about.html` | Standard content page. Copy reviewed and approved. |
| `sitemap.html` | Every page in one view, stubs marked. |

Resize the window past 1024, 860 and 620px to see the responsive behaviour. Ctrl+P on a product page for the print stylesheet.

---

## How it's built

```
_build/
  site-data.json     ← all copy, products, specs, prices
  build.py           ← generates every page
prototype/           ← output; safe to delete and regenerate
```

Rebuild after any change:

```
cd _build
python build.py
```

The header, nav, footer and copyright bar are defined **once** in `build.py`. There is no copy-pasted chrome. Adding a product means adding an entry to `site-data.json` — not writing a page.

### Adding photos

Drop files into `_build/src/photos/` and run the build. No JSON, no code.

```
eagle-xl50-01.jpg          → XL50 main picture
eagle-xl50-02.jpg          → XL50 thumbnail
eagle-xl50-03-field.jpg    → XL50 thumbnail, full bleed (a real photograph)
cm65-01.jpg                → CM65 main picture
```

Filename prefix = the product slug. Number sets the order, lowest first.
`-field` on the end means full-bleed; anything without it gets the mount.

However many files exist is however many thumbnails appear. One photo, no
thumbnail strip. Four photos, four thumbnails.

Hand over full-size originals — don't resize first. The build generates 400px,
800px and 1600px copies and serves each device the one it needs. Originals stay
in `src/photos/` and never ship.

The build report lists what it found, what's still coming from the old site,
and any file whose name it couldn't match — so nothing vanishes silently.

Full instructions live in `_build/src/photos/HOW-TO-ADD-PHOTOS.txt`.

### Getting the old images off truyard.co.th

Five products still load their picture from the current live site. To pull them
local, run once:

```
cd _build
python fetch-old-images.py
python build.py
```

Local files always beat the remote URL, so your own photography overrides
anything fetched. It won't overwrite files you've already added.

### The photo rule

```json
"shot": "cutout"   // pure white background  →  mounted
"shot": "field"    // a photograph           →  full bleed, no frame
```

(Only needed for images set by URL in the data file. Photos in `src/photos/`
carry it in the filename instead.)

**`cutout`** — white bed, grey mat (`#E3E0D6`), page. The subject has no edge of its
own, so the mount supplies one. This is the default, and it's what nearly all
your product photography will be: chippers, mulchers, studio shots of the mowers.

**`field`** — fills its box corner to corner, no frame at all. A photograph already
has its own edges, tone and depth. Matting one makes the page look like a
scrapbook.

Set it once per product in `site-data.json`. It then applies consistently to the
product hero, the gallery thumbnails, the category cards and the homepage tiles —
you can't get it wrong on one page and right on another. Mat and bed widths scale
per context, so a thumbnail stays in proportion with a full-size hero.

Placeholders always render mounted, since they stand in for a cut-out.

### Adding a product

```json
{
  "slug": "cm65",
  "name": "CM65 Chipper/Mulcher",
  "shortname": "CM65",
  "kind": "Chipper/Mulcher",
  "category": "chipper-mulchers",
  "built": true,
  "shot": "cutout",
  "summary": "…",
  "image": "assets/products/cm65.jpg",
  "price": "00,000.00 THB",
  "cta": "CALL FOR MORE INFORMATION ON THE CM65",
  "lede": "…",
  "glance": [["Label", "Value"], …],
  "features": ["Spec — benefit", …],
  "specs": [["Label", "Value"], ["Label", null]]
}
```

`"built": false` renders a stub. `null` in a spec value renders "To be confirmed". Features split on the em dash — the part before it is bolded automatically.

---

## Filename mapping

| Original | Prototype |
|---|---|
| `1 truyard-homepage-v4.html` | `index.html` |
| `2 Find_a_Dealer_page_en.html` | `find-a-dealer.html` |
| `3 truyard-about.html` | `about.html` |
| `4 Eagle_series_page_en.html` | `eagle-series.html` |
| `5 Hawke_series_page_en.html` | `hawke-series.html` |
| `6 Eagle_XL46_product_page_en.html` | `eagle-xl46.html` |
| `7 Eagle_XL50_product_page_en.html` | `eagle-xl50.html` |
| `8 Eagle_XK50_product_page_en.html` | `eagle-xk50.html` |
| `9 Hawke48_product_page_en.html` | `hawke-48.html` |
| `91 Hawke54_product_page_en.html` | `hawke-54.html` |
| — new — | `products.html`, `contact.html`, `sitemap.html`, `support.html`, `shipping.html`, `warranty.html` |
| — new — | 5 category pages, 15 product stubs |

---

## Fixed from the originals

- **Responsive.** Was 0 media queries; now 7 breakpoints plus print and reduced-motion.
- **Palette.** Was 33 colours; now 10 tokens. The off-palette blue tile bars are gone, as is the second yellow and the deprecated gold.
- **Links.** Every internal link resolves. `index.html` and the contact page now exist.
- **Duplicate copyright bars** removed (were in 7 of 10 files).
- **Specifications tab works** and holds a real table. Known values are filled from your existing copy; the rest say "To be confirmed".
- **Dead CSS** gone — `.topbar`, `.navbar`, `.footer`, `.logo`, `.line-badge`, `.draft-tag`, `.sidebar`.
- **Logo** is one cached 23KB PNG, not 31KB of base64 in every page.
- **SEO/social**: description, og:, canonical, hreflang and `lang="en"` on all 36 pages.
- **Accessibility**: skip links, landmarks, focus rings, one h1 per page, alt text on every image, keyboard-navigable tabs.
- **Category sidebar dropped** from product and content pages — it's replaced by breadcrumbs and the compare strip.

**Size:** 36 pages total 302KB. The 10 originals were 2.65MB.

---

## Still outstanding

1. **Hero photograph** — the homepage scene is drawn in CSS as a stand-in. Photographer booked.
2. **`c130` has no photo.** Every other product has one.
3. **Twelve photos are below 800px** and will look soft as a main product image. Three are under 500px — `c100` (132×200), `cm95`, `cm90` — and should be reshot. The build reports these every run.
4. **Spec data** — most rows say "To be confirmed"; stubs have none at all.
5. **Nothing submits.** No forms are wired. Add to Cart, Request a Callback and the enquiry form are inert.
6. **No Thai version.** The flag is in the header; `hreflang` is stubbed to `/th/`.
7. `noindex` is set on every page — remove when this goes live.

**Done:** product images no longer load from `truyard.co.th`. All 19 are local.
`fetch-old-images.py` is kept in case you need it for something else, but it has
nothing left to fetch.

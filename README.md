# TruYard site — Eleventy + Decap CMS + Netlify

This is a working prototype of the GitHub + Netlify path, with the
editing gap (the thing static sites don't normally have) filled in by
Decap CMS. Two pages are built out — Hawke 48 and Hawke 54 — using
the corrected specs (cutting height 1.5"–5.5", height fields marked
pending factory measurement, corrected contact details in the footer).

## What's actually in here

- `src/products/*.md` — one file per product. This is exactly what
  Decap CMS edits, so anything typed into the dashboard writes
  straight into these files.
- `src/_includes/` — the two templates (page shell, product page).
  Changing these changes every product page at once.
- `src/admin/` — the Decap CMS dashboard itself (`/admin` on the
  live site).
- `src/_data/site.json` — contact details and nav links, also
  editable from the CMS ("Other Pages" → "Site Settings").
- `netlify.toml` — tells Netlify how to build the site and routes
  `/admin/*` correctly.

## 1. Run it locally first

```
npm install
npm start
```

Opens a local preview at `http://localhost:8080`. The CMS dashboard
won't work locally (it needs Netlify Identity, see below) — this is
just to check the site itself builds and looks right.

## 2. Push to GitHub

Create an empty repository on github.com first (don't initialize it
with a README — this project already has one), then:

```
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 3. Connect Netlify

1. In Netlify: **Add new site → Import an existing project → GitHub**,
   pick this repo.
2. Build settings should auto-fill from `netlify.toml`
   (command `npm run build`, publish directory `_site`) — confirm
   and deploy.

## 4. Turn on the CMS login (Netlify Identity + Git Gateway)

This is the piece that makes the dashboard actually work instead of
just displaying a login screen forever:

1. Site settings → **Identity** → Enable Identity.
2. Under Identity → Registration, set it to **Invite only** (so
   nobody but people you invite can log into your CMS).
3. Site settings → Identity → Services → Enable **Git Gateway**.
   This is what lets Decap CMS commit to GitHub on your behalf
   without you handling a GitHub token yourself.
4. Identity tab → **Invite users** → send yourself (and anyone else
   who'll edit content) an invite.

Once that's done, visit `yoursite.netlify.app/admin`, accept the
invite, log in, and the dashboard opens — add a product, save, and
it becomes a real commit in the GitHub repo, which redeploys the
site automatically.

## 5. Custom domain

Once the domain is recovered from the agency, Site settings →
Domain management → Add a domain, then point the DNS at Netlify's
values (Netlify shows you exactly what to add). Separate step from
everything above — not blocking on it.

## What this doesn't cover yet

- **Only 2 of the ~17 products are built.** The rest of the
  finished copy from the other chat needs to be dropped into
  `src/products/` in the same frontmatter shape, or typed straight
  into the CMS once it's live.
- **Dealer map** — placeholder only. A small Leaflet map reading a
  data file is the natural fit; needs the actual dealer list first.
- **Parts/accessories store** — no WooCommerce equivalent exists in
  a static site. Snipcart or Ecwid are the realistic options if this
  stack is the final choice, and neither is wired up here yet.
- **Thai translations** — not structured yet. The realistic pattern
  is a parallel `src/products-th/` folder plus an Eleventy
  `permalink` per language, but that's a real decision to make
  deliberately rather than bolt on later.

# Push to GitHub → Live in 60 Seconds

The folder is already a git repo with one initial commit (`cb48b1d` — "FlexWorks Denver II — initial deal site (v2 cinematic build)"). You just need to create an empty repo on github.com and push.

---

## Step 1 — Create an empty GitHub repo (30 sec)

1. Go to [github.com/new](https://github.com/new).
2. Owner: your account (or a GSC org if you have one).
3. Repository name: `flexworks-denver-2` (or whatever you prefer).
4. Visibility: **Private** (recommended for a confidential deal page).
5. **Leave everything else unchecked** — don't add a README, .gitignore, or license. The repo needs to be empty.
6. Click **Create repository**.

GitHub will show you a "push an existing repository" snippet. Copy the URL (looks like `https://github.com/your-user/flexworks-denver-2.git`).

---

## Step 2 — Push from your Mac (30 sec)

Open Terminal and run:

```bash
cd "/Users/codyleivas/Library/CloudStorage/Dropbox-Personal/04_Business/Capistrano Real Estate Advisors/CAPO - Greenwich Street/Deals/1800-E-69th-Denver"

# Paste the URL GitHub showed you (replace this one):
git remote add origin https://github.com/your-user/flexworks-denver-2.git

git push -u origin main
```

That's it. The repo is live on GitHub.

---

## Step 3 — Turn on GitHub Pages to get a live URL (60 sec)

The repo already includes `.github/workflows/pages.yml` — it auto-deploys the static site to GitHub Pages on every push.

1. On your repo page: **Settings → Pages**.
2. Source: **GitHub Actions**.
3. (Optional) Custom domain: enter `deals.greenwichstreetcap.com` or similar later.

Within ~90 seconds of step 2, your site will be live at:

```
https://<your-user>.github.io/flexworks-denver-2/
```

The Actions tab on the repo shows the build progress. When the green check appears, refresh the URL.

> **What works on GitHub Pages:** the full static site — hero animations, sensitivity explorer, calculator UI, photo gallery, all sections.
>
> **What doesn't work on GitHub Pages:** the serverless API endpoints in `/api` (Pages is static-only). The calculator's "Email me my projection" and the activity tracking won't fire emails. For that, deploy to Vercel instead — see `BACKEND_SETUP.md`.

---

## Iterating

After pushing, every commit you make and push will auto-redeploy the site:

```bash
# Make changes locally...
git add -A
git commit -m "Hero photo swap"
git push
```

The GitHub Action republishes within ~60 seconds.

---

## If you want the email backend too (Vercel — 10 more min)

Once the repo is on GitHub:

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your GitHub repo.
3. Framework Preset: **Other**. Click **Deploy**.
4. In Vercel → Settings → Environment Variables, add `RESEND_API_KEY` and `GSC_NOTIFY_EMAIL`. Redeploy.
5. Your live URL is `flexworks-denver-2.vercel.app` (or a custom domain).

Vercel runs both the static site AND the `/api/*` serverless functions. Recommend this as the primary deploy target; use GitHub Pages as a fallback/preview.

Full Vercel walkthrough in `BACKEND_SETUP.md`.

---

## Repo contents at a glance

```
flexworks-denver-2/
├── .github/workflows/pages.yml   ← auto-deploys to GitHub Pages
├── .gitignore
├── README.md                     ← project overview
├── BACKEND_SETUP.md              ← Vercel + Resend deployment
├── GITHUB.md                     ← (you are reading)
├── index.html                    ← the deal site (v2 cinematic)
├── index-v1.html                 ← v1 fallback
├── package.json
├── vercel.json
├── .env.example                  ← env var template
├── api/
│   ├── _email.js                 ← Resend helper
│   ├── track.js                  ← investor activity → email
│   └── tearsheet.js              ← personalized PDF projection → email
└── assets/
    ├── tokens.css
    ├── components.css
    ├── brand/                    ← GSC logos + favicons
    └── images/
        ├── property/             ← 8 property photos
        ├── maps/                 ← 6 location maps
        ├── charts/               ← vacancy chart
        ├── team/                 ← Conner headshot
        ├── case_study/           ← FlexWorks I (Beach) photos
        ├── pages/                ← 32 IM page renders
        └── raw/                  ← 87 raw extracts (kept for future use)
```

---

*Greenwich Street Capital · FlexWorks Denver II · v1.0 — May 2026*

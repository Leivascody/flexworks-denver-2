# FlexWorks Denver II — Investor Microsite

Single-file deal microsite for **1800 East 69th Avenue, Denver, CO**. Built on the GSC brand system. Modeled on the structure of `stag.bluebirdcre.co`.

## Quick preview (local)

Just open `index.html` in a browser. Everything works from the local filesystem — no build step, no server.

The page opens with an accredited-investor access gate. Fill the form (or click "Continue") and the gate dismisses for the session.

---

## Folder layout

```
1800-E-69th-Denver/
├── index.html                       ← the deal microsite (single file)
├── README.md                        ← you are here
└── assets/
    ├── tokens.css                   ← GSC design tokens (copied from /Brand)
    ├── components.css               ← shared component styles
    ├── brand/                       ← GSC logos + favicons
    │   ├── GSC_Logo_Primary.svg
    │   ├── GSC_Favicon.svg
    │   ├── GSC_Favicon_180.png
    │   └── ...
    └── images/
        ├── property/                ← property photographs (extracted from IM)
        │   ├── aerial-hero.jpg            ← main hero shot (5 buildings)
        │   ├── aerial-with-lease-sign.jpg ← used as hero background
        │   ├── aerial-with-outline.jpg    ← parcel boundary outlined
        │   ├── exterior-units-closeup.jpg ← doors + parking
        │   ├── roof-panorama.jpg
        │   └── roof-panorama-2.jpg
        ├── maps/                    ← location maps
        │   ├── denver-radii-1-5-mile.jpg
        │   ├── denver-flexworks-locations.jpg
        │   ├── north-central-submarket.jpg
        │   ├── parcel-aerial-satellite.jpg
        │   └── ...
        ├── charts/
        │   └── denver-industrial-vacancy.jpg
        ├── case_study/              ← FlexWorks Denver I (Beach) reference photos
        │   ├── flexworks-denver-i-exterior.jpg
        │   └── flexworks-denver-i-detail.jpg
        ├── pages/                   ← every page of the source IM as JPG
        │   ├── page-01.jpg ... page-32.jpg
        └── raw/                     ← all 87 images extracted from the IM
            └── img-000.jpg ... img-086.png
```

The `pages/` and `raw/` folders are kept so you can pull additional assets without re-extracting from the PDF.

---

## Deploying to a real domain

Option 1 — **Netlify / Vercel drop**: Drag the entire `1800-E-69th-Denver/` folder into Netlify Drop or `vercel --prod`. Done. Both serve static files for free.

Option 2 — **Subdomain on Wix or any host**: Upload everything to a folder like `/deals/denver-ii/` on the existing greenwichstreetcap.com infrastructure. All paths in `index.html` are relative, so it'll work from any subpath.

Option 3 — **Investor portal**: Drop the folder into Juniper Square as a custom URL.

**Suggested live URL:** `deals.greenwichstreetcap.com/denver-ii` or `flexworksdenver2.com`.

---

## Sections on the page

1. **Access gate** — accredited-investor attestation + name/email capture
2. **Sticky nav** — anchors to each section + persistent "Invest" CTA
3. **Hero** — aerial bg + headline + 4 KPIs (Investor IRR · EM · YoC · Min Investment) + 2 CTAs
4. **Sponsor Update band** — gold highlight calling out Beach lease performance
5. **Executive Summary** — narrative left, 4 metric cards right
6. **Investment Highlights** — 6 callout cards (33% below mkt, 37% below repl, 99% occ at Beach, 300k+ residents, 0 competitive supply, SEPM mgmt)
7. **Property Photos** — asymmetric photo gallery (6 images, hover captions)
8. **Property Overview** — building specs + land details + amenities
9. **Market** — Denver radii map + 3 stats + narrative + vacancy chart + submarket map
10. **Lease Comparables** — full table with subject highlighted in gold
11. **Business Plan** — 5-step timeline with gold connecting rule
12. **Sources, Uses & Returns** — side-by-side tables + projected NOI bar chart
13. **Sensitivity Analysis** — full sensitivity table (market rents / opex / exit cap)
14. **Capital Structure** — 3 columns (debt terms / fee schedule / waterfall)
15. **Investor Calculator** — interactive: $100K / $250K / $500K / $1M presets or freeform amount, year-by-year cash flow projection
16. **Case Study: FlexWorks Denver I** — Beach Street photo + narrative + mini stats
17. **The Sponsor** — 4 team cards (Conner Thomas, Greg Houge, Doug Jensen, David Thomas) + FlexWorks brand + SEPM notes
18. **Documents** — data room list with request-access buttons
19. **Closing CTA** — navy block, gold heading, dual CTAs
20. **Contact form** — name / email / phone / investor type / interest level / message
21. **Footer** — GSC nav + corporate links
22. **Disclaimer** — full confidential investment summary boilerplate

---

## Editing for a future deal

To clone this site for a new property:

1. Copy the entire `1800-E-69th-Denver/` folder, rename it (e.g. `Houston-Westchase/`).
2. Open `index.html`. Find/replace the property name, address, KPI numbers.
3. Drop new property photos into `assets/images/property/` with the same filenames.
4. Update the sources/uses, returns, sensitivity, comp, and team data.
5. Update OG meta tags at the top of the file (title, description, image path).

For a full rebrand (new sponsor), update the logo files in `assets/brand/` and edit the navigation block.

---

## Where the data came from

All figures pulled directly from the April 2026 Confidential Investment Memorandum (32 pages). Source PDF available at:
`/uploads/1800 E 69th_Investment Memo_04.01.2026.pdf`

The investor cash flow calculator base case is the $250K table on page 18 of the IM (Year 0 –$250K → Year 5 +$434,364, totaling $247,558 profit / 16.6% IRR / 2.0x). All other amounts scale proportionally.

---

## Tech notes

- Single-file HTML, no build step, no JS framework.
- 28 KB HTML + 18 KB CSS + ~2 MB of optimized property/map JPGs.
- Mobile-responsive: nav collapses, gallery stacks to 2-up, calculator works on touch.
- Works offline (no CDN dependencies for fonts when cached; otherwise Google Fonts).
- WCAG 2.2 AA color contrast cleared on all approved navy/gold/white/ink combinations.

*Greenwich Street Capital · v1.0 · April 2026*

# Suggested Prompts (4-Step Phased Build)

Breaking the build into 4 self-verifying prompts keeps each turn fast and lets you switch models between steps:

## Step 1 — Scaffold, i18n, PIX Library & Bilingual Seed Content

Recommended model: Gemini Flash or Claude Sonnet

    Approved. Execute Phase 1 of the implementation plan: scaffold the Astro 7 + Tailwind v4 project, implement src/i18n/*, src/lib/pix.ts,
    src/lib/settings.ts, src/content.config.ts, and src/lib/content.ts, seed all bilingual PT-BR/EN YAML pages, blog posts, organizations,
    and placeholder assets, and run npm run check plus Vitest unit tests for i18n.test.ts and pix.test.ts. Stop after Phase 1 passes.

## Step 2 — Design System, Layouts, Components & All PT/EN Pages

Recommended model: Claude Sonnet (or Argon if you want extra design polish)

    Execute Phase 2 of the implementation plan: build src/styles/global.css, BaseLayout.astro, Header/Footer/SEO, all page components
    (TeamGrid with founder/teacher/tutor/staff + Alumni badge, IncentiveHighlight for Lei de Incentivo ao Esporte & International Grants,
    TierCard, PixDonation, CrowdfundingCard, forms), all shared views in src/views/, and all pt-BR and en-US routes in src/pages/
    (including RSS feeds). Verify with npm run check and npm run build. Stop after Phase 2 passes.

## Step 3 — Sveltia CMS (/admin), Cloudflare Pages Functions & Full Test Suite

Recommended model: Claude Sonnet or Gemini Flash

    Execute Phase 3 of the implementation plan: create public/admin/index.html and public/admin/config.yml, implement the Cloudflare Pages
    Functions (functions/oauth/* and functions/api/forms/[form].ts), add public/_headers and public/_redirects, and write and run
    content-parity.test.ts, functions.test.ts, and dist.test.ts against the production build. Stop after Phase 3 passes.

## Step 4 — Editor/Cloudflare Docs & Final Walkthrough

Recommended model: Gemini Flash

    Execute Phase 4 of the implementation plan: write README.md, docs/guia-do-editor.md (in Portuguese), and docs/setup-cloudflare.md, run
    the full verification suite (npm run check, npm run build, npm test, npm run lint), and generate the walkthrough.

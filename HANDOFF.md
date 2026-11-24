# Portfolio redesign handoff

Updated 24 November 2026. Repository: `reddy5310/portfolio`. Local checkout: `D:\Portfolio Satya`. Hosting: GitHub Pages, https://reddy5310.github.io/portfolio/.

## What changed

One cohesive design now connects enterprise platform leadership, applied AI and independent products. It uses light reading surfaces, graphite architecture/lab sections, cobalt accents and the existing fonts and product imagery.

- Rebuilt `index.html`: stronger introduction, qualified impact figures, three flagship work summaries, infrastructure lab, flagship products, compact project archive, career timeline, engineering principles, expandable credentials and contact.
- Added three dedicated, directly linkable case studies under `work/`: GenAI platform, modernization and IaC governance. They explain the documented work, conceptual architecture, governance and measurement scope. Engineering perspectives are separated from measured outcomes.
- Added current **Wiz for IaC work at MSD** to the homepage, case study, web résumé, skills and regenerated PDF. More detailed Wiz responsibilities were not supplied; do not invent integration or enforcement details.
- Added an infrastructure walkthrough with two prepared scenarios: private service/database and event worker. Five inspectable stages cover request, architecture, fictional Terraform, policy and approval. A public-access switch introduces a policy failure; removing it restores the review state. No cloud action or model request occurs.
- Replaced the command palette with a native accessible search dialog. It searches curated project/capability descriptions and keywords, supports Ctrl/Command K, arrow-key navigation, ordinary Tab navigation, Escape and focus restoration.
- Added direct project anchors and automatic opening of archive/credentials when deep-linked.
- Refreshed the 1200 × 630 social-share image and added a sitemap for the homepage, case studies and résumé.
- Preserved all existing small projects, certifications, education, social links and contact information. Full career detail remains in `resume.html`.
- Removed obsolete `css/site.css` and `js/site.js`; the active files are `css/portfolio.css` and `js/portfolio.js`.

## Source of truth

The committed HTML/CSS/JS are the source of truth. There is no build step. `css/tokens.css` still supplies shared fonts and the résumé's design tokens. The homepage and case-study layout is in `css/portfolio.css`.

`.local/` is ignored. It holds development dependencies, screenshots, an original-page backup and one-off assembly scripts. Those scripts are not the build system and should not be rerun over later edits.

The search index is the `entries` array in `js/portfolio.js`. Keep its descriptions, keywords and destinations current when adding or renaming content. Case-study navigation/footer markup is static and shared by convention.

## Claims and content boundaries

- 545+ applications: AI-assisted modernization portfolio scope; not completed upgrades.
- 538+ applications: a separately reported cross-functional transformation scope; the relationship is not confirmed as a subset and the scopes must not be added together.
- ~$12M: annual program-level savings Satya contributed to, not solely attributable to him or to one case study.
- 400+ platform users and 40 concurrent sessions: different measures, not an inferred throughput or reliability benchmark.
- 14/25 (56%): validation snapshot recorded in November 2026, not a live counter or production acceptance claim.
- Wiz: current IaC work at MSD; detailed responsibilities/outcomes need Satya's confirmation.
- Lab: fictional module names and prepared checks; never present these as real Wiz/Checkov output.
- JevBrowse's 58% memory reduction is qualified as its own benchmark after disposing four of five renderers.

## Verification

`scripts/verify-site.cjs` runs browser checks against a local server. See README for setup. It covers five HTML pages at four widths, local destinations and anchors, search navigation/focus restoration, both lab scenarios, failure/recovery, disclosure deep links and no-JavaScript behavior. It can regenerate the three-page résumé PDF with `--pdf`.

The final functional run passed on five pages at 1440, 900, 390 and 320px, with 62 local destinations checked. Desktop and mobile QA captures are in `.local/qa/`; product imagery, mobile policy blocking and mobile search were visually inspected. The three-page PDF text was checked for both Wiz additions. External product links were preserved; their applications are separate repositories and were not changed. No Lighthouse score or field performance measurement is claimed.

## Optional future work

The initial redesign intentionally contains no live AI assistant. An evidence-linked assistant would need a separately configured backend, model access, costs/limits and an approved source corpus. More detailed outcome data and Wiz responsibilities can strengthen the case studies when available.

Before future deployment, update the web résumé and PDF together, run the browser checks, commit/push to `main`, and verify the Pages deployment for the pushed commit.

# Satyanarayana Reddy — portfolio

Live at **https://reddy5310.github.io/portfolio/**. GitHub Pages serves the root of this repository from `main`. There is no production framework, build step, model API or runtime dependency.

The November 2026 redesign brings together platform leadership, applied AI and independent products. Current work with **Wiz for Infrastructure as Code at MSD** appears in the homepage, IaC case study, web résumé and downloadable PDF.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Homepage, selected work, interactive lab, projects, career, credentials and contact |
| `work/genai-platform.html` | Enterprise GenAI platform case study |
| `work/modernization.html` | Application modernization case study |
| `work/iac-governance.html` | IaC and governance case study, including current Wiz work |
| `css/portfolio.css` | Shared responsive design for homepage and case studies |
| `css/tokens.css` | Shared typography and legacy résumé design tokens |
| `js/portfolio.js` | Optional search dialog, infrastructure lab, disclosure links and copy-email |
| `resume.html` | Printable résumé and source for the PDF |
| `assets/Satyanarayana-Reddy-Resume.pdf` | Downloadable résumé |
| `scripts/verify-site.cjs` | Browser regression checks and optional PDF regeneration |
| `HANDOFF.md` | Implementation notes and context for Claude or another contributor |

Edit the HTML files directly. `.local/` contains ignored development dependencies, QA screenshots and one-off preparation files; nothing in it is a source of truth or required to serve the site. Do not rerun its one-off assembly scripts after editing the final HTML.

## Preview

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. Search works with the visible button or Ctrl/Command K. All primary content and navigation remain usable without JavaScript.

## Browser checks and résumé PDF

Install the optional browser-testing dependency in the ignored local folder:

```powershell
npm install --prefix .local --no-save --package-lock=false playwright@1.65.1
```

Use an installed Chromium executable:

```powershell
$env:CHROME_PATH = 'C:\path\to\chrome.exe'
node scripts/verify-site.cjs
node scripts/verify-site.cjs --pdf
```

Or install Playwright Chromium with `node .local/node_modules/playwright/cli.js install chromium` and omit `CHROME_PATH`. Keep the preview server running. `PORTFOLIO_URL` optionally changes the base URL. `--pdf` regenerates the résumé only after the browser checks. QA images are saved in `.local/qa/`.

The checks cover all five pages, 1440/900/390/320px widths, local links and anchors, keyboard search, both lab scenarios, policy blocking and recovery, disclosure deep links, JavaScript errors and a no-JavaScript mobile fallback.

## Content rules

- Keep Wiz scope limited to confirmed current IaC work unless Satya provides more detail.
- 545+ is modernization scope, not completed migrations. The separately reported 538+ application program scope is not additive.
- ~$12M is annual program-level savings contributed to through cross-functional work.
- 14/25 is the November 2026 validation snapshot; it is not a live production-deployment counter.
- The lab is illustrative and deterministic. It does not call an AI model, run Wiz/Checkov or deploy infrastructure.
- The JevBrowse 58% memory result is an internal workload measurement, not a general comparison.
- Keep the web résumé and PDF synchronized whenever professional details change.

## Publish

Commit the reviewed source and PDF to `main`, then push to `origin`. Verify the GitHub Pages build for that commit and the live pages. No Sites hosting configuration is used; the existing GitHub Pages deployment is retained.

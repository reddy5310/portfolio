# Satyanarayana Reddy — portfolio

Live at **https://reddy5310.github.io/portfolio/**

Senior Manager for DevOps, Cloud & AI Platform Engineering. The site covers enterprise platform work, experience, personal projects, certifications and contact details, with a downloadable résumé ([PDF](assets/Satyanarayana-Reddy-Resume.pdf) · [web](resume.html)).

## How it's built

Plain HTML, CSS and a small amount of JavaScript. No framework and no build step; GitHub Pages serves the repository root.

| Path | What |
|---|---|
| `index.html` | The portfolio |
| `resume.html` | Printable, ATS-friendly résumé (source of the PDF) |
| `css/tokens.css` | Design tokens: colours (OKLCH), type, spacing, motion |
| `css/site.css` | Page styles; every colour and font comes from a token |
| `js/site.js` | Command palette (Ctrl/⌘ K), scroll-spy, copy-email, hero type-in |
| `assets/` | Images, social card and the résumé PDF |

Press **Ctrl K** (or **⌘ K**) on the site to jump to any section, copy the email address or download the résumé.

## Updating the résumé PDF

Edit `resume.html`, then print it to PDF with headless Edge or Chrome:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="assets\Satyanarayana-Reddy-Resume.pdf" "file:///$((Get-Location).Path -replace '\\','/')/resume.html"
```

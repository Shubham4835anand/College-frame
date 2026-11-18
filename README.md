# Alumni Speaker Showcase — Warm Editorial Edition

A zero-setup, magazine-style personal showcase website built for returning to your college as a guest speaker. Everything is powered by pure **HTML, CSS, and JavaScript** with a single easy-to-edit content file (`data.js`).

## Quick Start (3 Minutes to Personalize)

1. **Open `data.js`** in any text editor and update:
   - Your name, role, company, and batch (`speaker` & `event`)
   - Your chapters in `timeline` (add, edit, or reorder freely — the era filters update automatically!)
   - Your social links & email in `connect`
2. **Swap the photos** inside the `assets/` folder:
   - Replace `assets/speaker-portrait.jpg` with your own portrait (3:4 vertical works best)
   - Replace `assets/campus-story.jpg` with a favorite campus/workspace photo (16:9 landscape)
3. **Preview locally**: Double-click `index.html` to open it in any browser.

## Stage Mode & Audience QR Code

- **Stage Mode** (top-right button): Scales typography cleanly for auditorium projectors, expands all student takeaways, and lets you step through your talk with `←` / `→` arrow keys (`Esc` to exit).
- **QR & Share** (top-right button): Opens a clean QR dialog you can project at the end of your talk so students can scan and open your story & links on their phones. Once deployed, set `connect.shareUrl` in `data.js` (or leave it blank to use the live page URL automatically).

## Free 1-Minute Hosting

- **Netlify Drop**: Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag-and-drop this entire folder.
- **GitHub Pages**: Push this folder to a GitHub repo and enable Pages in Settings → Pages.

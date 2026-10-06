# junekinns.github.io

Plain HTML/CSS/JS. No build step. Push to `main` and GitHub Pages serves it.

- Content: `index.html` (news items, project cards, entries)
- Media: drop files into `assets/media/` using the names in each card's `data-src` (or `data-before` / `data-after`). The placeholder disappears once the file exists.
  - Video: H.264 `.mp4`, muted loop, under ~5 MB (`ffmpeg -i in.mov -vf scale=1280:-2 -an -crf 28 out.mp4`)
- Preview locally: `python3 -m http.server` then open http://localhost:8000
- Visitor stats: https://junekinns.goatcounter.com (GoatCounter, free; script is at the bottom of `index.html`). Shows visit time, country, referrer — a spike from Germany usually means a recruiter. GitHub's own repo traffic is under Insights → Traffic (last 14 days only).
- CV: `assets/June_Kim_CV.pdf` — replace with the latest resume PDF from `~/study/job-helper/output/<company>/` when applying somewhere new.

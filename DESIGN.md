# Noven visual direction

User requirements, updated 2026-10-07:

- Restore the project's original warm white and neutral dark gray palette.
- The background needs a visible gradient while any pink remains extremely faint. Avoid a pink page fill or green background.
- Keep Noven as the project name, with an artistic Latin wordmark in the navigation.
- Chinese text must be clear, with consistent navigation typography and readable sizes across devices.
- Keep the original learning content and native scrolling. Deployment follows user review of the local preview.

Current implementation choices (subject to preview feedback):

- Background: original warm white (#f8f7f4), original lavender (#e2d9f3) and champagne (#fdf0d5) light fields, plus the original fine grid. A restrained blush replaces the green light field. Gradients are static.
- Text and controls: original slate/charcoal colors. No rose colored primary buttons.
- Wordmark: Dancing Script. Chinese display titles: self-hosted Noto Serif SC at weight 600. Navigation: self-hosted Noto Sans SC at weight 500. English home labels: DM Mono at weight 400. Fonts have distinct roles; the previous all-sans title treatment was rejected in preview.
- The introductory paragraph under the home title has been removed at the user's request; do not re-add generic explanatory copy.
- Body reading fonts retain the existing serif/WenKai choices; mobile body 17px, desktop 18px.
- Shared motion and navigation are in `assets/site-ui.css` and `assets/site-ui.js`. Regenerate navigation with `python3 scripts/sync-site-shell.py`.

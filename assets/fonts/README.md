# Noven display fonts

Self-hosted Google Fonts subsets, downloaded 2026-10-07:

- `noven-wordmark.ttf`: Dancing Script, weight 700, letters used in “Noven”. CSS family: `Noven Signature`.
- `noven-title.ttf`: the earlier LXGW WenKai TC title subset; retained as an unused asset, no longer preloaded.
- `noven-editorial-title.ttf`: Noto Serif SC, weight 600, Chinese home and page titles. CSS family: `Noven Editorial`.
- `noven-meta.ttf`: DM Mono, weight 400, English home labels. CSS family: `Noven Meta`.
- `noven-ui.ttf`: Noto Sans SC, weight 500, navigation and menu labels. CSS family: `Noven UI`.
- `noven-display.ttf`: the earlier ZCOOL title subset; retained as an unused asset, no longer loaded by the site.

The active font files are served locally so the wordmark, Chinese title and navigation retain their appearance across devices. Other body text keeps the existing reading fonts and platform fallbacks. When adding different display text or navigation labels, regenerate the corresponding subset to include its characters.

Sources: [Dancing Script](https://fonts.google.com/specimen/Dancing+Script), [Noto Serif SC and Noto Sans SC](https://github.com/notofonts/noto-cjk), [DM Mono](https://fonts.google.com/specimen/DM+Mono), [earlier LXGW WenKai TC](https://github.com/lxgw/LxgwWenkaiTC), [earlier ZCOOL QingKe HuangYou](https://fonts.google.com/specimen/ZCOOL+QingKe+HuangYou).

Original SIL Open Font Licenses are included in this directory. CSS family aliases are local display names; the original authors retain copyright.

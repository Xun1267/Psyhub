"""Generate a shared navigation shell into the existing static HTML pages."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PRIMARY = [
    ('home', '总览', 'index.html'),
    ('courses', '本科课程', 'undergraduate/index.html'),
    ('reading', '学习方法', 'article.html?id=metacognition'),
    ('exam', '考研备考', '考研全攻略.html'),
    ('practice', '练习题库', '刷题.html'),
    ('research', '研究探索', 'psychology40/index.html'),
]
MORE = [('备考时间线', '按阶段安排复习', '备考时间线.html'), ('资源合辑', '常用资料与学习资源', '资源合辑.html')]
CALENDAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="4"/><path d="M8 3v4m8-4v4M4 11h16m-10 5h4"/></svg>'
MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14M5 16h14"/></svg>'

def remove_block(text, pattern):
    match = re.search(pattern, text)
    if not match:
        return text
    tag = re.match(r'<(\w+)', match.group().lstrip()).group(1)
    depth = 0
    for token in re.finditer(r'</?' + tag + r'\b[^>]*>', text[match.start():]):
        depth += -1 if token.group().startswith('</') else 1
        if depth == 0:
            return text[:match.start()] + text[match.start() + token.end():]
    raise ValueError('Unclosed navigation block')

def metadata(path):
    name = path.name
    if path.parts[0] == 'undergraduate':
        return 'courses', 'courses' if name == 'index.html' else ('flashcards' if '闪卡' in name else 'course-quiz' if '题库' in name else 'course-reader')
    if path.parts[0] == 'psychology40' or name == '裂脑交互.html': return 'research', 'research'
    if name == 'index.html': return 'home', 'home'
    if name in ['article.html', '总论_学习到底是什么.html', '抄笔记_到底有没有用.html']: return 'reading', 'reading'
    if name == '个人日历.html': return 'calendar', 'calendar'
    if name == '资源合辑.html': return 'resources', 'resources'
    if name == '刷题.html': return 'practice', 'practice'
    if name == '章节习题.html': return 'practice', 'chapters'
    if name.startswith('章节习题_') or '真题' in name: return 'practice', 'exam-paper'
    if name == '312考试大纲.html': return 'exam', 'outline'
    if name == '考研全攻略.html': return 'exam', 'guide'
    return 'exam', 'timeline'

def shell(prefix, section):
    def link(key, text, url):
        current = ' aria-current="page"' if section == key else ''
        return f'<a href="{prefix}{url}"{current}>{text}</a>'
    links = '\n'.join(link(*entry) for entry in PRIMARY)
    more = '\n'.join(f'<a href="{prefix}{url}">{label}<small>{description}</small></a>' for label, description, url in MORE)
    return f'''<!-- SITE SHELL START -->
<a class="site-skip" href="#site-page-start">跳到正文</a>
<div class="site-shell">
  <nav class="site-navbar" aria-label="主导航">
    <span class="site-glass-optics" aria-hidden="true"></span>
    <a class="site-brand" href="{prefix}index.html" aria-label="Noven 心理学学习系统首页">
      <span><span class="site-brand-name">Noven</span><span class="site-brand-caption">心理学学习系统</span></span>
    </a>
    <div class="site-nav-links">{links}</div>
    <div class="site-nav-actions">
      <a class="site-calendar" href="{prefix}个人日历.html" aria-label="个人日历">{CALENDAR}<span>日历</span></a>
      <details class="site-menu">
        <summary class="site-menu-toggle" aria-label="更多导航" aria-expanded="false" aria-controls="site-menu-panel">{MENU}</summary>
        <div class="site-menu-panel" id="site-menu-panel">
          <div class="site-mobile-links"><span class="site-menu-label">学习空间</span>{links}<div class="site-menu-divider"></div></div>
          <span class="site-menu-label">发现与规划</span>{more}
        </div>
      </details>
    </div>
  </nav>
</div>
<div class="site-page-anchor" id="site-page-start" tabindex="-1"></div>
<!-- SITE SHELL END -->'''

for path in sorted(ROOT.rglob('*.html')):
    if '.git' in path.parts: continue
    relative = path.relative_to(ROOT)
    prefix = '../' * (len(relative.parts) - 1)
    raw = path.read_bytes()
    newline = '\r\n' if raw.count(b'\r\n') > raw.count(b'\n') / 2 else '\n'
    text = raw.decode().replace('\r\n', '\n')
    section, page = metadata(relative)
    if '<!-- SITE SHELL START -->' in text:
        text = re.sub(r'<!-- SITE SHELL START -->.*?<!-- SITE SHELL END -->', lambda _: shell(prefix, section), text, flags=re.S)
    else:
        if str(relative) in ['index.html', '资源合辑.html', 'undergraduate/index.html']:
            text = remove_block(text, r'<nav class="fixed\b[^>]*>')
        elif relative.parts[0] == 'undergraduate':
            text = remove_block(text, r'<nav class="psyhub-course-shell"[^>]*>')
        elif section == 'reading':
            text = remove_block(text, r'<header>')
        if page == 'outline':
            text = text.replace('<a href="index.html" class="fixed ', '<a href="index.html" class="site-legacy-back fixed ')
        text = re.sub(r'<body([^>]*)>', lambda m: m.group() + '\n' + shell(prefix, section), text, count=1)
    def body_tag(match):
        attrs = re.sub(r'\sdata-site-(?:section|page)="[^"]*"', '', match.group(1))
        if 'class="' in attrs:
            attrs = re.sub(r'class="([^"]*)"', lambda c: 'class="' + ' '.join(dict.fromkeys(c[1].split() + ['site-ui'])) + '"', attrs, count=1)
        else:
            attrs += ' class="site-ui"'
        return f'<body{attrs} data-site-section="{section}" data-site-page="{page}">'
    text = re.sub(r'<body([^>]*)>', body_tag, text, count=1)
    if 'assets/site-ui.css' not in text:
        text = text.replace('</head>', f'  <link rel="stylesheet" href="{prefix}assets/site-ui.css">\n  <script src="{prefix}assets/site-ui.js"></script>\n</head>', 1)
    if 'rel="preload"' not in text or 'fonts/noven-wordmark.ttf' not in text:
        text = text.replace('</head>', f'  <link rel="preload" href="{prefix}assets/fonts/noven-wordmark.ttf" as="font" type="font/ttf" crossorigin>\n</head>', 1)
    text = re.sub(r'^.*<link rel="preload"[^>]*fonts/noven-(?:display|title)\.ttf[^>]*>\s*\n', '', text, flags=re.M)
    if 'fonts/noven-ui.ttf' not in text:
        text = text.replace('</head>', f'  <link rel="preload" href="{prefix}assets/fonts/noven-ui.ttf" as="font" type="font/ttf" crossorigin>\n</head>', 1)
    if 'fonts/noven-editorial-title.ttf' not in text:
        text = text.replace('</head>', f'  <link rel="preload" href="{prefix}assets/fonts/noven-editorial-title.ttf" as="font" type="font/ttf" crossorigin>\n</head>', 1)
    text = text.replace('class="sticky-header ', 'class="site-context-bar sticky-header ')
    text = text.replace('class="ps40-header ', 'class="site-context-bar ps40-header ')
    text = text.replace('class="ps40-detail__header ', 'class="site-context-bar ps40-detail__header ')
    if page == 'calendar':
        text = text.replace('<nav class="w-full max-w-6xl ', '<nav class="site-context-bar w-full max-w-6xl ')
    text = text.replace('心理学考研学习系统', '心理学学习系统')
    path.write_text('\n'.join(line.rstrip() for line in text.splitlines()) + '\n')
print('Updated shared navigation and motion assets in 38 static pages.')

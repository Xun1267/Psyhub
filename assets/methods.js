/* Native anchors remain usable when JavaScript is unavailable. */
document.addEventListener('DOMContentLoaded', () => {
  const toc = document.querySelector('.reader-toc');
  const compact = matchMedia('(max-width: 900px)');
  const links = [...document.querySelectorAll('.toc-scroll a[href^="#"]')];
  const chapters = links.map(link => document.getElementById(link.hash.slice(1)));
  if (toc && compact.matches) toc.open = false;
  document.querySelector('.toc-return')?.addEventListener('click', () => { if (toc) toc.open = true; });
  compact.addEventListener('change', event => { if (toc) toc.open = !event.matches; });
  for (const link of links) {
    link.addEventListener('click', () => {
      if (toc && compact.matches) toc.open = false;
      const heading = document.getElementById(link.hash.slice(1));
      requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
    });
  }
  let pending = false;
  let current = '';
  function markCurrent() {
    pending = false;
    let selected = chapters[0];
    for (const heading of chapters) {
      if (heading && heading.getBoundingClientRect().top <= 165) selected = heading;
    }
    if (!selected || current === selected.id) return;
    current = selected.id;
    for (const link of links) {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(markCurrent); }
  }, { passive: true });
  addEventListener('resize', markCurrent);
  markCurrent();
  for (const pre of document.querySelectorAll('.lecture-code')) {
    const code = pre.querySelector('code');
    if (!code || !code.textContent.includes('\n')) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = '复制代码';
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = '已复制';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = '请按 Ctrl/Cmd+C 复制';
      }
      setTimeout(() => { button.textContent = '复制代码'; }, 2200);
    });
    pre.prepend(button);
  }
});

/* Progressive enhancement for static pages. Navigation remains native. */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const reducedTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
  const nativeTransitions = 'onpageswap' in window && 'onpagereveal' in window;
  let keyboardNavigation = false;
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      keyboardNavigation = true;
      document.documentElement.classList.add('site-keyboard');
    }
  }, true);
  document.addEventListener('pointerdown', () => {
    keyboardNavigation = false;
    document.documentElement.classList.remove('site-keyboard');
  }, true);
  window.addEventListener('pageswap', event => {
    if (keyboardNavigation || reducedMotion.matches) event.viewTransition?.skipTransition();
  });
  if (!nativeTransitions) document.documentElement.classList.add('site-motion-fallback');
  window.addEventListener('pagereveal', event => {
    document.documentElement.classList.toggle('site-motion-fallback', !event.viewTransition);
    if (reducedMotion.matches) event.viewTransition?.skipTransition();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const shell = document.querySelector('.site-shell');
    if (!shell) return;
    for (const element of document.body.children) {
      if (element.matches('main,section,header,.container,.timeline-container')) element.classList.add('site-stage');
    }
    const menu = shell.querySelector('.site-menu');
    const menuToggle = shell.querySelector('.site-menu-toggle');
    menu?.addEventListener('toggle', () => menuToggle.setAttribute('aria-expanded', String(menu.open)));
    document.addEventListener('click', event => {
      if (menu?.open && (!menu.contains(event.target) || event.target.closest('a'))) menu.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu?.open) {
        menu.open = false;
        menuToggle.focus();
      }
    });
    window.addEventListener('pageshow', () => { if (menu) menu.open = false; });
    const links = shell.querySelector('.site-nav-links');
    const active = links?.querySelector('[aria-current="page"]');
    if (links && active) {
      const indicator = document.createElement('span');
      indicator.className = 'site-nav-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      links.prepend(indicator);
      function moveTo(target, keyboard = false) {
        indicator.style.transition = keyboard || reducedMotion.matches ? 'none' : '';
        indicator.style.width = `${target.offsetWidth}px`;
        indicator.style.transform = `translateX(${target.offsetLeft}px)`;
        indicator.style.opacity = '1';
      }
      moveTo(active, true);
      links.classList.add('has-indicator');
      links.querySelectorAll('a').forEach(link => {
        link.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') moveTo(link); });
        link.addEventListener('focus', () => moveTo(link, true));
      });
      links.addEventListener('pointerleave', () => moveTo(active));
      links.addEventListener('focusout', event => { if (!links.contains(event.relatedTarget)) moveTo(active, true); });
      new ResizeObserver(() => moveTo(active, true)).observe(links);
    }

    // Generate one small, static edge-displacement map for the navigation only.
    // Other engines keep the CSS glass surface: SVG backdrop filters are not interoperable.
    const chromium = /Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/Firefox|FxiOS|CriOS/.test(navigator.userAgent);
    const optics = shell.querySelector('.site-glass-optics');
    const bar = shell.querySelector('.site-navbar');
    if (!chromium || !optics || !bar) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden';
    svg.innerHTML = '<defs><filter id="site-glass-refraction" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage result="lens" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="lens" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
    document.body.append(svg);
    const map = svg.querySelector('feImage');
    let sizeKey = '';
    function renderLens() {
      if (reducedTransparency.matches || reducedMotion.matches) {
        optics.style.backdropFilter = '';
        return;
      }
      const width = Math.round(bar.clientWidth), height = Math.round(bar.clientHeight);
      if (!width || !height) return;
      const key = `${width}:${height}`;
      if (key !== sizeKey) {
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) return;
        const pixels = context.createImageData(width, height);
        const radius = Math.min(28, height / 2);
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
          const px = x + .5 - width / 2, py = y + .5 - height / 2;
          const qx = Math.abs(px) - (width / 2 - radius), qy = Math.abs(py) - (height / 2 - radius);
          const ox = Math.max(qx, 0), oy = Math.max(qy, 0), length = Math.hypot(ox, oy);
          const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
          const weight = distance <= 0 ? Math.pow(Math.max(0, 1 + distance / 16), 2) : 0;
          const nx = length > 0 ? Math.sign(px) * ox / length : (qx > qy ? Math.sign(px) : 0);
          const ny = length > 0 ? Math.sign(py) * oy / length : (qy >= qx ? Math.sign(py) : 0);
          const index = (y * width + x) * 4;
          pixels.data[index] = 128 + nx * weight * 100;
          pixels.data[index + 1] = 128 + ny * weight * 100;
          pixels.data[index + 2] = 128;
          pixels.data[index + 3] = 255;
        }
        context.putImageData(pixels, 0, 0);
        map.setAttribute('href', canvas.toDataURL());
        map.setAttribute('width', String(width)); map.setAttribute('height', String(height));
        sizeKey = key;
      }
      optics.style.backdropFilter = 'blur(12px) url(#site-glass-refraction) saturate(155%)';
    }
    let resizeTimer;
    new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderLens, 100); }).observe(bar);
    reducedTransparency.addEventListener('change', renderLens);
    reducedMotion.addEventListener('change', renderLens);
    renderLens();
  });
})();

(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // Contact details live once, in the HTML; the script reads them from there.
  const mailLink = $('.contact__addr');
  const EMAIL = mailLink ? mailLink.textContent.trim() : '';
  const MAILTO = mailLink ? mailLink.getAttribute('href') : '';

  /* ── Keyboard hint matches the platform ─────────────── */
  if (isMac) $$('[data-mod]').forEach((k) => { k.textContent = '⌘'; });

  /* ── Nav: hairline once scrolled ────────────────────── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Scroll-spy for the nav links ───────────────────── */
  const links = $$('.nav__link');
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const spyTargets = ['work', 'experience', 'projects', 'contact'].map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window && spyTargets.length) {
    const visible = new Set();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      const current = spyTargets.find((t) => visible.has(t.id));
      links.forEach((a) => a.removeAttribute('aria-current'));
      if (current && byId.has(current.id)) byId.get(current.id).setAttribute('aria-current', 'true');
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach((t) => spy.observe(t));
  }

  /* ── Reveal the work rows once ──────────────────────── */
  const reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ── Hero: type the command once, then static ───────── */
  const manifest = $('.manifest');
  const typed = $('.js-type');
  if (manifest && typed && !reduceMotion) {
    const full = typed.dataset.text || typed.textContent;
    typed.textContent = '';
    manifest.classList.add('is-typing');
    let i = 0;
    const tick = () => {
      i += 1;
      typed.textContent = full.slice(0, i);
      if (i < full.length) {
        setTimeout(tick, 32 + Math.random() * 30);
      } else {
        setTimeout(() => manifest.classList.remove('is-typing'), 260);
      }
    };
    setTimeout(tick, 650);
  }

  /* ── Copy email ─────────────────────────────────────── */
  const status = $('#copy-status');
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };
  $$('.js-copy').forEach((btn) => {
    const label = $('.js-copy-label', btn);
    const icon = $('.js-copy-icon use', btn);
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(btn.dataset.copy || EMAIL);
      clearTimeout(timer);
      if (ok) {
        btn.classList.add('is-done');
        label.textContent = 'Copied';
        icon.setAttribute('href', '#i-check');
        if (status) status.textContent = 'Email address copied to clipboard';
      } else {
        label.textContent = 'Press Ctrl+C';
        if (status) status.textContent = 'Copy failed. Select the address and copy it manually.';
      }
      timer = setTimeout(() => {
        btn.classList.remove('is-done');
        label.textContent = 'Copy';
        icon.setAttribute('href', '#i-copy');
        if (status) status.textContent = '';
      }, 2200);
    });
  });

  /* ── "Show more" disclosures keep honest labels ─────── */
  $$('.role__more').forEach((d) => {
    const span = $('summary span', d);
    const closed = span.textContent;
    d.addEventListener('toggle', () => { span.textContent = d.open ? 'Show fewer highlights' : closed; });
  });

  /* ── Command palette ────────────────────────────────── */
  const cmdk = $('#cmdk');
  if (!cmdk) return;
  const panel = $('.cmdk__panel', cmdk);
  const input = $('#cmdk-input');
  const list = $('#cmdk-list');
  const empty = $('.cmdk__empty', cmdk);
  if (!input || !list) return;

  const go = (id) => () => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    const h = el.querySelector('h1, h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  };
  const open = (url) => () => { window.open(url, '_blank', 'noopener'); };
  const download = () => {
    const a = document.createElement('a');
    a.href = 'assets/Satyanarayana-Reddy-Resume.pdf';
    a.download = 'Satyanarayana-Reddy-Resume.pdf';
    document.body.appendChild(a); a.click(); a.remove();
  };

  const commands = [
    { group: 'Go to', label: 'Selected work', hint: '#work', icon: 'i-hash', keys: 'work programs genai platform java terraform sre', run: go('work') },
    { group: 'Go to', label: 'Delivery path', hint: '#pipeline', icon: 'i-hash', keys: 'pipeline devsecops ci cd tools stages', run: go('pipeline') },
    { group: 'Go to', label: 'Experience', hint: '#experience', icon: 'i-hash', keys: 'experience jobs career msd merck cognizant tcs amazon', run: go('experience') },
    { group: 'Go to', label: 'Personal projects', hint: '#projects', icon: 'i-hash', keys: 'projects side apps open source', run: go('projects') },
    { group: 'Go to', label: 'Toolbox & certifications', hint: '#skills', icon: 'i-hash', keys: 'skills tools certifications aws gcp azure education', run: go('skills') },
    { group: 'Go to', label: 'Contact', hint: '#contact', icon: 'i-hash', keys: 'contact email phone hire', run: go('contact') },
    { group: 'Actions', label: 'Download résumé (PDF)', hint: 'PDF', icon: 'i-download', keys: 'resume cv download pdf', run: download },
    { group: 'Actions', label: 'Open résumé as a web page', hint: 'resume.html', icon: 'i-file', keys: 'resume cv web print', run: () => { window.location.href = 'resume.html'; } },
    { group: 'Actions', label: 'Copy email address', hint: EMAIL, icon: 'i-copy', keys: 'email mail copy contact', run: async () => {
      const ok = await copyText(EMAIL);
      if (status) status.textContent = ok ? 'Email address copied to clipboard' : 'Copy failed';
    } },
    { group: 'Actions', label: 'Write an email', hint: 'mailto', icon: 'i-arrow-up-right', keys: 'email mail write contact', run: () => { if (MAILTO) window.location.href = MAILTO; } },
    { group: 'Profiles', label: 'LinkedIn', icon: 'i-arrow-up-right', keys: 'linkedin profile', run: open('https://www.linkedin.com/in/medapati-n-v-d-satyanarayana-reddy-498758271/') },
    { group: 'Profiles', label: 'GitHub', icon: 'i-arrow-up-right', keys: 'github code repos', run: open('https://github.com/reddy5310') },
    { group: 'Profiles', label: 'Medium', icon: 'i-arrow-up-right', keys: 'medium blog writing articles', run: open('https://medium.com/@venkatsatyanreddy_92646') },
    { group: 'Profiles', label: 'X (Twitter)', icon: 'i-arrow-up-right', keys: 'x twitter', run: open('https://x.com/mnvdsreddy93') },
    { group: 'Projects', label: 'JevBrowse', hint: 'source', icon: 'i-arrow-up-right', keys: 'jevbrowse browser windows c#', run: open('https://github.com/reddy5310/jevbrowse') },
    { group: 'Projects', label: 'VyayaMitra', hint: 'app', icon: 'i-arrow-up-right', keys: 'vyayamitra finance money pwa', run: open('https://reddy5310.github.io/VyayaMitra/') },
    { group: 'Projects', label: 'Antventure: Leaf of Fate', hint: 'play', icon: 'i-arrow-up-right', keys: 'antventure game ant play', run: open('https://reddy5310.github.io/antventure-final-pwa/') },
    { group: 'Projects', label: 'Chit Lab', hint: 'app', icon: 'i-arrow-up-right', keys: 'chit fund calculator', run: open('https://reddy5310.github.io/chit-lab/') },
    { group: 'Projects', label: 'MyHealth 90', hint: 'app', icon: 'i-arrow-up-right', keys: 'myhealth health tracker flutter', run: open('https://reddy5310.github.io/myhealth90-web/') },
  ];

  let results = commands;
  let active = 0;
  let lastFocus = null;

  const paint = () => {
    $$('.cmdk__item', list).forEach((b, i) => b.setAttribute('aria-selected', String(i === active)));
    const cur = document.getElementById(`cmdk-opt-${active}`);
    if (cur) {
      input.setAttribute('aria-activedescendant', cur.id);
      cur.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    results = q
      ? commands.filter((c) => q.split(/\s+/).every((w) => `${c.label} ${c.keys} ${c.group}`.toLowerCase().includes(w)))
      : commands;
    active = Math.min(active, Math.max(results.length - 1, 0));
    list.textContent = '';
    let group = '';
    results.forEach((c, i) => {
      if (c.group !== group) {
        group = c.group;
        const g = document.createElement('p');
        g.className = 'cmdk__group';
        g.setAttribute('role', 'presentation');
        g.textContent = group;
        list.appendChild(g);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cmdk__item';
      b.id = `cmdk-opt-${i}`;
      b.setAttribute('role', 'option');
      b.setAttribute('tabindex', '-1');
      b.setAttribute('aria-selected', String(i === active));
      b.innerHTML = `<svg class="i" aria-hidden="true"><use href="#${c.icon}"/></svg><span></span>${c.hint ? '<span class="cmdk__hint"></span>' : ''}`;
      b.children[1].textContent = c.label;
      if (c.hint) b.children[2].textContent = c.hint;
      b.addEventListener('click', () => run(i));
      b.addEventListener('mousemove', () => { if (active !== i) { active = i; paint(); } });
      list.appendChild(b);
    });
    empty.hidden = results.length > 0;
    paint();
  };

  const openPalette = () => {
    if (!cmdk.hidden) return;
    lastFocus = document.activeElement;
    input.value = '';
    active = 0;
    render();
    cmdk.hidden = false;
    document.documentElement.classList.add('is-locked');
    requestAnimationFrame(() => {
      cmdk.classList.add('is-open');
      input.focus();
    });
  };

  const closePalette = (restore = true) => {
    if (cmdk.hidden) return;
    cmdk.classList.remove('is-open');
    document.documentElement.classList.remove('is-locked');
    const finish = () => { cmdk.hidden = true; };
    if (reduceMotion) finish(); else setTimeout(finish, 170);
    if (restore && lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  };

  const run = (i) => {
    const c = results[i];
    if (!c) return;
    closePalette(false);
    setTimeout(() => c.run(), 10);
  };

  $$('[data-cmdk-open]').forEach((b) => b.addEventListener('click', openPalette));
  $$('[data-cmdk-close]', cmdk).forEach((b) => b.addEventListener('click', () => closePalette()));
  input.addEventListener('input', () => { active = 0; render(); });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdk.hidden) openPalette(); else closePalette();
      return;
    }
    if (cmdk.hidden) return;
    switch (e.key) {
      case 'Escape': e.preventDefault(); closePalette(); break;
      case 'ArrowDown': e.preventDefault(); if (results.length) { active = (active + 1) % results.length; paint(); } break;
      case 'ArrowUp': e.preventDefault(); if (results.length) { active = (active - 1 + results.length) % results.length; paint(); } break;
      case 'Enter': e.preventDefault(); run(active); break;
      case 'Tab': e.preventDefault(); input.focus(); break; // focus stays in the dialog
      default: break;
    }
  });

  // Clicking a result must not pull focus out of the dialog before it runs
  panel.addEventListener('mousedown', (e) => { if (e.target.closest('.cmdk__item')) e.preventDefault(); });
})();

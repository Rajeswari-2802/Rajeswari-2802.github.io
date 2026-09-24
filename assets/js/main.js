(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- cosmic starfield ---------- */
  const canvas = document.getElementById('cosmos');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, stars = [], shooters = [], scrollY = 0, mx = 0, my = 0;
    const layers = [
      { n: 220, size: [0.3, 0.9], speed: 0.02, par: 0.05 },
      { n: 110, size: [0.7, 1.4], speed: 0.05, par: 0.12 },
      { n: 40,  size: [1.2, 2.2], speed: 0.09, par: 0.22 }
    ];
    const rand = (a, b) => a + Math.random() * (b - a);
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      stars = [];
      const area = (innerWidth * innerHeight) / (1440 * 900);
      layers.forEach((L, li) => {
        for (let i = 0; i < Math.round(L.n * Math.max(area, .35)); i++) {
          const green = Math.random() < 0.28;
          stars.push({
            x: Math.random() * w, y: Math.random() * h,
            r: rand(L.size[0], L.size[1]) * dpr, L: li,
            tw: Math.random() * Math.PI * 2, tws: rand(0.005, 0.03),
            c: green ? [140, 255, 180] : (Math.random() < 0.1 ? [230, 210, 150] : [235, 245, 240])
          });
        }
      });
    }
    function shoot() {
      if (reduce) return;
      shooters.push({ x: rand(w * .2, w), y: rand(0, h * .4), vx: -rand(8, 14) * dpr, vy: rand(3, 6) * dpr, life: 1 });
      setTimeout(shoot, rand(3500, 8000));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const L = layers[s.L];
        s.tw += s.tws;
        const a = 0.45 + Math.sin(s.tw) * 0.4;
        let y = (s.y - scrollY * L.par * dpr) % h; if (y < 0) y += h;
        const x = s.x + mx * L.par * 40 * dpr;
        if (!reduce) s.y += L.speed * dpr * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${Math.max(a, .05)})`;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.6 * dpr) {
          ctx.fillStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${a * .12})`;
          ctx.beginPath(); ctx.arc(x, y, s.r * 4, 0, Math.PI * 2); ctx.fill();
        }
      }
      shooters = shooters.filter(sh => sh.life > 0);
      for (const sh of shooters) {
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 10, sh.y - sh.vy * 10);
        g.addColorStop(0, `rgba(170,255,200,${sh.life})`);
        g.addColorStop(1, 'rgba(62,224,122,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6 * dpr;
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 10, sh.y - sh.vy * 10); ctx.stroke();
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.018;
      }
      requestAnimationFrame(frame);
    }
    resize();
    addEventListener('resize', resize);
    addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    frame();
    setTimeout(shoot, 2000);
  }

  /* ---------- cursor glow ---------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', e => {
      glow.style.opacity = 1;
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ---------- nav ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* active nav link */
  const sections = [...document.querySelectorAll('section[id]')];
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (sections.length && links.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const rev = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => rev.observe(el));

  /* ---------- typed roles ---------- */
  const typed = document.getElementById('typed');
  if (typed) {
    const roles = ['Embedded Systems Engineer', 'VLSI Enthusiast', 'IoT & Sensor Interfacing', 'Hardware + Firmware Builder'];
    let r = 0, i = 0, del = false;
    const tick = () => {
      const word = roles[r];
      typed.textContent = word.slice(0, i);
      if (!del && i < word.length) i++;
      else if (del && i > 0) i--;
      else if (!del) { del = true; return setTimeout(tick, 1600); }
      else { del = false; r = (r + 1) % roles.length; }
      setTimeout(tick, del ? 35 : 75);
    };
    reduce ? (typed.textContent = roles[0]) : tick();
  }

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
      const suffix = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1600;
      const step = t => {
        const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (end * e).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      reduce ? (el.textContent = end.toFixed(dec) + suffix) : requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---------- card tilt + spotlight ---------- */
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.card, .skill, .stat').forEach(card => {
      card.addEventListener('mousemove', e => {
        const b = card.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        card.style.setProperty('--mx', x * 100 + '%');
        card.style.setProperty('--my', y * 100 + '%');
        card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* year */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

  // Theme toggle
  const swapLeadscraper = (isLight) => {
    document.querySelectorAll('.ls-img').forEach(img => {
      img.src = isLight ? 'assets/leadscraper-light.webp' : 'assets/leadscraper.webp';
    });
  };

  (function(){
    const toggle = document.getElementById('theme-toggle');
    if(!toggle) return;
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if(isLight){
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'dark');
        swapLeadscraper(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('portfolio-theme', 'light');
        swapLeadscraper(true);
      }
      if(window._matrixResize) window._matrixResize();
    });
    // Apply correct image for initial theme
    if(document.documentElement.getAttribute('data-theme') === 'light') swapLeadscraper(true);
  })();

  const matrixCanvas = document.getElementById('matrix-rain');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startMatrixRain = () => {
  if(matrixCanvas && !prefersReducedMotion){
    const ctx = matrixCanvas.getContext('2d');
    const glyphs = '01{}[]<>/=';
    const getMatrixPalette = () =>
      document.documentElement.getAttribute('data-theme') === 'light'
        ? ['138,40,192','138,40,192','42,128,64']
        : ['98,243,109','98,243,109','210,130,255'];
    const fontSize = 14;
    const glyphShiftMinMs = 120;
    const glyphShiftRangeMs = 120;
    const glyphShiftMaxSwaps = 22;
    let columns = [];
    let animationId;
    const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
    const buildTrailGlyphs = (length) => Array.from({length}, randomGlyph);
    const nextGlyphShiftDelay = () => glyphShiftMinMs + Math.random() * glyphShiftRangeMs;

    const resizeMatrix = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      matrixCanvas.width = Math.floor(window.innerWidth * dpr);
      matrixCanvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.ceil(window.innerWidth / fontSize);
      const pal = getMatrixPalette();
      columns = Array.from({length: count}, (_, i) => {
        const trail = 8 + Math.floor(Math.random() * 15);
        return {
          x: i * fontSize,
          y: Math.random() * window.innerHeight,
          speed: .045 + Math.random() * .09,
          trail,
          color: pal[i % pal.length],
          chars: buildTrailGlyphs(trail),
          glyphShiftDelay: nextGlyphShiftDelay(),
          lastGlyphShift: 0
        };
      });
    };

    const drawMatrix = (now = performance.now()) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px JetBrains Mono, ui-monospace, monospace`;
      columns.forEach((column) => {
        ctx.shadowColor = `rgba(${column.color}, .46)`;
        ctx.shadowBlur = 6;
        if(now - column.lastGlyphShift > column.glyphShiftDelay){
          const swaps = 1 + Math.floor(Math.random() * glyphShiftMaxSwaps);
          for(let swap = 0; swap < swaps; swap++){
            column.chars[Math.floor(Math.random() * column.trail)] = randomGlyph();
          }
          column.lastGlyphShift = now;
          column.glyphShiftDelay = nextGlyphShiftDelay();
        }
        for(let i = 0; i < column.trail; i++){
          const alpha = i === 0 ? .62 : Math.max(.05, .38 - i * (.38 / column.trail));
          const glyph = column.chars[i] || randomGlyph();
          ctx.fillStyle = `rgba(${column.color}, ${alpha})`;
          ctx.fillText(glyph, column.x, column.y - i * fontSize);
        }
        column.y += column.speed;
        if(column.y - column.trail * fontSize > window.innerHeight && Math.random() > .96){
          column.y = -fontSize;
          column.speed = .045 + Math.random() * .09;
          column.trail = 8 + Math.floor(Math.random() * 15);
          const cp = getMatrixPalette();
          column.color = cp[Math.floor(Math.random() * cp.length)];
          column.chars = buildTrailGlyphs(column.trail);
          column.glyphShiftDelay = nextGlyphShiftDelay();
          column.lastGlyphShift = now;
        }
      });
      animationId = requestAnimationFrame(drawMatrix);
    };

    resizeMatrix();
    drawMatrix();
    window.addEventListener('resize', resizeMatrix);
    window._matrixResize = resizeMatrix;
    document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        cancelAnimationFrame(animationId);
      }else{
        drawMatrix();
      }
    });
  }
  };
  if('requestIdleCallback' in window){
    requestIdleCallback(startMatrixRain, { timeout: 1800 });
  }else{
    window.addEventListener('load', startMatrixRain, { once: true });
  }

  const cheyenneOffset = document.getElementById('cheyenne-offset');
  if(cheyenneOffset){
    const timeZone = cheyenneOffset.dataset.timeZone || 'America/Denver';

    const formatUtcOffset = (date) => {
      try{
        const offsetPart = new Intl.DateTimeFormat('en-US', {
          timeZone,
          timeZoneName: 'shortOffset',
          hour: 'numeric'
        }).formatToParts(date).find((part) => part.type === 'timeZoneName');

        if(offsetPart?.value){
          return offsetPart.value.replace('GMT', 'UTC');
        }
      }catch(error){
        // Fall through to manual offset calculation when shortOffset is unsupported.
      }

      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
      }).formatToParts(date).reduce((acc, part) => {
        if(part.type !== 'literal') acc[part.type] = Number(part.value);
        return acc;
      }, {});

      const zoneTimeAsUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second
      );
      const offsetMinutes = Math.round((zoneTimeAsUtc - date.getTime()) / 60000);
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absoluteMinutes = Math.abs(offsetMinutes);
      const hours = Math.floor(absoluteMinutes / 60);
      const minutes = absoluteMinutes % 60;

      return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
    };

    const updateCheyenneOffset = () => {
      const now = new Date();
      cheyenneOffset.textContent = formatUtcOffset(now);
      cheyenneOffset.title = `Cheyenne, WY (${timeZone}) currently ${cheyenneOffset.textContent}`;
    };

    updateCheyenneOffset();
    setInterval(updateCheyenneOffset, 15 * 60 * 1000);
  }

  const githubStatsRoot = document.querySelector('[data-github-user]');
  if(githubStatsRoot){
    const username = githubStatsRoot.dataset.githubUser;
    const apiBase = 'https://api.github.com';
    const cacheKey = `portfolio-github-stats:${username}`;
    const cacheMs = 10 * 60 * 1000;
    const refreshMs = 30 * 60 * 1000;

    const githubHeaders = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    const readCache = () => {
      try{
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        if(cached && Date.now() - cached.timestamp < cacheMs) return cached.stats;
      }catch(error){}
      return null;
    };

    const writeCache = (stats) => {
      try{
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), stats }));
      }catch(error){}
    };

    const fetchGithubJson = async (url) => {
      const response = await fetch(url, { headers: githubHeaders });
      if(!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
      return response.json();
    };

    const fetchPublicRepos = async () => {
      const repos = [];
      let page = 1;

      while(page < 10){
        const url = `${apiBase}/users/${username}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
        const pageRepos = await fetchGithubJson(url);
        if(!Array.isArray(pageRepos)) break;
        repos.push(...pageRepos);
        if(pageRepos.length < 100) break;
        page += 1;
      }

      return repos;
    };

    const fetchCommitCountThisYear = async () => {
      const year = new Date().getFullYear();
      const params = new URLSearchParams({
        q: `author:${username} author-date:${year}-01-01..${year}-12-31`
      });
      const commits = await fetchGithubJson(`${apiBase}/search/commits?${params}`);
      return commits.total_count || 0;
    };

    const fetchGithubStats = async () => {
      const [profileResult, reposResult, commitsResult] = await Promise.allSettled([
        fetchGithubJson(`${apiBase}/users/${username}`),
        fetchPublicRepos(),
        fetchCommitCountThisYear()
      ]);

      const profile = profileResult.status === 'fulfilled' ? profileResult.value : {};
      const repos = reposResult.status === 'fulfilled' ? reposResult.value : [];
      const commitsThisYear = commitsResult.status === 'fulfilled' ? commitsResult.value : undefined;
      const shippedProjects = repos.filter((repo) =>
        !repo.fork &&
        !repo.archived &&
        typeof repo.homepage === 'string' &&
        /^https?:\/\//.test(repo.homepage.trim())
      ).length;

      return {
        publicRepos: Number.isFinite(profile.public_repos) ? profile.public_repos : repos.length,
        shippedProjects: repos.length ? shippedProjects : undefined,
        commitsThisYear,
        syncedAt: new Date().toISOString()
      };
    };

    const formatStat = (value) => new Intl.NumberFormat('en-US').format(value);

    const applyGithubStats = (stats) => {
      Object.entries(stats).forEach(([key, value]) => {
        const target = githubStatsRoot.querySelector(`[data-github-stat="${key}"]`);
        if(target && Number.isFinite(value)){
          target.textContent = formatStat(value);
        }
      });

      if(stats.syncedAt){
        githubStatsRoot.title = `GitHub stats synced ${new Date(stats.syncedAt).toLocaleString()}`;
      }
    };

    const refreshGithubStats = async ({ useCache = true } = {}) => {
      const cachedStats = useCache ? readCache() : null;
      if(cachedStats){
        applyGithubStats(cachedStats);
        return;
      }

      try{
        const stats = await fetchGithubStats();
        writeCache(stats);
        applyGithubStats(stats);
      }catch(error){
        const staleStats = readCache();
        if(staleStats) applyGithubStats(staleStats);
      }
    };

    refreshGithubStats();
    setInterval(() => refreshGithubStats({ useCache: false }), refreshMs);
  }

  // Build heatmap (52 weeks x 7 days)
  const hm = document.getElementById('heatmap');
  if(hm){
    const seed = 282;
    const total = 52*7;
    let arr=[];
    // weighted random
    for(let i=0;i<total;i++){
      const r=Math.random();
      let cls='';
      // give later weeks more activity (recent ramp up)
      const weekBoost = (i/total)*.5;
      if(r < .35 - weekBoost) cls='';
      else if(r < .55) cls='h1';
      else if(r < .75) cls='h2';
      else if(r < .9) cls='h3';
      else cls='h4';
      arr.push(cls);
    }
    hm.innerHTML = arr.map(c=>`<div class="${c}"></div>`).join('');
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id.length>1){
        const el=document.querySelector(id);
        if(el){e.preventDefault();window.scrollTo({top:el.offsetTop-72,behavior:'smooth'})}
      }
    });
  });

  // Key at https://web3forms.com
  const WEB3FORMS_ACCESS_KEY = '1915556d-5569-4112-ab63-585fe764507d';

  const contactModal = document.getElementById('contact-modal');
  const contactForm = document.getElementById('contact-form');
  const contactFormStatus = document.getElementById('contact-form-status');
  const contactFormSubmit = document.getElementById('contact-form-submit');
  const contactModalTriggers = document.querySelectorAll('.contact-modal-trigger');
  const contactCloseTargets = contactModal?.querySelectorAll('[data-contact-close]') || [];
  const contactRevealDelayMs = 500;
  let contactRevealTimer;

  const resetContactModal = () => {
    if(!contactModal) return;
    contactModal.classList.remove('is-open', 'is-revealing', 'is-success');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if(contactRevealTimer){
      clearTimeout(contactRevealTimer);
      contactRevealTimer = undefined;
    }
    if(contactForm){
      contactForm.reset();
      contactForm.hidden = false;
    }
    if(contactFormStatus){
      contactFormStatus.textContent = '';
      contactFormStatus.className = 'contact-form__status';
    }
    if(contactFormSubmit){
      contactFormSubmit.type = 'submit';
      contactFormSubmit.disabled = false;
      contactFormSubmit.onclick = null;
      contactFormSubmit.innerHTML = 'Send message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
    }
  };

  const openContactModal = () => {
    if(!contactModal) return;
    resetContactModal();
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reducedMotion){
      contactModal.classList.add('is-revealing');
      return;
    }
    contactRevealTimer = window.setTimeout(() => {
      contactModal.classList.add('is-revealing');
      const nameInput = contactForm?.querySelector('input[name="name"]');
      if(nameInput) window.setTimeout(() => nameInput.focus(), 520);
    }, contactRevealDelayMs);
  };

  const closeContactModal = () => {
    if(!contactModal) return;
    contactModal.classList.remove('is-open', 'is-revealing', 'is-success');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if(contactRevealTimer){
      clearTimeout(contactRevealTimer);
      contactRevealTimer = undefined;
    }
    window.setTimeout(() => {
      if(contactForm) contactForm.reset();
      if(contactFormStatus){
        contactFormStatus.textContent = '';
        contactFormStatus.className = 'contact-form__status';
      }
      if(contactFormSubmit){
        contactFormSubmit.type = 'submit';
        contactFormSubmit.disabled = false;
        contactFormSubmit.onclick = null;
        contactFormSubmit.innerHTML = 'Send message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      }
    }, 350);
  };

  contactModalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openContactModal();
    });
  });

  contactCloseTargets.forEach((target) => {
    target.addEventListener('click', closeContactModal);
  });

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape' && contactModal?.classList.contains('is-open')){
      closeContactModal();
    }
  });

  if(contactForm){
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if(!contactForm.reportValidity()) return;

      if(!WEB3FORMS_ACCESS_KEY){
        contactFormStatus.textContent = 'Contact form is not configured yet. Add your Web3Forms access key in index.html.';
        contactFormStatus.className = 'contact-form__status is-error';
        return;
      }

      const formData = new FormData(contactForm);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', `Portfolio message from ${formData.get('name')}`);
      formData.append('from_name', 'Mark Waldron Portfolio');
      formData.append('replyto', formData.get('email'));

      contactFormSubmit.disabled = true;
      contactFormSubmit.textContent = 'Sending...';
      contactFormStatus.textContent = '';
      contactFormStatus.className = 'contact-form__status';

      try{
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        let result = {};
        try{
          result = await response.json();
        }catch(parseError){
          throw new Error('Unexpected response from contact service.');
        }

        if(!response.ok || !result.success){
          throw new Error(result.message || 'Request failed');
        }

        contactModal.classList.add('is-success');
        contactForm.hidden = true;
        contactFormStatus.textContent = 'Message sent — thanks for reaching out!';
        contactFormStatus.className = 'contact-form__status is-success';
        contactFormSubmit.type = 'button';
        contactFormSubmit.disabled = false;
        contactFormSubmit.textContent = 'Close';
        contactFormSubmit.onclick = closeContactModal;
      }catch(error){
        const detail = error instanceof Error ? error.message : 'Request failed';
        contactFormStatus.textContent = `${detail} If this keeps happening, email contact@mark-waldron.com directly.`;
        contactFormStatus.className = 'contact-form__status is-error';
        contactFormSubmit.disabled = false;
        contactFormSubmit.innerHTML = 'Send message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      }
    });
  }

(function(){
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var atmosphere = document.getElementById('atmosphere-scroll');
  var seaFx = document.getElementById('atmosphere-sea-fx');
  var bubbleRoot = document.getElementById('atmosphere-bubbles');
  var particleRoot = document.getElementById('atmosphere-particles');
  var parallaxRate = 0.14;

  function getContentEnd(){
    var footer = document.querySelector('footer');
    if(footer) return footer.offsetTop + footer.offsetHeight;
    return Math.max(document.body.scrollHeight, window.innerHeight);
  }

  function syncAtmosphereHeight(){
    if(!atmosphere) return;
    var contentEnd = getContentEnd();
    atmosphere.style.height = contentEnd + 'px';
    if(seaFx) seaFx.style.height = contentEnd + 'px';
    syncBubbleZone();
  }

  function syncBubbleZone(){
    if(!bubbleRoot || !isLight()) return;
    var docH = getContentEnd();
    if(docH <= 0) return;
    var work = document.getElementById('work');
    var zoneTop = work ? work.offsetTop : Math.round(docH * 0.58);
    zoneTop = Math.max(0, Math.min(zoneTop, docH - 120));
    var zoneH = docH - zoneTop;
    bubbleRoot.style.top = zoneTop + 'px';
    bubbleRoot.style.bottom = '0';
    bubbleRoot.style.height = zoneH + 'px';
    if(particleRoot){
      particleRoot.style.top = zoneTop + 'px';
      particleRoot.style.bottom = '0';
      particleRoot.style.height = zoneH + 'px';
    }
  }

  function syncParallax(){
    if(!atmosphere) return;
    if(!isLight() || reduce){
      atmosphere.style.transform = '';
      return;
    }
    atmosphere.style.transform = 'translate3d(0,' + (window.scrollY * -parallaxRate) + 'px,0)';
  }

  function syncContentZones(){
    if(!isLight()){
      document.body.classList.remove('light-zone-sea');
      return;
    }
    var docH = Math.max(document.documentElement.scrollHeight, 1);
    var probe = window.scrollY + window.innerHeight * 0.62;
    document.body.classList.toggle('light-zone-sea', probe / docH > 0.62);
  }

  function syncAtmosphereView(){
    syncParallax();
    syncContentZones();
  }

  function isLight(){ return root.getAttribute('data-theme') === 'light'; }

  function spawnBubble(opts){
    if(!bubbleRoot || !isLight()) return null;
    var b = document.createElement('div');
    b.className = 'atm-bubble' + (opts.cluster ? ' is-cluster' : '');
    var size = opts.size || (5 + Math.random() * 12);
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = (opts.left != null ? opts.left : (5 + Math.random() * 90)) + '%';
    var drift = (opts.drift != null ? opts.drift : (Math.random() * 16 - 8)) + 'px';
    b.style.setProperty('--drift', drift);
    var seaH = bubbleRoot.offsetHeight || Math.max(window.innerHeight * 0.22, 180);
    var risePx = opts.rise != null ? opts.rise : seaH * (0.62 + Math.random() * 0.38);
    b.style.setProperty('--rise', risePx + 'px');
    var dur = opts.duration || (42 + Math.random() * 38);
    var delay = opts.delay != null ? opts.delay : (-Math.random() * dur);
    var loops = opts.once ? 1 : 'infinite';
    b.style.animation = 'bubbleRise ' + dur + 's linear ' + delay + 's ' + loops;
    if(opts.once){
      b.addEventListener('animationend', function(){ b.remove(); }, { once: true });
    }
    bubbleRoot.appendChild(b);
    return b;
  }

  function spawnParticle(opts){
    if(!particleRoot || !isLight()) return null;
    var p = document.createElement('div');
    p.className = 'atm-particle';
    var size = opts.size || (1 + Math.random() * 2.2);
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = (opts.left != null ? opts.left : (4 + Math.random() * 92)) + '%';
    p.style.setProperty('--drift', (opts.drift != null ? opts.drift : (Math.random() * 10 - 5)) + 'px');
    var seaH = particleRoot.offsetHeight || Math.max(window.innerHeight * 0.22, 180);
    p.style.setProperty('--rise', (opts.rise != null ? opts.rise : seaH * (0.65 + Math.random() * 0.42)) + 'px');
    var dur = opts.duration || (55 + Math.random() * 45);
    var delay = opts.delay != null ? opts.delay : (-Math.random() * dur);
    p.style.animation = 'particleDrift ' + dur + 's linear ' + delay + 's infinite';
    particleRoot.appendChild(p);
    return p;
  }

  function initBubbles(){
    if(!bubbleRoot) return;
    bubbleRoot.innerHTML = '';
    if(!isLight()) return;
    for(var i = 0; i < 24; i++){
      spawnBubble({ size: 5 + Math.random() * 11, duration: 38 + Math.random() * 34 });
    }
  }

  function initParticles(){
    if(!particleRoot) return;
    particleRoot.innerHTML = '';
    if(!isLight()) return;
    for(var i = 0; i < 48; i++){
      spawnParticle({ size: 1.4 + Math.random() * 2.8 });
    }
  }

  function spawnCluster(){
    if(!isLight()) return;
    var center = 12 + Math.random() * 76;
    var count = 10 + Math.floor(Math.random() * 8);
    for(var i = 0; i < count; i++){
      spawnBubble({
        cluster: true,
        once: true,
        left: center + (Math.random() * 6 - 3),
        size: 4 + Math.random() * 10,
        drift: (Math.random() * 10 - 5),
        duration: 48 + Math.random() * 28,
        delay: Math.random() * 3
      });
    }
  }

  function bootAtmosphere(){
    syncAtmosphereHeight();
    initBubbles();
    initParticles();
    syncAtmosphereView();
  }

  bootAtmosphere();
  window.addEventListener('resize', function(){
    syncAtmosphereHeight();
    initBubbles();
    initParticles();
    syncAtmosphereView();
  });
  window.addEventListener('scroll', syncAtmosphereView, { passive: true });
  window.addEventListener('load', function(){
    bootAtmosphere();
    window.setTimeout(syncAtmosphereHeight, 120);
  });
  if(typeof ResizeObserver !== 'undefined'){
    var footerEl = document.querySelector('footer');
    if(footerEl){
      new ResizeObserver(function(){
        syncAtmosphereHeight();
      }).observe(footerEl);
    }
  }

  if(!reduce){
    setInterval(function(){
      if(isLight() && Math.random() > 0.3) spawnCluster();
    }, 10000 + Math.random() * 7000);
  }

  var toggle = document.getElementById('theme-toggle');
  if(toggle){
    toggle.addEventListener('click', function(){
      window.setTimeout(function(){
        bootAtmosphere();
        syncAtmosphereView();
      }, 60);
    });
  }
})();

import { isLight, motionPaused } from './state.js';

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
  // Reveal after height is set so percentage-positioned clouds appear at the right
  // spot rather than starting at y=0 (collapsed parent) and causing a layout shift.
  if(isLight()) atmosphere.style.display = 'block';
  if(seaFx){
    seaFx.style.height = contentEnd + 'px';
    if(isLight()) seaFx.style.display = 'block';
  }
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
  if(!isLight()){
    atmosphere.style.transform = '';
    return;
  }
  atmosphere.style.transform = 'translate3d(0,' + (window.scrollY * -parallaxRate) + 'px,0)';
}

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
  syncParallax();
}

bootAtmosphere();
window.addEventListener('resize', bootAtmosphere);
window.addEventListener('scroll', syncParallax, { passive: true });
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

setInterval(function(){
  if(isLight() && !motionPaused() && Math.random() > 0.3) spawnCluster();
}, 10000 + Math.random() * 7000);

document.addEventListener('themechange', function(){
  // When switching to dark, hide atmosphere immediately (before the 60ms
  // bootAtmosphere delay) so it doesn't bleed through transparent sections.
  if(!isLight()){
    if(atmosphere) atmosphere.style.display = '';
    if(seaFx) seaFx.style.display = '';
  }
  window.setTimeout(bootAtmosphere, 60);
});

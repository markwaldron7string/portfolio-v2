import { isLight } from './state.js';

// Solar dimming — dim the sun and hero when clouds pass over the sun
var heroCont  = document.querySelector('.hero .container');
var sunEl     = document.querySelector('.atm-sun');
var clouds    = null; // populated lazily so DOM is ready
var dim       = 0;
// Clouds have filter:blur(14px); expand their hit-box by this much on each side
// so overlap registers before the visual cloud edge reaches the sun core.
var BLUR_PAD  = 22;

function clamp(v, lo, hi){ return v < lo ? lo : v > hi ? hi : v; }

// Returns fraction 0–1 of the sun's bright core that the (expanded) cloud rect covers.
function overlapRatio(cr, sr){
  var cl  = cr.left   - BLUR_PAD,  crr = cr.right  + BLUR_PAD;
  var ct  = cr.top    - BLUR_PAD,  cb  = cr.bottom + BLUR_PAD;
  // Target only the inner 68% of the sun bbox — the bright disc, not the halo.
  var cx  = (sr.left  + sr.right)  * 0.5;
  var cy  = (sr.top   + sr.bottom) * 0.5;
  var hw  = sr.width  * 0.34,      hh  = sr.height * 0.34;
  var sl  = cx - hw,  sr2 = cx + hw,  st = cy - hh,  sb = cy + hh;
  var ow  = Math.max(0, Math.min(crr, sr2) - Math.max(cl, sl));
  var oh  = Math.max(0, Math.min(cb,  sb)  - Math.max(ct, st));
  var sunArea = (sr2 - sl) * (sb - st);
  return sunArea > 0 ? clamp(ow * oh / sunArea, 0, 1) : 0;
}

// Read cloud opacities once (computed style, not inline) so we don't call
// getComputedStyle every frame.
function initClouds(){
  clouds = Array.from(document.querySelectorAll('.atm-cloud')).map(function(el){
    return { el: el, w: parseFloat(getComputedStyle(el).opacity) || 0.6 };
  });
}

function applyDim(v){
  // Shift hero content brightness; skip identity filter to avoid unnecessary layer.
  if(heroCont) heroCont.style.filter = v > 0.005
    ? 'brightness(' + (1 - v * 0.26).toFixed(4) + ')'
    : '';
}

function tick(){
  if(!isLight()){
    // Fade out any residual dimming when switching to dark mode.
    if(dim > 5e-4){ dim *= 0.88; applyDim(dim); }
    requestAnimationFrame(tick);
    return;
  }

  if(!clouds) initClouds();

  var sr     = sunEl ? sunEl.getBoundingClientRect() : null;
  var target = 0;

  if(sr && sr.width > 0){
    for(var i = 0; i < clouds.length; i++){
      // Each cloud contributes overlap × its opacity; total is clamped to avoid
      // unrealistic total-blackout when several clouds stack over the sun.
      target += overlapRatio(clouds[i].el.getBoundingClientRect(), sr) * clouds[i].w;
    }
    target = clamp(target, 0, 0.86);
  }

  // Lerp toward target — ~0.045 per frame ≈ 1 s ramp at 60 fps, matching
  // how slowly cloud edges visually cross the sun.
  dim += (target - dim) * 0.045;
  applyDim(dim);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// Re-read cloud opacities if new clouds are injected after a theme switch.
document.addEventListener('themechange', function(){ clouds = null; });

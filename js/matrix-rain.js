import { isLight, motionPaused } from './state.js';

const matrixCanvas = document.getElementById('matrix-rain');
const startMatrixRain = () => {
  if(!matrixCanvas) return;
  const ctx = matrixCanvas.getContext('2d');
  const glyphs = '01{}[]<>/=';
  const getMatrixPalette = () =>
    isLight()
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
    if(!motionPaused()) animationId = requestAnimationFrame(drawMatrix);
  };

  resizeMatrix();
  drawMatrix();
  window.addEventListener('resize', resizeMatrix);
  document.addEventListener('themechange', () => { resizeMatrix(); if(motionPaused()) drawMatrix(); });
  document.addEventListener('motionchange', () => { cancelAnimationFrame(animationId); drawMatrix(); });
  window.addEventListener('resize', () => { if(motionPaused()) drawMatrix(); });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(animationId);
    if(!document.hidden) drawMatrix();
  });
};
if('requestIdleCallback' in window){
  requestIdleCallback(startMatrixRain, { timeout: 1800 });
}else{
  window.addEventListener('load', startMatrixRain, { once: true });
}

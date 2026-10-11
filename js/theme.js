import { isLight } from './state.js';

// Project screenshots that have a light-mode variant
const themedImages = {
  '.ls-img': 'leadscraper',
  '.ap-img': 'apworkuptools',
  '.tt-img': 'tasktracker'
};

const swapThemedImages = (light) => {
  Object.entries(themedImages).forEach(([selector, name]) => {
    document.querySelectorAll(selector).forEach(img => {
      img.src = `assets/${name}${light ? '-light' : ''}.png`;
    });
  });
};

// Theme toggle
const toggle = document.getElementById('theme-toggle');
if(toggle){
  const syncPressed = () => toggle.setAttribute('aria-pressed', String(isLight()));
  syncPressed();
  toggle.addEventListener('click', () => {
    if(isLight()){
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
    }
    swapThemedImages(isLight());
    syncPressed();
    document.dispatchEvent(new CustomEvent('themechange'));
  });
  // Apply correct image for initial theme
  if(isLight()) swapThemedImages(true);
}

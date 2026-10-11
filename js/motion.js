import { motionPaused } from './state.js';

// Pause/resume all ambient animation (WCAG 2.2.2)
const toggle = document.getElementById('motion-toggle');
if(toggle){
  const syncPressed = () => toggle.setAttribute('aria-pressed', String(motionPaused()));
  syncPressed();
  toggle.addEventListener('click', () => {
    if(motionPaused()){
      document.documentElement.removeAttribute('data-motion');
      localStorage.setItem('portfolio-motion', 'running');
    } else {
      document.documentElement.setAttribute('data-motion', 'paused');
      localStorage.setItem('portfolio-motion', 'paused');
    }
    syncPressed();
    document.dispatchEvent(new CustomEvent('motionchange'));
  });
}

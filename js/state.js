// Theme and motion state live on <html> as data attributes (set before first paint by the inline script in index.html)
export const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';
export const motionPaused = () => document.documentElement.getAttribute('data-motion') === 'paused';

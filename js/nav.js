import { motionPaused } from './state.js';

// Section jumps land so the section's top border sits under the navbar's bottom border
const navBar = document.querySelector('nav.top');
const sectionOffset = () => (navBar ? navBar.offsetHeight - 1 : 0);
const pageTop = (el) => el.getBoundingClientRect().top + window.scrollY;

// Highlight the nav link for the section currently under the navbar
const navSectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'))
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);
const setActiveNav = (active) => {
  navSectionLinks.forEach((item) => {
    if(item === active) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  });
};

// A clicked link lights up right away and stays lit while the page scrolls to it
let pinnedNav;
let pinnedNavTimer;
const releasePinnedNav = () => {
  if(pinnedNav === undefined) return;
  clearTimeout(pinnedNavTimer);
  pinnedNav = undefined;
  syncActiveNav();
};
const pinActiveNav = (section) => {
  pinnedNav = navSectionLinks.find((item) => item.section === section) || null;
  setActiveNav(pinnedNav);
  clearTimeout(pinnedNavTimer);
  pinnedNavTimer = setTimeout(releasePinnedNav, 200);
};

const syncActiveNav = () => {
  if(pinnedNav !== undefined){
    // Hold the pin until scrolling has been quiet for a moment
    clearTimeout(pinnedNavTimer);
    pinnedNavTimer = setTimeout(releasePinnedNav, 150);
    return;
  }
  const line = sectionOffset() + 2;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let active = null;
  navSectionLinks.forEach((item) => {
    if(item.section.getBoundingClientRect().top <= line) active = item;
  });
  if(atBottom && navSectionLinks.length) active = navSectionLinks[navSectionLinks.length - 1];
  setActiveNav(active);
};
syncActiveNav();
// Scrolling by hand cancels a pending pin
['wheel', 'touchstart', 'keydown'].forEach((type) => {
  window.addEventListener(type, releasePinnedNav, { passive: true });
});
window.addEventListener('scroll', syncActiveNav, { passive: true });
window.addEventListener('resize', syncActiveNav);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id==='#'){
      e.preventDefault();
      pinActiveNav(null);
      window.scrollTo({top:0,behavior:motionPaused()?'auto':'smooth'});
    }else{
      const el=document.querySelector(id);
      if(el){
        e.preventDefault();
        pinActiveNav(el);
        window.scrollTo({top:Math.ceil(pageTop(el)-sectionOffset()),behavior:motionPaused()?'auto':'smooth'});
        if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1');
        el.focus({preventScroll:true});
      }
    }
  });
});

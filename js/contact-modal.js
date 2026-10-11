// Key at https://web3forms.com
const WEB3FORMS_ACCESS_KEY = '1915556d-5569-4112-ab63-585fe764507d';

const contactModal = document.getElementById('contact-modal');
const contactForm = document.getElementById('contact-form');
const contactFormStatus = document.getElementById('contact-form-status');
const contactFormSubmit = document.getElementById('contact-form-submit');
const contactModalTriggers = document.querySelectorAll('.contact-modal-trigger');
const contactCloseTargets = contactModal?.querySelectorAll('[data-contact-close]') || [];
const contactRevealDelayMs = 500;
const contactModalBackground = document.querySelectorAll('nav.top, main, footer');
const submitLabel = 'Send message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
let contactRevealTimer;
let contactReturnFocus;

const setBackgroundInert = (inert) => {
  contactModalBackground.forEach((el) => { el.inert = inert; });
};

const resetContactForm = () => {
  if(contactForm) contactForm.reset();
  if(contactFormStatus){
    contactFormStatus.textContent = '';
    contactFormStatus.className = 'contact-form__status';
  }
  if(contactFormSubmit){
    contactFormSubmit.type = 'submit';
    contactFormSubmit.disabled = false;
    contactFormSubmit.onclick = null;
    contactFormSubmit.innerHTML = submitLabel;
  }
};

const resetContactModal = () => {
  if(!contactModal) return;
  contactModal.classList.remove('is-open', 'is-revealing', 'is-success');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if(contactRevealTimer){
    clearTimeout(contactRevealTimer);
    contactRevealTimer = undefined;
  }
  resetContactForm();
  if(contactForm) contactForm.hidden = false;
};

const openContactModal = () => {
  if(!contactModal) return;
  resetContactModal();
  contactReturnFocus = document.activeElement;
  contactModal.classList.add('is-open');
  contactModal.setAttribute('aria-hidden', 'false');
  setBackgroundInert(true);
  document.body.style.overflow = 'hidden';
  const nameInput = contactForm?.querySelector('input[name="name"]');
  if(nameInput) nameInput.focus({ preventScroll: true });
  contactRevealTimer = window.setTimeout(() => {
    contactModal.classList.add('is-revealing');
  }, contactRevealDelayMs);
};

const closeContactModal = () => {
  if(!contactModal) return;
  contactModal.classList.remove('is-open', 'is-revealing', 'is-success');
  contactModal.setAttribute('aria-hidden', 'true');
  setBackgroundInert(false);
  if(contactReturnFocus && typeof contactReturnFocus.focus === 'function') contactReturnFocus.focus();
  contactReturnFocus = undefined;
  document.body.style.overflow = '';
  if(contactRevealTimer){
    clearTimeout(contactRevealTimer);
    contactRevealTimer = undefined;
  }
  window.setTimeout(resetContactForm, 350);
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
      contactFormStatus.textContent = 'Contact form is not configured yet. Add your Web3Forms access key in js/contact-modal.js.';
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
      contactModal.querySelector('.contact-modal__close')?.focus();
    }catch(error){
      const detail = error instanceof Error ? error.message : 'Request failed';
      contactFormStatus.textContent = `${detail} If this keeps happening, email contact@mark-waldron.com directly.`;
      contactFormStatus.className = 'contact-form__status is-error';
      contactFormSubmit.disabled = false;
      contactFormSubmit.innerHTML = submitLabel;
    }
  });
}

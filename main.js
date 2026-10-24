const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}));

const menuTabs = [...document.querySelectorAll('.menu-tab')];
const menuItems = [...document.querySelectorAll('.menu-item')];
function setMenuFilter(filter, selectedTab = null) {
  menuTabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  menuItems.forEach((item) => {
    item.hidden = filter !== 'all' && item.dataset.category !== filter;
  });
}
menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => setMenuFilter(tab.dataset.filter, tab));
});
setMenuFilter(document.querySelector('.menu-tab.active')?.dataset.filter || 'coffee', document.querySelector('.menu-tab.active'));
document.querySelector('#show-full-menu').addEventListener('click', () => setMenuFilter('all'));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let lastTrigger;
document.querySelectorAll('.gallery-card').forEach((card) => card.addEventListener('click', () => {
  lastTrigger = card;
  lightboxImage.src = card.dataset.full;
  lightboxImage.alt = card.dataset.alt;
  lightboxCaption.textContent = card.dataset.alt;
  lightbox.showModal();
  lightbox.querySelector('.lightbox-close').focus();
}));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  lightboxImage.removeAttribute('src');
  lastTrigger?.focus();
});

const form = document.querySelector('#enquiry-form');
const status = document.querySelector('#form-status');
const fields = [
  { input: form.elements.name, error: document.querySelector('#name-error'), message: 'Please enter at least 2 characters.' },
  { input: form.elements.email, error: document.querySelector('#email-error'), message: 'Please enter a valid email address.' },
  { input: form.elements.message, error: document.querySelector('#message-error'), message: 'Please write a note of at least 10 characters.' },
];
function validateField(field) {
  const { input, error, message } = field;
  const valid = input.checkValidity();
  error.textContent = valid ? '' : (input.validity.typeMismatch ? 'Please enter a valid email address.' : message);
  input.setAttribute('aria-invalid', String(!valid));
  return valid;
}
fields.forEach(({ input, ...field }) => input.addEventListener('blur', () => validateField({ input, ...field })));
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    status.textContent = 'A couple of details need your attention above.';
    status.classList.add('status-error');
    fields.find(({ input }) => !input.checkValidity())?.input.focus();
    return;
  }
  status.textContent = 'Thanks for the lovely note. This is a portfolio demo, so nothing has been sent—no backend is connected.';
  status.classList.remove('status-error');
  form.reset();
  fields.forEach(({ input }) => input.setAttribute('aria-invalid', 'false'));
  fields.forEach(({ error }) => { error.textContent = ''; });
});

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.classList.add('image-fallback');
    image.alt = image.alt || 'Photograph unavailable';
    image.removeAttribute('src');
  }, { once: true });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      target.classList.add('is-visible');
      observer.unobserve(target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));
document.querySelector('#year').textContent = new Date().getFullYear();

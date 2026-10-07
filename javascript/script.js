// Accordion functionality
function toggleAccordion(btn) {
  const item = btn.closest('.accordion-open');

  if (!item) return;

  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.accordion-open').forEach((accordion) => {
    accordion.classList.remove('open');
  });

  if (!isOpen) {
    item.classList.add('open');
  }
}

document.querySelectorAll('form[data-success-page]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.assign(form.dataset.successPage);
  });
});

const menuButton = document.querySelector('.menu-toggle');
const siteNavigation = document.getElementById('site-navigation');

if (menuButton && siteNavigation) {
  const closeMenu = () => {
    document.querySelector('header')?.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    document.querySelector('header')?.classList.toggle('menu-open', !isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  });

  siteNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.matchMedia('(min-width: 825px)').addEventListener('change', closeMenu);
}

// Header hide/show on scroll

const pageHeader = document.querySelector('header');

if (pageHeader) {
  let previousScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - previousScrollY;

    if (currentScrollY <= pageHeader.offsetHeight || scrollDifference < -4) {
      pageHeader.classList.remove('header-hidden');
    } else if (scrollDifference > 4) {
      pageHeader.classList.add('header-hidden');
    }

    previousScrollY = currentScrollY;
  }, { passive: true });
}
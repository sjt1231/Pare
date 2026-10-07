import { initAnalytics, track } from './analytics.js';
import './style.css';

initAnalytics();

document.querySelectorAll('a[href="#interest"]').forEach(link => {
  link.addEventListener('click', () => track('cta_clicked', {
    location: link.closest('header') ? 'header' : link.closest('dialog') ? 'preview' : 'hero',
  }));
});

const icons = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3"/>',
  check:'<path d="m7 12 3 3 7-7"/><circle cx="12" cy="12" r="9"/>',
  file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8m-8 4h5"/>',
  chart:'<path d="M4 20V10h4v10m4 0V4h4v16m4 0v-7h2v7M2 20h20"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  cloud:'<path d="M7 19h11a4 4 0 0 0 1-7.87A7 7 0 0 0 5.4 9.6 4.8 4.8 0 0 0 7 19Z"/>',
  link:'<path d="m10 13 4-4m-7 6-1 1a4 4 0 0 0 6 6l3-3a4 4 0 0 0 0-6M9 11a4 4 0 0 1 0-6l3-3a4 4 0 0 1 6 6l-1 1"/>',
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
  pause:'<path d="M9 5v14M15 5v14"/>',
  play:'<path d="m8 5 11 7-11 7V5Z"/>',
};
const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.file}</svg>`;
function hydrateIcons(root = document) { root.querySelectorAll('i[data-icon]').forEach(el => { el.innerHTML = svg(el.dataset.icon); }); }
hydrateIcons();
document.querySelector('#year').textContent = new Date().getFullYear();

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const panel = document.querySelector('#dashboard-panel');
const evidence = document.querySelector('#evidence-content');
const tabs = [...document.querySelectorAll('[data-view]')];
const rows = [
  { name: 'Cloud hosting', description: 'Compute · Storage · Network', icon: 'cloud', path: 'M1 20L10 16L19 17L28 10L37 13L46 5L59 2', usage: '68%', status: 'Available' },
  { name: 'Team software', description: 'Productivity · Design · Dev', icon: 'grid', path: 'M1 19L10 19L19 14L28 15L37 9L46 10L59 4', usage: '42%', status: 'Partial' },
  { name: 'API services', description: 'Data · AI · Communications', icon: 'layers', path: 'M1 17L10 14L19 18L28 11L37 14L46 6L59 3', usage: '78%', status: 'Available' },
];
const views = {
  spend: { title: 'The whole picture.', column: 'Spend trend', last: 'Usage coverage', heading: 'A review worth your attention.', items: [['file', 'Billing evidence', 'Recent charges brought together'], ['layers', 'Contract terms', 'Notice periods and commitments'], ['chart', 'Usage signals', 'Available for supported services']] },
  usage: { title: 'Spend meets usage.', column: 'Observed usage', last: 'Evidence', heading: 'Context before conclusions.', items: [['chart', 'Observed activity', 'Compare capacity with utilisation'], ['lock', 'Coverage matters', 'Missing data is not inactivity'], ['check', 'Service owner review', 'Confirm operational requirements']] },
  renewals: { title: 'Ahead of the deadline.', column: 'Review window', last: 'Next step', heading: 'Prepare before options close.', items: [['calendar', 'Notice period', 'Review the latest action date'], ['layers', 'Contract restrictions', 'Confirm which changes are allowed'], ['check', 'Owner approval', 'Agree on the next step together']] },
};
let currentView = 'spend';
function renderView(name, animate = true) {
  currentView = name;
  const view = views[name];
  document.querySelector('#dashboard-title').textContent = view.title;
  panel.setAttribute('aria-labelledby', `tab-${name}`);
  panel.innerHTML = `<div class="table-head"><span>Service</span><span>${view.column}</span><span>${view.last}</span></div>` + rows.map((row, index) => `<div class="vendor-row"><div class="vendor-cell"><i data-icon="${row.icon}"></i><div><strong>${row.name}</strong><small>${row.description}</small></div></div><div>${name === 'spend' ? `<svg class="sparkline" viewBox="0 0 60 24" aria-label="Illustrative spending trend"><path d="${row.path}"/></svg>` : name === 'usage' ? `<div class="usage-track"><span style="--usage:${row.usage}"></span></div><span>${row.usage}</span>` : `<span>${['Within 90 days', 'Within 60 days', 'Monthly review'][index]}</span>`}</div><span class="tag ${index === 1 ? 'partial' : ''}">${name === 'renewals' ? ['Check terms', 'Review seats', 'Check usage'][index] : row.status}</span></div>`).join('');
  evidence.innerHTML = `<h3>${view.heading}</h3><div class="evidence-items">${view.items.map(([icon, title, detail]) => `<div class="evidence-item"><i data-icon="${icon}"></i><div>${title}<small>${detail}</small></div></div>`).join('')}</div>`;
  tabs.forEach(tab => { const active = tab.dataset.view === name; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  updateIndicator(); hydrateIcons(panel); hydrateIcons(evidence);
  if (animate && !reduced.matches) {
    [panel, evidence].forEach(el => el.animate([{ opacity: .3, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }));
  }
}
function updateIndicator() { const active = tabs.find(t => t.dataset.view === currentView); const line = document.querySelector('.tab-indicator'); line.style.width = `${active.offsetWidth}px`; line.style.transform = `translateX(${active.offsetLeft}px)`; }
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderView(tab.dataset.view));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); renderView(tabs[next].dataset.view); }
  });
});
renderView('spend', false);
document.fonts.ready.then(updateIndicator);
window.addEventListener('resize', updateIndicator);

const faqItems = [
  ['Is Pare available now?', 'Pare is in pre-launch. We are inviting companies to express interest in a pilot spend review and help us assess where the service can be useful. The preview above illustrates the proposed experience.'],
  ['What do I need to share?', 'Nothing sensitive to register interest. If we agree to a review, we will discuss selected invoices, contracts and any useful read-only integrations with you first. A full inbox connection is not required.'],
  ['Which services can Pare review?', 'The initial focus is recurring cloud and software spend. Usage analysis depends on the vendor, your plan and the permissions available. We will confirm coverage for your company before starting a review.'],
  ['Will Pare contact vendors automatically?', 'Vendor communications and consequential changes require your approval. You can review prepared messages and choose whether to send them yourself.'],
  ['How would fees work?', 'There is no payment required to register interest. The proposed model is an agreed share of verified savings. Any review scope, fee and savings calculation would be agreed in writing before paid work begins.'],
];
document.querySelector('.faq-list').innerHTML = faqItems.map(([question, answer], index) => `<article class="faq-item ${index === 0 ? 'open' : ''}"><h3><button class="faq-question" id="faq-question-${index}" aria-expanded="${index === 0}" aria-controls="faq-answer-${index}">${question}<span class="faq-plus" aria-hidden="true"></span></button></h3><div class="faq-answer" id="faq-answer-${index}" role="region" aria-labelledby="faq-question-${index}" ${index ? 'inert' : ''}><div><p>${answer}</p></div></div></article>`).join('');
document.querySelectorAll('.faq-question').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.faq-item'); const open = item.classList.toggle('open'); button.setAttribute('aria-expanded', String(open)); item.querySelector('.faq-answer').inert = !open;
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('in-view', entry.isIntersecting || entry.target.dataset.revealed === 'true');
  if (entry.isIntersecting && !entry.target.classList.contains('flow-visual')) entry.target.dataset.revealed = 'true';
}), { threshold: .12 });
document.querySelectorAll('.value-section, .process-section, .control-section, .faq-section, .interest-layout, .flow-visual').forEach(el => observer.observe(el));
document.documentElement.classList.add('js-motion');
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 15), { passive: true });
const menu = document.querySelector('.menu-button'); const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobileNav.hidden = !open; });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const stage = document.querySelector('.product-stage'); const productWindow = document.querySelector('.product-window');
const motionToggle = document.querySelector('#motion-toggle'); let paused = false; let frame;
stage.addEventListener('pointermove', event => {
  if (reduced.matches || paused || event.pointerType !== 'mouse') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => { const rect = stage.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; productWindow.style.transform = `rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`; });
});
stage.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); productWindow.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; productWindow.style.transform = ''; setTimeout(() => productWindow.style.transition = '', 600); });
motionToggle.addEventListener('click', () => { paused = !paused; document.body.classList.toggle('motion-paused', paused); motionToggle.setAttribute('aria-pressed', String(paused)); motionToggle.setAttribute('aria-label', paused ? 'Resume background animation' : 'Pause background animation'); motionToggle.innerHTML = `<i data-icon="${paused ? 'play' : 'pause'}"></i>`; hydrateIcons(motionToggle); productWindow.style.transform = ''; });
reduced.addEventListener('change', () => { productWindow.style.transform = ''; });

document.querySelectorAll('.privacy-trigger').forEach(button => button.addEventListener('click', () => document.querySelector('#privacy-dialog').showModal()));
document.querySelector('#review-action').addEventListener('click', () => document.querySelector('#review-dialog').showModal());
document.querySelectorAll('dialog').forEach(dialog => { dialog.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click', () => dialog.close())); dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }); });
document.querySelector('#review-interest').addEventListener('click', () => document.querySelector('#review-dialog').close());

const form = document.querySelector('#interest-form');
let formStarted = false;
form.addEventListener('input', event => {
  if (formStarted || !['email', 'company', 'spend', 'services'].includes(event.target.name)) return;
  formStarted = true;
  track('form_started');
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type=submit]'); const status = document.querySelector('#form-status');
  button.disabled = true; button.textContent = 'Saving your interest…'; status.textContent = '';
  try {
    const response = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.errors?.map(item => item.message).join(' ') || 'Your enquiry could not be registered. Please try again.');
    track('form_submitted', { spend_band: form.elements.spend.value, spend_period: 'monthly', spend_scope: 'cloud_software' });
    form.innerHTML = `<div class="form-success" role="status" tabindex="-1"><i data-icon="check"></i><h3>Your interest is registered.</h3><p>Thank you. The Pare team has received your review enquiry and will assess pilot fit.</p><p class="quiet-note">No accounts have been connected and no payment is required.</p></div>`;
    hydrateIcons(form); form.querySelector('.form-success').focus();
  } catch (error) { status.textContent = error.message === 'Failed to fetch' ? 'We could not connect. Check your connection and try again.' : error.message; button.disabled = false; button.innerHTML = 'Register interest <span class="arrow">↗</span>'; }
});

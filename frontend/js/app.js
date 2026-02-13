// ═══════════════════════════════════════════════
// APP.JS — Initialisation, Routing & Global State
// ═══════════════════════════════════════════════
import { initDashChart }    from './charts.js';
import { initReportCharts } from './charts.js';
import { initMarathon }     from './marathon.js';
import { renderLeaderboard } from './community.js';
import { initTheme }        from './theme.js';
import { spawnParticles }   from './celebrations.js';

// ─── Global state ─────────────────────────────
export const state = {
  user:       null,     // { name, age, height, weight, sleep, steps, goal }
  points:     0,
  streak:     0,
  isDark:     false,
  token:      null,
};

// ─── Section registry ─────────────────────────
const SECTIONS = ['onboarding','home','dashboard','log','community','marathon','report'];

// ─── Show a section ───────────────────────────
export function showSection(name) {
  if (!SECTIONS.includes(name)) return;
  SECTIONS.forEach(id => {
    const el = document.getElementById(`sec-${id}`);
    if (el) { el.classList.remove('active'); el.style.display = 'none'; }
  });

  const target = document.getElementById(`sec-${name}`);
  if (!target) return;
  target.style.display = 'block';
  target.classList.add('active');

  // Stagger animation
  target.style.opacity = '0';
  target.style.transform = 'translateY(18px)';
  requestAnimationFrame(() => {
    target.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    target.style.opacity = '1';
    target.style.transform = 'translateY(0)';
  });

  // Nav highlight
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const active = document.querySelector(`.nav-btn[data-section="${name}"]`);
  if (active) active.classList.add('active');

  // Close mobile menu
  document.getElementById('navLinks')?.classList.remove('open');

  // Lazy init charts on demand
  if (name === 'dashboard') initDashChart();
  if (name === 'report')    initReportCharts();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  spawnParticles();
  initMarathon();
  renderLeaderboard('panelLeaderboard');
  renderLeaderboard('communityLeaderboard');

  // Nav button wiring
  document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showSection(btn.dataset.section);
    });
  });

  // Hamburger
  const ham = document.getElementById('hamBtn');
  const nav = document.getElementById('navLinks');
  ham?.addEventListener('click', () => nav?.classList.toggle('open'));

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      import('./food-log.js').then(m => m.closePopup());
      import('./onboarding.js').then(m => m.closeProfilePanel?.());
    }
  });

  // Show onboarding first
  showSection('onboarding');
});

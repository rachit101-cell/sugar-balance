// ═══════════════════════════════════════════════
// POINTS.JS — Counter animation & streak logic
// ═══════════════════════════════════════════════
import { state } from './app.js';

// ─── Animate points counter ───────────────────
export function animatePoints(target) {
  const selectors = ['#navPoints', '#dash-points', '.panel-points-val'];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      const start = parseInt(el.textContent.replace(/,/g, '')) || 0;
      const diff  = target - start;
      const steps = 24;
      let step    = 0;

      const interval = setInterval(() => {
        step++;
        const val = Math.round(start + (diff * step / steps));
        el.textContent = val.toLocaleString();
        if (step >= steps) clearInterval(interval);
      }, 20);
    });
  });
}

// ─── Award points (add to state + animate) ────
export function updatePoints(delta) {
  state.points += delta;
  animatePoints(state.points);
  _showFloatingPoints(`+${delta}`);
}

// ─── Floating "+20" animation near cursor ─────
function _showFloatingPoints(text) {
  const el = document.createElement('div');
  el.textContent = `${text} ⭐`;
  el.style.cssText = `
    position: fixed; top: 80px; right: 60px; z-index: 4500;
    font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700;
    color: #C084FC; pointer-events: none;
    animation: pointsRise 1.6s ease forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

// ─── Update streak display ────────────────────
export function updateStreak(count) {
  state.streak = count;
  document.querySelectorAll('.streak-count').forEach(el => el.textContent = `${count} Day Streak`);
}

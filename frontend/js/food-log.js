// ═══════════════════════════════════════════════
// FOOD-LOG.JS — Tab switching, food selection,
//               sugar simulation popup
// ═══════════════════════════════════════════════
import { food }       from './api.js';
import { animatePoints, updatePoints } from './points.js';
import { showToast }  from './celebrations.js';

let currentLogId = null;  // ID returned from backend after logging

// ─── Tab switching ────────────────────────────
export function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const btn     = document.querySelector(`.tab-btn[data-tab="${name}"]`);
  const content = document.getElementById(`tab-${name}`);
  btn?.classList.add('active');
  content?.classList.add('active');
}

// ─── Log a food item ──────────────────────────
export async function logFood(item, level, brix, emoji, category) {
  // Sugar simulation popup config
  _configPopup(item, level, brix, emoji);
  openPopup();

  // Hit backend (fire & forget for UX; await result for logId)
  try {
    const res = await food.logFood({ item, sugarLevel: level, brix, emoji, category });
    currentLogId = res.log._id;
  } catch {
    // In offline / demo mode log is still shown to user
  }
}

// ─── Complete corrective action ───────────────
export async function completeAction(type, label, icon) {
  closePopup();
  let pointsAwarded = 20;

  try {
    if (currentLogId) {
      const res = await food.completeCorrectiveAction(currentLogId, type);
      pointsAwarded = res.pointsAwarded;
    }
  } catch { /* offline fallback */ }

  updatePoints(pointsAwarded);
  showToast(`${icon} ${label} done! +${pointsAwarded} pts ⭐`);
  currentLogId = null;
}

// ─── Popup helpers ────────────────────────────
function _configPopup(name, level, brix, emoji) {
  document.getElementById('popupEmoji').textContent  = emoji;
  document.getElementById('popupTitle').textContent  = `${name} Logged!`;
  document.getElementById('popupBrix').textContent   = `${brix}°`;

  const colourMap = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };
  const levelEl   = document.getElementById('popupLevel');
  levelEl.textContent  = level;
  levelEl.style.color  = colourMap[level];

  // Animate the SVG ring
  const ring        = document.getElementById('popupRing');
  const circumference = 314;
  const pct         = Math.min(brix / 24, 1);
  const colorMap2   = { Low: '#34D399', Medium: '#FBBF24', High: '#FB7185' };
  ring.style.stroke         = colorMap2[level];
  ring.style.strokeDashoffset = circumference;

  setTimeout(() => {
    ring.style.strokeDashoffset = circumference - circumference * pct;
  }, 80);

  // Glow class
  const popupCard = document.querySelector('#sugarPopup .modal-card');
  popupCard?.classList.remove('glow-low','glow-medium','glow-high');
  const glowMap = { Low:'glow-low', Medium:'glow-medium', High:'glow-high' };
  popupCard?.classList.add(glowMap[level]);
}

export function openPopup() {
  document.getElementById('sugarPopup')?.classList.add('open');
}
export function closePopup() {
  document.getElementById('sugarPopup')?.classList.remove('open');
}

// ─── Wire up all food cards ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Tab buttons
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Food cards
  document.querySelectorAll('.food-card[data-item]').forEach(card => {
    card.addEventListener('click', () => {
      logFood(
        card.dataset.item,
        card.dataset.level,
        +card.dataset.brix,
        card.dataset.emoji,
        card.dataset.category,
      );
    });
  });

  // Corrective action buttons
  document.querySelectorAll('.corr-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () =>
      completeAction(btn.dataset.type, btn.dataset.label, btn.dataset.icon)
    );
  });

  // Close popup
  document.getElementById('popupClose')?.addEventListener('click', closePopup);
  document.getElementById('sugarPopup')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closePopup();
  });
});

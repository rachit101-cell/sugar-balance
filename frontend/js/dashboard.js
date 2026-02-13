// ═══════════════════════════════════════════════
// DASHBOARD.JS — Stats refresh, task toggling
// ═══════════════════════════════════════════════
import { users }       from './api.js';
import { animatePoints, updatePoints } from './points.js';
import { showToast }   from './celebrations.js';
import { initDashChart } from './charts.js';
import { initPanelChart } from './charts.js';

// ─── Load dashboard data ──────────────────────
export async function loadDashboard() {
  try {
    const res  = await users.getStats();
    const data = res.stats;

    animatePoints(data.points);
    document.querySelector('.streak-count')?.textContent && (document.querySelector('.streak-count').textContent = `${data.streak} Day Streak`);
  } catch {}

  initDashChart();
}

// ─── Toggle daily task ────────────────────────
export function toggleTask(el) {
  if (el.classList.contains('done')) return;  // already done
  el.classList.add('done');
  updatePoints(10);
  showToast('Task done! +10 pts ⭐');
  el.style.transform = 'scale(1.05)';
  setTimeout(() => (el.style.transform = ''), 220);
}

// ─── Wire tasks ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#todayTasks .task-item').forEach(item => {
    item.addEventListener('click', () => toggleTask(item));
  });
});

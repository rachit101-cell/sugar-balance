// ═══════════════════════════════════════════════
// CHARTS.JS — All Chart.js instances
// ═══════════════════════════════════════════════
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4/+esm';

const instances = {};  // keep references to destroy before re-init

function destroy(key) {
  if (instances[key]) { instances[key].destroy(); delete instances[key]; }
}

// ─── Shared defaults ──────────────────────────
const sharedOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#9B71C2', font: { size: 11, family: 'DM Sans' } } } },
  scales: {
    x: { grid: { color: 'rgba(180,140,200,0.1)' }, ticks: { color: '#9B71C2' } },
    y: { grid: { color: 'rgba(180,140,200,0.1)' }, ticks: { color: '#9B71C2' } },
  },
};

// ─── Dashboard: weekly points line chart ──────
export function initDashChart() {
  destroy('dash');
  const ctx = document.getElementById('dashChart');
  if (!ctx) return;

  instances.dash = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Points',
        data: [120, 185, 160, 220, 195, 240, 180],
        borderColor: '#C084FC',
        backgroundColor: 'rgba(192,132,252,0.15)',
        borderWidth: 3, tension: 0.45, fill: true,
        pointBackgroundColor: '#C084FC', pointRadius: 5, pointHoverRadius: 8,
      }],
    },
    options: { ...sharedOpts, plugins: { legend: { display: false } } },
  });
}

// ─── Profile panel: bar chart ─────────────────
export function initPanelChart() {
  destroy('panel');
  const ctx = document.getElementById('panelChart');
  if (!ctx) return;

  instances.panel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['M','T','W','T','F','S','S'],
      datasets: [{
        data: [120, 185, 160, 220, 195, 240, 180],
        backgroundColor(ctx) {
          const g = ctx.chart.ctx.createLinearGradient(0,0,0,130);
          g.addColorStop(0,'rgba(192,132,252,0.85)');
          g.addColorStop(1,'rgba(251,113,133,0.4)');
          return g;
        },
        borderRadius: 8, borderSkipped: false,
      }],
    },
    options: {
      ...sharedOpts,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { color: '#9B71C2', font: { size: 10 } } }, y: { display: false } },
    },
  });
}

// ─── Report: activity bar chart ───────────────
export function initActivityChart() {
  destroy('activity');
  const ctx = document.getElementById('activityChart');
  if (!ctx) return;

  instances.activity = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [
        { label: 'Steps (k)',  data: [6.2,8.1,5.5,7.8,9.0,6.5,7.2], backgroundColor: 'rgba(52,211,153,0.72)',  borderRadius: 8, borderSkipped: false },
        { label: 'Sleep (h)',  data: [7,8,6.5,7.5,8,7,8],            backgroundColor: 'rgba(192,132,252,0.65)', borderRadius: 8, borderSkipped: false },
      ],
    },
    options: sharedOpts,
  });
}

// ─── Report: sugar doughnut ───────────────────
export function initSugarPieChart() {
  destroy('pie');
  const ctx = document.getElementById('sugarPieChart');
  if (!ctx) return;

  instances.pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Low Sugar','Medium Sugar','High Sugar'],
      datasets: [{
        data: [45, 35, 20],
        backgroundColor: ['rgba(52,211,153,0.88)','rgba(251,191,36,0.88)','rgba(251,113,133,0.88)'],
        borderWidth: 0, hoverOffset: 10,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: { legend: { position: 'bottom', labels: { color: '#9B71C2', padding: 16, font: { size: 11 } } } },
    },
  });
}

// ─── Report: combined init ─────────────────────
export function initReportCharts() {
  initActivityChart();
  initSugarPieChart();
}

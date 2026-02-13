// ═══════════════════════════════════════════════
// MARATHON.JS — 7-day challenge logic
// ═══════════════════════════════════════════════
import { marathon as marathonApi } from './api.js';
import { updatePoints }            from './points.js';
import { showToast, celebrate }    from './celebrations.js';

const PLANS = [
  { title:'Reset Day',       tasks:['Sleep by 10 PM','Drink 8 glasses of water','Skip all sugary drinks','10-min morning walk','Eat 2 fruits'] },
  { title:'Hydrate & Walk',  tasks:['20-min brisk walk','Drink 3L of water','No cold drinks','Fruit for breakfast','5-min stretching'] },
  { title:'Strength Day',    tasks:['15-min exercise','Eat a healthy breakfast','Skip all sweets','Sleep 7+ hours','Log every meal'] },
  { title:'Mindful Eating',  tasks:['No processed sugar','5-min meditation','Walk after dinner','Fresh juice only','Sleep check ✓'] },
  { title:'Challenge Peak',  tasks:['30-min activity','Zero soda day','Eat vegetables','8+ hours sleep','Community check-in'] },
  { title:'Cool Down',       tasks:['Light yoga 10 min','2 fruit servings','Hydrate well','No late-night snacks','Journal 3 gratitudes'] },
  { title:'Victory Day! 🏆', tasks:['Full 20-min workout','Celebrate healthy meal','Share with community','Log all food','Claim your trophy! 🏆'] },
];

// Local state (synced with backend on load)
let dayStates = PLANS.map(p => ({
  completed: false,
  tasks: p.tasks.map(t => ({ text: t, done: false })),
}));

// ─── Render ───────────────────────────────────
export function renderMarathon() {
  const grid = document.getElementById('marathonGrid');
  if (!grid) return;
  grid.innerHTML = '';

  PLANS.forEach((plan, di) => {
    const ds   = dayStates[di];
    const card = document.createElement('div');
    card.className = `glass card day-card${ds.completed ? ' completed' : ''}`;
    card.innerHTML = `
      <div class="day-num">Day ${di + 1}</div>
      <div class="day-title">${plan.title}</div>
      <ul class="task-list">
        ${ds.tasks.map((task, ti) => `
          <li class="task-item${task.done ? ' done' : ''}" data-day="${di}" data-task="${ti}">
            <div class="task-check"></div>${task.text}
          </li>
        `).join('')}
      </ul>
    `;
    grid.appendChild(card);
  });

  // Wire task clicks
  grid.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', () => toggleMarathonTask(+item.dataset.day, +item.dataset.task, item));
  });

  _updateProgress();
}

// ─── Toggle task ──────────────────────────────
async function toggleMarathonTask(di, ti, el) {
  if (dayStates[di].tasks[ti].done) return;
  dayStates[di].tasks[ti].done = true;

  el.classList.add('done');
  el.style.transform = 'scale(1.04)';
  setTimeout(() => el.style.transform = '', 220);

  // Check if day complete
  const allDone = dayStates[di].tasks.every(t => t.done);
  if (allDone) {
    dayStates[di].completed = true;
    el.closest('.day-card')?.classList.add('completed');
  }

  // Backend sync
  try { await marathonApi.completeTask(di, ti); } catch {}

  updatePoints(15);
  showToast('Task done! +15 pts ⭐');
  _updateProgress();
}

// ─── Progress bar ─────────────────────────────
function _updateProgress() {
  const total = dayStates.reduce((s, d) => s + d.tasks.length, 0);
  const done  = dayStates.reduce((s, d) => s + d.tasks.filter(t => t.done).length, 0);
  const pct   = Math.round((done / total) * 100);

  const bar  = document.getElementById('marathonBar');
  const pctEl = document.getElementById('marathonPct');
  if (bar)   bar.style.width  = `${pct}%`;
  if (pctEl) pctEl.textContent = `${pct}%`;

  // Sub-label
  const daysComplete = dayStates.filter(d => d.completed).length;
  const subEl = document.getElementById('marathonSub');
  if (subEl) subEl.textContent = `${daysComplete} of 7 days completed • ${7 - daysComplete} days remaining`;
}

// ─── Check & claim completion ─────────────────
export async function checkMarathon() {
  // Mark all done for demo; in production check actual state
  dayStates.forEach(d => { d.completed = true; d.tasks.forEach(t => t.done = true); });
  renderMarathon();

  try { await marathonApi.complete(); } catch {}
  celebrate();
  updatePoints(200);
}

// ─── Init ─────────────────────────────────────
export async function initMarathon() {
  try {
    const res = await marathonApi.get();
    // Map backend state onto local dayStates
    res.marathon.days.forEach((day, i) => {
      if (dayStates[i]) {
        dayStates[i].completed = day.completed;
        day.tasks.forEach((t, j) => {
          if (dayStates[i].tasks[j]) dayStates[i].tasks[j].done = t.done;
        });
      }
    });
  } catch {}  // offline fallback – use default state

  renderMarathon();

  // Wire check button
  document.getElementById('marathonCheckBtn')?.addEventListener('click', checkMarathon);
}

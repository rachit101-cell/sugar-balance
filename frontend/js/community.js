// ═══════════════════════════════════════════════
// COMMUNITY.JS — Groups & leaderboard
// ═══════════════════════════════════════════════
import { community as communityApi } from './api.js';
import { updatePoints }              from './points.js';
import { showToast }                 from './celebrations.js';

// Fallback static leaderboard data for demo/offline
const STATIC_LB = [
  { name:'Sarah J.', todayPoints:240, totalPoints:1240, emoji:'👩', you:true  },
  { name:'Rahul M.', todayPoints:200, totalPoints:1180, emoji:'👨' },
  { name:'Priya S.', todayPoints:160, totalPoints: 960, emoji:'👩' },
  { name:'Aiden K.', todayPoints:140, totalPoints: 840, emoji:'🧒' },
  { name:'Meera R.', todayPoints:120, totalPoints: 720, emoji:'👩' },
  { name:'Sam T.',   todayPoints:100, totalPoints: 680, emoji:'👦' },
  { name:'Layla H.', todayPoints: 80, totalPoints: 540, emoji:'👧' },
];

// ─── Render leaderboard into a container ──────
export async function renderLeaderboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let data = STATIC_LB;
  try {
    const res = await communityApi.leaderboard();
    if (res.ranking?.length) data = res.ranking;
  } catch {}

  container.innerHTML = '';
  data.forEach((user, i) => {
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
    const row = document.createElement('div');
    row.className = `lb-row${user.you ? ' you' : ''}`;
    row.innerHTML = `
      <div class="lb-rank ${rankClass}">${rankLabel}</div>
      <div class="lb-avatar">${user.emoji || '👤'}</div>
      <div class="lb-name">
        ${user.name}
        ${user.you ? '<span style="font-size:.7rem;background:linear-gradient(135deg,#C084FC,#FB7185);color:white;padding:2px 7px;border-radius:8px;margin-left:6px">You</span>' : ''}
      </div>
      <div class="lb-pts">${(user.todayPoints || user.totalPoints || 0).toLocaleString()} ⭐</div>
    `;
    container.appendChild(row);
  });
}

// ─── Join group ───────────────────────────────
export async function joinGroup(btn, groupId, groupName) {
  try {
    await communityApi.joinGroup(groupId);
  } catch {}  // offline graceful

  btn.textContent = '✅ Joined!';
  btn.style.background = 'linear-gradient(135deg, rgba(52,211,153,0.4), rgba(16,185,129,0.3))';
  btn.style.color = '#065F46';
  btn.disabled = true;

  updatePoints(50);
  showToast(`🎉 Welcome to ${groupName}! +50 pts`);
}

// ─── Wire group buttons on DOM ready ──────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.join-btn[data-group]').forEach(btn => {
    btn.addEventListener('click', () =>
      joinGroup(btn, btn.dataset.groupId, btn.dataset.group)
    );
  });
});
